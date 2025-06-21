import express from "express";
import { addLeadController } from "./lead.controller";

const leadRouter = express.Router();

leadRouter.post("/add", addLeadController);

export default leadRouter;