import express from "express";
import { getUserDetails } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const userRoute = express.Router();

userRoute.get("/profile", authenticateUser, getUserDetails);

export default userRoute;
