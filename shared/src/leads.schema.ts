import { z } from "zod/v4";

export const SOURCES = ["INDIAMART", "GOOGLEADS"] as const;
type sources = typeof SOURCES[number];

export const leadSchema = z.object({
    first_name: z.string("First name required"),
    last_name: z.string("Last name required"),
    phone: z.string().max(10, "Invalid phone number"),
    email: z.string("Invalid email address"),
    description: z.string().optional(),
    assigned_to: z.coerce.number(),
    source: z.enum(SOURCES),
    product: z.string("Product required"),
    company_name: z.string("Company name required"),
    address: z.string("Address required"),
    gst_no: z.string().optional(),
});

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

export type AddLead = z.infer<typeof leadSchema>;

export type EditLead = AddLead & { id: number };