import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getAllEmployeeController, getAssignedEmployeeController, getSalesEmployeeController } from "./employee.controller";

const employeeRouter = express.Router();

employeeRouter.get("/get-sales", authMiddleware, getSalesEmployeeController);
employeeRouter.get("/get-all", authMiddleware, getAllEmployeeController);
employeeRouter.get("/get-assigned/:id",  getAssignedEmployeeController)

export default employeeRouter;