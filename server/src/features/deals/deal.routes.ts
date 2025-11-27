import express from "express"
import authMiddleware from "../../middlewares/auth.middleware.js";
import checkDepartment from "../../middlewares/department.middleware.js";
import { addDealController, convertLeadToDealController, editDealController, editDealStatusController, getDealByCompanyController, getDealByIdController, getDealController, getDealIdController } from "./deal.controller.js";

const dealRouter = express.Router();

dealRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealController);
dealRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByIdController);
dealRouter.get("/get/by-company", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByCompanyController);
dealRouter.post("/convert/:lead_id", authMiddleware, checkDepartment(["admin", "sales"]), convertLeadToDealController);
dealRouter.post("/add", authMiddleware, checkDepartment(undefined, "add_deal"), addDealController);
dealRouter.put("/edit/:id", authMiddleware, checkDepartment(undefined, "add_deal"), editDealController);
dealRouter.put("/edit/status/:id", authMiddleware, checkDepartment(undefined, "edit_deal_status"), editDealStatusController);
dealRouter.get("/get-only-id", authMiddleware, checkDepartment(undefined, "copy_quotation"), getDealIdController)

export default dealRouter;