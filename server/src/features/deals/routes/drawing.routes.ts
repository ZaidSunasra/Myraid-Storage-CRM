import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import { getDrawingsController, getUploadUrlController, uploadDrawingController } from "../controllers/drawing.controller";

const drawingRouter = express.Router();

drawingRouter.post("/get-uploadUrl", authMiddleware, checkDepartment(["drawing"]), getUploadUrlController);
drawingRouter.post("/upload", authMiddleware, checkDepartment(["drawing"]), uploadDrawingController);
drawingRouter.get("/get/:deal_id", authMiddleware, checkDepartment(["drawing", "sales", "admin"]), getDrawingsController)

export default drawingRouter;