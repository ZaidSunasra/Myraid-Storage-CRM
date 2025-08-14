import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import { approveDrawingController, deleteDrawingController, getDrawingByIdController, getDrawingsController, getUploadUrlController, rejectDrawingController, uploadDrawingController } from "../controllers/drawing.controller";

const drawingRouter = express.Router();

drawingRouter.post("/get-uploadUrl", authMiddleware, checkDepartment(["drawing"]), getUploadUrlController);
drawingRouter.post("/upload", authMiddleware, checkDepartment(["drawing"]), uploadDrawingController);
drawingRouter.get("/get/:deal_id", authMiddleware, checkDepartment(["drawing", "sales", "admin"]), getDrawingsController);
drawingRouter.post("/get/:id", authMiddleware, checkDepartment(["drawing", "sales", "admin"]), getDrawingByIdController);
drawingRouter.delete("/delete/:id", authMiddleware, checkDepartment(["drawing"]), deleteDrawingController);
drawingRouter.post("/approve/:id", authMiddleware, checkDepartment(["admin"]), approveDrawingController);
drawingRouter.post("/reject/:id", authMiddleware, checkDepartment(["admin"]), rejectDrawingController);

export default drawingRouter;