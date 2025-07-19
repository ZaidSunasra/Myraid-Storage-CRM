import express from "express"
import authMiddleware from "../../../middlewares/auth.middleware";
import checkDepartment from "../../../middlewares/department.middleware";
import { convertLeadToDealController, editDealStatusController, getDealByCompanyController, getDealByIdController, getDealController, } from "../controllers/deal.controller";

const dealRouter = express.Router();

dealRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealController);
dealRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByIdController);
dealRouter.get("/get/by-company", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByCompanyController);
dealRouter.post("/convert/:lead_id", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), convertLeadToDealController);
//dealRouter.post("/add");
//dealRouter.put("/edit/:id");
dealRouter.put("/edit/status", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), editDealStatusController);
//drawing upload
//drawing accepted


export default dealRouter;