import express from "express";
import { editUserController, loginController, logoutController, signupController } from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", authMiddleware, checkDepartment(["admin"]), signupController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/edit-user/:user_id", authMiddleware, checkDepartment(["admin", "sales"]), editUserController);

export default authRouter;

