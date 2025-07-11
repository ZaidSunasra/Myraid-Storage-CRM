import express from "express";
import { addDescriptionController, addLeadController, addReminderController, deleteDescriptionController, deleteReminderController, editDescriptionController, editLeadController, editReminderController, fetchAllLeadsController, fetchSalesEmployeeController, fetchLeadByIdController, fetchLeadsByDurationController, fetchRemindersByMonthController, fetchRemindersController, getDescriptionByIdController, getDescriptionsController, getProductsController, getSourcesController, fetchAllEmployeeController } from "./lead.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";

const leadRouter = express.Router();

leadRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllLeadsController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadByIdController);
leadRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addLeadController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editLeadController);
leadRouter.get("/getBy/:duration", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadsByDurationController);

leadRouter.get("/getDescription/:id", authMiddleware, checkDepartment(["admin", "sales"]), getDescriptionsController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), getDescriptionByIdController)
leadRouter.post("/addDescription/:id", authMiddleware, checkDepartment(["admin", "sales"]), addDescriptionController);
leadRouter.put("/editDescription/:id", authMiddleware, checkDepartment(["admin", "sales"]), editDescriptionController);
leadRouter.delete("/delete/:id",authMiddleware, checkDepartment(["admin", "sales"]),  deleteDescriptionController)

leadRouter.get("/fetchSalesEmployee", authMiddleware, checkDepartment(["admin", "sales"]), fetchSalesEmployeeController);
leadRouter.get("/fetchAllEmployees", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllEmployeeController)

leadRouter.post("/addReminder", authMiddleware, checkDepartment(["admin", "sales"]), addReminderController);
leadRouter.get("/getReminders/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchRemindersController);
leadRouter.get("/getRemindersByMonth/:month", authMiddleware, checkDepartment(["admin", "sales"]), fetchRemindersByMonthController);
leadRouter.put("/editReminder/:id", authMiddleware, checkDepartment(["admin", "sales"]), editReminderController )
leadRouter.delete("/deleteReminder/:id", authMiddleware, checkDepartment(["admin", "sales"]), deleteReminderController);

leadRouter.get("/getProducts", authMiddleware, checkDepartment(["admin", "sales"]), getProductsController);

leadRouter.get("/getSources", authMiddleware, checkDepartment(["admin", "sales"]), getSourcesController);

export default leadRouter;