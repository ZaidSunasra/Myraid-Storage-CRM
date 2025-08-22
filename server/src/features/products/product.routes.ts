import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { addProductsController, editProductController, getProductsController } from "./product.controller";

const productRouter = express.Router();

productRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getProductsController);
productRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addProductsController);
productRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editProductController);

export default productRouter;