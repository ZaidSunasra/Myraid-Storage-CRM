import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import { approveDrawingController, deleteDrawingController, getDrawingByIdController, getDrawingsController, getUploadUrlController, rejectDrawingController, uploadDrawingController } from "../controllers/drawing.controller";

const drawingRouter = express.Router();

drawingRouter.post("/get-uploadUrl", authMiddleware, checkDepartment(undefined, "upload_drawing"), getUploadUrlController);
drawingRouter.post("/upload", authMiddleware, checkDepartment(undefined, "upload_drawing"), uploadDrawingController);
drawingRouter.get("/get/:deal_id", authMiddleware, checkDepartment(["drawing", "sales", "admin"]), getDrawingsController);
drawingRouter.post("/get/:id", authMiddleware, checkDepartment(["drawing", "sales", "admin"]), getDrawingByIdController);
drawingRouter.delete("/delete/:id", authMiddleware, checkDepartment(["drawing", "admin"]), deleteDrawingController);
drawingRouter.post("/approve/:id", authMiddleware, checkDepartment(undefined, "approve_drawing"), approveDrawingController);
drawingRouter.post("/reject/:id", authMiddleware, checkDepartment(undefined, "approve_drawing"), rejectDrawingController);

export default drawingRouter;