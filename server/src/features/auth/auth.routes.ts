import express from "express";
import { loginController, logoutController, signupController } from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", authMiddleware, checkDepartment(["admin"]), signupController);
authRouter.post("/logout", authMiddleware, checkDepartment(["admin", "sales", "factory", "drawing"]), logoutController);

export default authRouter;

