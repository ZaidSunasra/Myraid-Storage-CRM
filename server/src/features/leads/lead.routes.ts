import express from "express";
import { addLeadController, editLeadController, fetchAllLeadsController, fetchEmployeeController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.post("/add", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), addLeadController);
leadRouter.get("/get", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchAllLeadsController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["ADMIN","MARKETING"]), editLeadController);
leadRouter.get("/fetchEmployee", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchEmployeeController);

export default leadRouter;