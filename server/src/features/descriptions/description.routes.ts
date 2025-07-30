import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getDescriptionsController, getDescriptionByIdController, addDescriptionController, editDescriptionController, deleteDescriptionController } from "./description.controller";

const descriptionRouter = express.Router();

descriptionRouter.get("/get/:ref_id", authMiddleware, checkDepartment(["admin", "sales"]), getDescriptionsController);
descriptionRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales"]), getDescriptionByIdController)
descriptionRouter.post("/add/:id", authMiddleware, checkDepartment(["admin", "sales"]), addDescriptionController);
descriptionRouter.put("/edit/:id", authMiddleware, checkDepartment(["admin", "sales"]), editDescriptionController);
descriptionRouter.delete("/delete/:id", authMiddleware, checkDepartment(["admin", "sales"]), deleteDescriptionController);

export default descriptionRouter;