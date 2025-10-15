import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addOrderController, addPaymentController, deletePaymentController, editOrderController, editPaymentController, getOrderByIdController, getOrderController } from "./orders.controller";

const orderRouter = express.Router();

orderRouter.post("/add", authMiddleware, checkDepartment(undefined, "add_order"), addOrderController);
orderRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "factory", "accounts"]), getOrderController);
orderRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales", "factory", "accounts"]), getOrderByIdController);
orderRouter.put("/edit/:id", authMiddleware, checkDepartment(undefined, "add_order"), editOrderController);
orderRouter.post("/add/payment/:order_id", authMiddleware, checkDepartment(undefined, "add_payment"), addPaymentController);
orderRouter.put("/edit/payment/:id", authMiddleware, checkDepartment(undefined, "add_payment"), editPaymentController);
orderRouter.delete("/delete/payment/:id", authMiddleware, checkDepartment(undefined, "add_payment"), deletePaymentController);

export default orderRouter;