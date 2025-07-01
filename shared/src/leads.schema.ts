import { z } from "zod/v4";

export const SOURCES = ["INDIAMART", "GOOGLEADS"] as const;
type sources = typeof SOURCES[number];

export const leadSchema = z.object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1,"Last name required"),
    phone: z.string().max(15, "Invalid phone number"),
    email: z.string().min(1,"Invalid email address"),
    description: z.string().optional(),
    assigned_to: z.coerce.number(),
    source: z.enum(SOURCES),
    product: z.string().min(1,"Product required"),
    company_name: z.string().min(1,"Company name required"),
    address: z.string().min(1,"Address required"),
    gst_no: z.string().optional(),
});

export const addDescriptionSchema = z.object({
    description: z.string().min(1, "Description required"),
})

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

export type AddDescription = z.infer<typeof addDescriptionSchema>