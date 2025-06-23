import {z} from "zod/v4"
import { leadSchema } from "./lead.schema";
import { SOURCES } from "../../utils/constant";
import { Prisma, Lead } from "@prisma/client";

export type AddLead = z.infer<typeof leadSchema>;
export type EditLead = AddLead & {id : number};

type sources = typeof SOURCES[number];

export type LeadSuccessResponse = {
    message: string,
};

export type LeadErrorResponse = {
    message: string,
    error?: any,
}

export type AddLeadSuccessResponse = LeadSuccessResponse & {
    id: number
}

export type FetchLeadOutput = Lead & {
    company: Prisma.CompanyGetPayload<{}>
}

export type FetchLeadSuccessResponse = {
    message: string,
    leads: FetchLeadOutput[]
}