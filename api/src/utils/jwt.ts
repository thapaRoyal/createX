import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, envConfig.ACCESS_TOKEN_SECRET, {
    expiresIn: envConfig.ACCESS_TOKEN_LIFE,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, envConfig.REFRESH_TOKEN_SECRET, {
    expiresIn: envConfig.REFRESH_TOKEN_LIFE,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET) as {
    userId: string;
  };
};
