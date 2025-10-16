import express from "express";
import { changePasswordController, editUserController, getUserDetailController, loginController, logoutController, resetPasswordController, signupController } from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", authMiddleware, checkDepartment(["admin"]), signupController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/edit-user/:user_id", authMiddleware, checkDepartment(["admin"]), editUserController);
authRouter.post("/change-password", authMiddleware, changePasswordController);
authRouter.post("/reset-password/:id", authMiddleware, checkDepartment(["admin"]), resetPasswordController);
authRouter.get("/user-info", authMiddleware, getUserDetailController);

export default authRouter;

