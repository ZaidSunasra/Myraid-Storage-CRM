import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import checkDepartment from "../../middlewares/department.middleware.js";
import { addReminderController, deleteReminderController, editReminderController, fetchRemindersByMonthController, fetchRemindersController } from "./reminder.controller.js";

const reminderRouter = express.Router();

reminderRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchRemindersController);
reminderRouter.get("/get-by-month/:month", authMiddleware, checkDepartment(["admin", "sales"]), fetchRemindersByMonthController);
reminderRouter.post("/add/:id", authMiddleware, checkDepartment(undefined, "schedule_meeting"), addReminderController);
reminderRouter.put("/edit/:reminder_id", authMiddleware, checkDepartment(["admin", "sales"]), editReminderController)
reminderRouter.delete("/delete/:id", authMiddleware, checkDepartment(["admin", "sales"]), deleteReminderController);

export default reminderRouter;