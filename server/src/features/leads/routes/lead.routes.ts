import express from "express";
import { addLeadController, editLeadController, fetchAllLeadsController, fetchSalesEmployeeController, fetchLeadByIdController, fetchLeadsByDurationController, getProductsController, getSourcesController, fetchAllEmployeeController } from "../controllers/lead.controller";
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import descriptionRouter from "./description.routes";
import reminderRouter from "./reminder.routes";

const leadRouter = express.Router();

leadRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllLeadsController);
leadRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadByIdController);
leadRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addLeadController);
leadRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editLeadController);
leadRouter.get("/getBy/:duration", authMiddleware, checkDepartment(["admin", "sales"]), fetchLeadsByDurationController);

leadRouter.use("/description", descriptionRouter);
leadRouter.use("/reminder", reminderRouter);

leadRouter.get("/fetchSalesEmployee", authMiddleware, checkDepartment(["admin", "sales"]), fetchSalesEmployeeController);
leadRouter.get("/fetchAllEmployees", authMiddleware, checkDepartment(["admin", "sales"]), fetchAllEmployeeController)

leadRouter.get("/getProducts", authMiddleware, checkDepartment(["admin", "sales"]), getProductsController);

leadRouter.get("/getSources", authMiddleware, checkDepartment(["admin", "sales"]), getSourcesController);

export default leadRouter;