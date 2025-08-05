import express from "express";
import leadRouter from "../features/leads/lead.routes";
import authRouter from "../features/auth/auth.routes";
import dealRouter from "../features/deals/routes/deal.routes";
import notificationRouter from "../features/notifications/notification.routes";
import employeeRouter from "../features/employees/employee.routes";
import productRouter from "../features/products/product.routes";
import sourceRouter from "../features/sources/source.routes";
import descriptionRouter from "../features/descriptions/description.routes";
import reminderRouter from "../features/reminders/reminder.routes";

export const mainRouter = express.Router();

mainRouter.use("/leads", leadRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/deals", dealRouter);
mainRouter.use("/notifications", notificationRouter);
mainRouter.use("/employees", employeeRouter);
mainRouter.use("/products", productRouter);
mainRouter.use("/sources", sourceRouter);
mainRouter.use("/descriptions", descriptionRouter);
mainRouter.use("/reminders", reminderRouter);