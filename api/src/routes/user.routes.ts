import express from "express";
import { getUserDetails } from "../controllers/user.controller";

const userRoute = express.Router();

userRoute.get("/user/:id", getUserDetails);

export default userRoute;
