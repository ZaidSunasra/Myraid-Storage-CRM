import {z} from "zod/v4"
import { addLeadSchema } from "./lead.schema";

export type AddLead = z.infer<typeof addLeadSchema>

export type LeadSuccessResponse = {
    message: string,
    id: number
};

export type LeadErrorResponse = {
    message: string,
    error?: any,
}