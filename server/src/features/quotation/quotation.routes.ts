import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addQuotationController, getQuotationProductsController } from "./quotation.controller";

const quotationRouter = express.Router();

quotationRouter.post("/get-products", authMiddleware, checkDepartment(["admin"]), getQuotationProductsController);
quotationRouter.post("/add/:deal_id", authMiddleware, checkDepartment(["admin"]), addQuotationController);

export default quotationRouter;