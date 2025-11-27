import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getAllEmployeeController, getAssignedEmployeeController, getSalesEmployeeController } from "./employee.controller.js";

const employeeRouter = express.Router();

employeeRouter.get("/get-sales", authMiddleware, getSalesEmployeeController);
employeeRouter.get("/get-all", authMiddleware, getAllEmployeeController);
employeeRouter.get("/get-assigned/:id",  getAssignedEmployeeController)

export default employeeRouter;