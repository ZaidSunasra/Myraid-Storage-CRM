import express from "express";
import { addLeadController, editLeadController, fetchAllLeadsController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.post("/add", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), addLeadController);
leadRouter.get("/get", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchAllLeadsController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["ADMIN","MARKETING"]), editLeadController);

export default leadRouter;