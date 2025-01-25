import { NextFunction, Request, Response } from "express";
import { findUserById } from "../services/user.service";
import { AppError } from "../utils/error.handler";
import logger from "../utils/logger";
import { IUser } from "../utils/user.types";

interface IRequestWithUser extends Request {
  userId?: string;
}

export const getUserDetails = async (
  req: IRequestWithUser,
  res: Response<IUser>,
  next: NextFunction
) => {
  const userId = req.userId;
  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Send user response
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    logger.error("Error fetching user", { error });
    return next(new AppError("Failed to fetch user details", 500));
  }
};
