import express from "express"
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { editDealStatusController, getDealByCompanyController, getDealByIdController, getDealController,  } from "./deal.controller";
import { getDealByCompanyService } from "./deal.service";

const dealRouter = express.Router();

//dealRouter.post("/add");
dealRouter.get("/get", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealController);
dealRouter.get("/get/:id", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByIdController);
dealRouter.get("/get/by-company", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getDealByCompanyController);
//dealRouter.put("/edit/:id");
dealRouter.put("/edit/status", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), editDealStatusController);
//drawing upload
//drawing accepted


export default dealRouter;