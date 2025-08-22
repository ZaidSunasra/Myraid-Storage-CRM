import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addSourceController, editSourceController, getSourcesController } from "./source.controller";

const sourceRouter = express.Router();

sourceRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getSourcesController);
sourceRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addSourceController);
sourceRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editSourceController);

export default sourceRouter;