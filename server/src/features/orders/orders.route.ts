import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import checkDepartment from "../../middlewares/department.middleware.js";
import { addColourController, addOrderController, addPaymentController, deleteOrderController, deletePaymentController, editOrderController, editPaymentController, getOrderByIdController, getOrderController } from "./orders.controller.js";

const orderRouter = express.Router();

orderRouter.post("/add", authMiddleware, checkDepartment(undefined, "add_order"), addOrderController);
orderRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "factory", "accounts"]), getOrderController);
orderRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales", "factory", "accounts"]), getOrderByIdController);
orderRouter.put("/edit/:id", authMiddleware, checkDepartment(undefined, "add_order"), editOrderController);
orderRouter.delete("/delete/:id", authMiddleware, checkDepartment(undefined, "delete_order"), deleteOrderController);
orderRouter.post("/add/colour/:order_id", authMiddleware, checkDepartment(undefined, "add_colour"), addColourController);
orderRouter.post("/add/payment/:order_id", authMiddleware, checkDepartment(undefined, "add_payment"), addPaymentController);
orderRouter.put("/edit/payment/:id", authMiddleware, checkDepartment(undefined, "add_payment"), editPaymentController);
orderRouter.delete("/delete/payment/:id", authMiddleware, checkDepartment(undefined, "add_payment"), deletePaymentController);

export default orderRouter;