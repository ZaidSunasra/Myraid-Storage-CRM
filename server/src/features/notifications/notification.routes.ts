import express from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import checkDepartment from "../../middlewares/department.middleware";
import { getReadNotificationsController, getUnreadNotificationsController, markAllReadNotificationController, markNotificationController } from "./notifcation.controller";

const notificationRouter = express.Router();

notificationRouter.get("/get-unread", authMiddleware, getUnreadNotificationsController);
notificationRouter.get("/get-read", authMiddleware,  getReadNotificationsController);
notificationRouter.post("/mark-read/:id",  authMiddleware, markNotificationController);
notificationRouter.post("/mark-all-read", authMiddleware, markAllReadNotificationController);

export default notificationRouter;