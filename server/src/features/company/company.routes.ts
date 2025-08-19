import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getCompaniesController, getCompanyEmployeeController } from "./comapny.controller";

const companyRouter = express.Router();

companyRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]),getCompaniesController);
companyRouter.get("/get-employee/:id", authMiddleware, checkDepartment(["admin","sales"]), getCompanyEmployeeController);

export default companyRouter;