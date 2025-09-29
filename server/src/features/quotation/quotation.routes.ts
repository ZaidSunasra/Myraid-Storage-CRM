import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addQuotationController, editQuotationController, getQuotationByDealController, getQuotationByIdController, getQuotationController, getQuotationProductsController } from "./quotation.controller";

const quotationRouter = express.Router();

quotationRouter.post("/get-products", authMiddleware, checkDepartment(["admin"]), getQuotationProductsController);
quotationRouter.post("/add/:deal_id", authMiddleware, checkDepartment(["admin"]), addQuotationController);
quotationRouter.get("/get-by/:deal_id", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationByDealController);
quotationRouter.get("/get-all", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationController);
quotationRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationByIdController);
quotationRouter.put("/edit/:deal_id/:id", authMiddleware, checkDepartment(["admin"]), editQuotationController)

export default quotationRouter;