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

  // Send tokens to client
  res.status(200).json({ accessToken, refreshToken });
};

// Refresh token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

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
