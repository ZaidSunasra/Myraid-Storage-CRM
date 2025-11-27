import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import checkDepartment from "../../middlewares/department.middleware.js";
import { addClientController, editClientController, editCompanyDetailsController, getCompaniesController, getCompanyEmployeeController } from "./company.controller.js";

const companyRouter = express.Router();

companyRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), getCompaniesController);
companyRouter.get("/get-client/:id", authMiddleware, checkDepartment(["admin", "sales"]), getCompanyEmployeeController);
companyRouter.post("/add/client/:company_id", authMiddleware, checkDepartment(["admin", "sales"]), addClientController);
companyRouter.put("/edit/client/:company_id", authMiddleware, checkDepartment(["admin", "sales"]), editClientController);
companyRouter.put("/edit/company-details/:id", authMiddleware, checkDepartment(["admin", "sales"]), editCompanyDetailsController);

export default companyRouter;