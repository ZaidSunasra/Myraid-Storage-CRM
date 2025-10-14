import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { approveDrawingController, deleteDrawingController, getDrawingByIdController, getDrawingsController, getUploadUrlController, rejectDrawingController, showDrawingInOrderController, uploadDrawingController } from "./upload.controller";

const uploadRouter = express.Router();

uploadRouter.post("/get-uploadUrl", authMiddleware, checkDepartment(undefined, ["upload_drawing", "upload_pi", "upload_po", "upload_general"]), getUploadUrlController);
uploadRouter.post("/upload", authMiddleware, checkDepartment(undefined, ["upload_drawing", "upload_pi", "upload_po", "upload_general"]), uploadDrawingController);
uploadRouter.get("/get/:ref_id", authMiddleware, getDrawingsController);
uploadRouter.post("/get/:id", authMiddleware, getDrawingByIdController);
uploadRouter.delete("/delete/:id", authMiddleware, deleteDrawingController);
uploadRouter.post("/approve/:id", authMiddleware, checkDepartment(undefined, "approve_drawing"), approveDrawingController);
uploadRouter.post("/reject/:id", authMiddleware, checkDepartment(undefined, "approve_drawing"), rejectDrawingController);
uploadRouter.patch("/show-in-order/:id", authMiddleware, checkDepartment(["admin"]), showDrawingInOrderController)

export default uploadRouter;