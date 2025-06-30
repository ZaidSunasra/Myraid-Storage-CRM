import { Prisma, Lead } from "@prisma/client";

export type FetchLeadOutput = Lead & {
    company: Prisma.CompanyGetPayload<{}>
}

export type FetchLeadSuccessResponse = {
    message?: string,
    leads: FetchLeadOutput[],
    totalLeads: number,
}

export type FetchEmployeeOutput = {
    first_name: string,
    last_name: string,
    id: number
}

export type FetchEmployeeSuccessResponse = {
    message: string,
    employees: FetchEmployeeOutput[]
}