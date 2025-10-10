import express from "express";
import { addLeadController, editLeadController, fetchAllLeadsController, fetchLeadByIdController, fetchLeadsByDurationController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllLeadsController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadByIdController);
leadRouter.post("/add", authMiddleware, checkDepartment(undefined, "add_lead"), addLeadController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(undefined, "add_lead"), editLeadController);
leadRouter.get("/getBy/:duration", authMiddleware, checkDepartment(undefined, "view_lead_analytics"), fetchLeadsByDurationController);

export default leadRouter;