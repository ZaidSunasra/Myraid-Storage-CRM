import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { editPermissionController, getPermissionsController } from "./permission.controller";

const permissionRouter = express.Router();

permissionRouter.get("/get-all", authMiddleware, getPermissionsController);
permissionRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin"]), editPermissionController)

export default permissionRouter;