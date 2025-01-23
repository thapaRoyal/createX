import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user.service";
import { LoginResponse, RegisterResponse } from "../utils/auth.types.";
import { AppError } from "../utils/error.handler";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import logger from "../utils/logger";

// User registration
export const registerUser = async (
  req: Request,
  res: Response<RegisterResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using Prisma
    const user = await createUser(email, hashedPassword);

    const accessToken = generateAccessToken(user.id);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes (or your desired access token expiry)
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      accessToken: accessToken,
    });
  } catch (error) {
    logger.error("Error during registration", { error });
    return next(new AppError("Registration failed", 500));
  }
};

// User login
export const loginUser = async (
  req: Request,
  res: Response<LoginResponse>,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError("Incorrect password", 401));
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes (or your desired access token expiry)
    });

    // Set refresh token as an HttpOnly cookie
    res.cookie("access_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send accessToken in the response
    res.status(200).json({
      accessToken: accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    logger.error("Error during login", { email, error }); // Include email for tracing purposes
    return next(new AppError("Login failed", 500));
  }
};

// Refresh token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken; // Extract from cookie

  if (!refreshToken) {
    return next(new AppError("Refresh token is required", 400));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    logger.error(`Error in refresh token:`, { error });
    return next(new AppError("Invalid refresh token", 403));
  }
};

// Logout user
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear both access and refresh tokens
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Error during logout", { error });
    next(new AppError("Logout failed", 500));
  }
};
