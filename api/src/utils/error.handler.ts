// /utils/appError.ts

import { NextFunction, Request, Response } from "express";

// AppError Class
export class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Handler Middleware
export const errorHandler = (
  err: AppError, // Custom error type
  req: Request, // Express request type
  res: Response, // Express response type
  next: NextFunction // Express next function type
) => {
  const { statusCode = 500, message } = err;

  // Pass the error to the next middleware (if necessary)
  next(err);

  // Send the error response
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: message || "Something went wrong",
  });
};
