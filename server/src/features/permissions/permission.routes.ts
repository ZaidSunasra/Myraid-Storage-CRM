import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import checkDepartment from "../../middlewares/department.middleware.js";
import { editPermissionController, getPermissionsController } from "./permission.controller.js";

const permissionRouter = express.Router();

permissionRouter.get("/get-all", authMiddleware, getPermissionsController);
permissionRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin"]), editPermissionController)

export default permissionRouter;