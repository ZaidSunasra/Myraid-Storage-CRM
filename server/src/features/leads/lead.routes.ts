import express from "express";
import { addDescriptionController, addLeadController, addReminderController, deleteReminderController, editLeadController, fetchAllLeadsController, fetchEmployeeController, fetchLeadByIdController, fetchLeadsByDurationController, fetchRemindersController, getProductsController, getSourcesController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllLeadsController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadByIdController);
leadRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addLeadController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editLeadController);
leadRouter.put("/addDescription/:id", authMiddleware, checkDepartment(["admin", "sales"]), addDescriptionController);
leadRouter.get("/getBy/:duration", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadsByDurationController)

leadRouter.get("/fetchEmployee", authMiddleware, checkDepartment(["admin", "sales"]), fetchEmployeeController);

leadRouter.post("/addReminder", authMiddleware, checkDepartment(["admin", "sales"]), addReminderController);
leadRouter.get("/getReminders/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchRemindersController);
leadRouter.delete("/deleteReminder/:id", authMiddleware, checkDepartment(["admin", "sales"]), deleteReminderController);

leadRouter.get("/getProducts", authMiddleware, checkDepartment(["admin", "sales"]), getProductsController);

leadRouter.get("/getSources", authMiddleware, checkDepartment(["admin", "sales"]), getSourcesController);

export default leadRouter;