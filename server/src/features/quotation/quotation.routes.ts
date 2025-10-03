import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addQuotationController, deleteQuotationController, editQuotationController, getQuotationByDealController, getQuotationByIdController, getQuotationController, getQuotationProductsController, importQuotationController } from "./quotation.controller";

const quotationRouter = express.Router();

quotationRouter.post("/get-products", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationProductsController);
quotationRouter.post("/add/:deal_id", authMiddleware, checkDepartment(["admin", "sales"]), addQuotationController);
quotationRouter.get("/get-by/:deal_id", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationByDealController);
quotationRouter.get("/get-all", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationController);
quotationRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationByIdController);
quotationRouter.put("/edit/:deal_id/:id", authMiddleware, checkDepartment(["admin", "sales"]), editQuotationController);
quotationRouter.post("/import/:id", authMiddleware, checkDepartment(["admin", "sales"]), importQuotationController);
quotationRouter.delete("/delete/:id", authMiddleware, checkDepartment(["admin"]), deleteQuotationController)

export default quotationRouter;