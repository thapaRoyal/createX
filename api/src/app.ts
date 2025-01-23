import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoute from "./routes/auth.routes";
import userRoute from "./routes/user.routes";
import { errorHandler } from "./utils/error.handler";

const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
dotenv.config();

// Register routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

// Error handling middleware
app.use(errorHandler);

export default app;
