import express from "express";
import { addLeadController } from "./lead.controller";

export const leadRouter = express.Router();

leadRouter.post("/add", addLeadController);
