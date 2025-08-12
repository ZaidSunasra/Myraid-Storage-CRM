import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getReadNotificationsController, getUnreadNotificationsController, markNotificationController } from "./notifcation.controller";

const notificationRouter = express.Router();

notificationRouter.get("/get-unread", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getUnreadNotificationsController);
notificationRouter.get("/get-read", authMiddleware, checkDepartment(["admin", "sales", "drawing"]), getReadNotificationsController);
notificationRouter.post("/mark-read/:id",  authMiddleware, checkDepartment(["admin", "sales", "drawing"]), markNotificationController);

export default notificationRouter;