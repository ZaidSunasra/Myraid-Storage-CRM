import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import checkDepartment from "../../middlewares/department.middleware.js";
import { addQuotationController, deleteQuotationController, editQuotationController, getCompactorDetailsController, getDetailByQuotationNumberController, getQuotationByDealController, getQuotationByIdController, getQuotationController, getQuotationProductsController, importQuotationController } from "./quotation.controller.js";

const quotationRouter = express.Router();

quotationRouter.post("/get-products", authMiddleware, checkDepartment(undefined, "add_quotation"), getQuotationProductsController);
quotationRouter.post("/add/:deal_id", authMiddleware, checkDepartment(undefined, "add_quotation"), addQuotationController);
quotationRouter.get("/compactor", authMiddleware, checkDepartment(undefined, "add_quotation"), getCompactorDetailsController)
quotationRouter.get("/get-by/:deal_id", authMiddleware, checkDepartment(undefined, ["view_deal_quotation", "add_order"]), getQuotationByDealController);
quotationRouter.get("/get-all", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationController);
quotationRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), getQuotationByIdController);
quotationRouter.put("/edit/:deal_id/:id", authMiddleware, checkDepartment(undefined, "add_quotation"), editQuotationController);
quotationRouter.post("/import/:id", authMiddleware, checkDepartment(undefined, "copy_quotation"), importQuotationController);
quotationRouter.delete("/delete/:id", authMiddleware, checkDepartment(undefined, "delete_quotation"), deleteQuotationController);
quotationRouter.get("/by-quotation-no/:quotation_no", authMiddleware, checkDepartment(undefined, "add_order"), getDetailByQuotationNumberController);

export default quotationRouter;