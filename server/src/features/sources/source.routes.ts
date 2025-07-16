import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getSourcesController } from "./source.controller";

const sourceRouter = express.Router();

sourceRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), getSourcesController);

export default sourceRouter;