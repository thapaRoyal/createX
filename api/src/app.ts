import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./utils/error.handler";

const app = express();
app.use(cors());

app.use(express.json());
dotenv.config();

// Register routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
