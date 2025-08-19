import express from "express"
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import { addDealController, convertLeadToDealController, editDealStatusController, getDealByCompanyController, getDealByIdController, getDealController } from "../controllers/deal.controller";
import drawingRouter from "./drawing.routes";

const dealRouter = express.Router();

dealRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealController);
dealRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByIdController);
dealRouter.get("/get/by-company", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByCompanyController);
dealRouter.post("/convert/:lead_id", authMiddleware, checkDepartment(["admin", "sales"]), convertLeadToDealController);
dealRouter.post("/add", authMiddleware, checkDepartment(["admin", "sales"]), addDealController);
//dealRouter.put("/edit/:id");
dealRouter.put("/edit/status/:id", authMiddleware, checkDepartment(["admin", "sales"]), editDealStatusController);
dealRouter.use("/drawing", drawingRouter);

export default dealRouter;