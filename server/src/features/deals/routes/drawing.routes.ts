import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import { getUploadUrlController, uploadDrawingController } from "../controllers/drawing.controller";

const drawingRouter = express.Router();

drawingRouter.post("/drawing/get-uploadUrl", authMiddleware, checkDepartment(["drawing"]), getUploadUrlController);
drawingRouter.post("/drawing/upload", authMiddleware, checkDepartment(["drawing"]), uploadDrawingController);

export default drawingRouter;