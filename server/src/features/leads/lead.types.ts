import { Prisma, Lead, Notification } from "@prisma/client";

export type FetchLeadOutput = Lead & {
    company: Prisma.CompanyGetPayload<{}>
    user: Prisma.UserGetPayload<{
        select: {
            first_name: true,
            last_name: true
        }
    }>
    client_detail: Prisma.ClientGetPayload<{
        select: {
            first_name: true,
            last_name: true,
            email: {
                select: {
                    email: true
                }
            },
            phone: {
                select: {
                    phone: true
                }
            }
        },
    }>
}

export type FetchLeadSuccessResponse = {
    message?: string,
    leads: FetchLeadOutput[],
    totalLeads: number,
}

export type FetchLeadByIdSuccessResponse = {
    messafe: string,
    lead: FetchLeadOutput | null
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

export type FetchReminderSuccessResponse = {
    message: string,
    reminders: Notification[]
}