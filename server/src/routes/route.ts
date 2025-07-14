import express from "express";
import leadRouter from "../features/leads/lead.routes";
import authRouter from "../features/auth/auth.routes";
import dealRouter from "../features/deals/deal.routes";
import notificationRouter from "../features/notifications/notification.routes";

export const mainRouter = express.Router();

mainRouter.use("/leads", leadRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/deals", dealRouter);
mainRouter.use("/notifications", notificationRouter);