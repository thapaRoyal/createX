import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user.service";
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
  res: Response,
  next: NextFunction
) => {
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

  res
    .status(201)
    .json({ message: "User registered successfully", userId: user.id });
};

// User login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Compare passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect password", 401));
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set refresh token as an HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "strict", // Prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send only the accessToken in the response
  res.status(200).json({ accessToken });
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

    res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(`Error in refresh token:`, { error });
    return next(new AppError("Invalid refresh token", 403));
  }
};
