import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getProductsController } from "./product.controller";

const productRouter = express.Router();

productRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales"]), getProductsController);

export default productRouter;