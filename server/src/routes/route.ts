import express from "express";
import leadRouter from "../features/leads/lead.routes";
import authRouter from "../features/auth/auth.routes";

export const mainRouter = express.Router();

mainRouter.use("/leads", leadRouter);
mainRouter.use("/auth", authRouter)