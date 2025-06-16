import express from "express";
import { leadRouter } from "../features/leads/lead.routes";

export const mainRouter = express.Router();

mainRouter.use("/leads", leadRouter);
