import express from "express";
import { loginController, logoutController, signupController } from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/signup",  authMiddleware, checkDepartment(["ADMIN"]), signupController);
authRouter.post("/logout", authMiddleware, checkDepartment(["ADMIN", "MARKETING", "FACTORY", "DRAWING"]), logoutController)

export default authRouter;