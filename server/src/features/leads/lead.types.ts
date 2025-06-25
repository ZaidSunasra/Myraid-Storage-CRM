import { Prisma, Lead } from "@prisma/client";

export type FetchLeadOutput = Lead & {
    company: Prisma.CompanyGetPayload<{}>
}

export type FetchLeadSuccessResponse = {
    message: string,
    leads: FetchLeadOutput[]
}