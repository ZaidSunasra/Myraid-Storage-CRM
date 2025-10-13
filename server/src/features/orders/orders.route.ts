import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addOrderController } from "./orders.controller";

const orderRouter = express.Router();

orderRouter.post("/add", authMiddleware, checkDepartment(undefined, "add_order"), addOrderController)

export default orderRouter;