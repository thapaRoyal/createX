import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config";
import { AppError } from "../utils/error.handler";
import logger from "../utils/logger";

interface IRequestWithUser extends Request {
  userId?: string;
}

export const authenticateUser = async (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("Authenticating user", req.cookies);
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.error("Unauthorized: Invalid token", { error });
    return next(new AppError("Invalid token", 401)); // 401 for Unauthorized error
  }
};
