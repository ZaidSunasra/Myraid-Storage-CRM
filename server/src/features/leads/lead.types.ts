import { SOURCES, AddLead } from "zs-crm-common";
import { Prisma, Lead } from "@prisma/client";

export type EditLead = AddLead & { id: number };

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