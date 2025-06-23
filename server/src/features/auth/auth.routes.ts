import express from "express";
import { loginController, signupController } from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/signup",  authMiddleware, checkDepartment(["ADMIN"]), signupController);

export default authRouter;