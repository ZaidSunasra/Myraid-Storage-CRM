import express from "express";
import { addDescriptionController, addLeadController, addReminderController, deleteReminderController, editLeadController, fetchAllLeadsController, fetchEmployeeController, fetchLeadByIdController, fetchRemindersController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addLeadController);
leadRouter.put("/addDescription/:id", authMiddleware, checkDepartment(["admin", "sales"]), addDescriptionController)
leadRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllLeadsController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editLeadController);
leadRouter.get("/fetchEmployee", authMiddleware, checkDepartment(["admin", "sales"]), fetchEmployeeController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadByIdController);
leadRouter.post("/addReminder", authMiddleware, checkDepartment(["admin", "sales"]), addReminderController);
leadRouter.get("/getReminders/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchRemindersController);
leadRouter.delete("/deleteReminder/:id", authMiddleware, checkDepartment(["admin", "sales"]), deleteReminderController)

export default leadRouter;