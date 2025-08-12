import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getAllEmployeeController, getAssignedEmployeeController, getSalesEmployeeController } from "./employee.controller";

const employeeRouter = express.Router();

employeeRouter.get("/get-sales", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getSalesEmployeeController);
employeeRouter.get("/get-all", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getAllEmployeeController);
employeeRouter.get("/get-assigned/:id", authMiddleware,checkDepartment(["admin", "sales", "drawing"]), getAssignedEmployeeController)

export default employeeRouter;