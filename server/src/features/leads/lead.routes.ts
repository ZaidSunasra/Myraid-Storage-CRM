import express from "express";
import { addDescriptionController, addLeadController, addReminderController, editLeadController, fetchAllLeadsController, fetchEmployeeController, fetchLeadByIdController, fetchRemindersController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.post("/add", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), addLeadController);
leadRouter.put("/addDescription/:id", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), addDescriptionController)
leadRouter.get("/get", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchAllLeadsController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), editLeadController);
leadRouter.get("/fetchEmployee", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchEmployeeController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchLeadByIdController);
leadRouter.post("/addReminder", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), addReminderController);
leadRouter.get("/getReminders/:id", authMiddleware, checkDepartment(["ADMIN", "MARKETING"]), fetchRemindersController)

export default leadRouter;