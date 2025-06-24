import { z } from "zod/v4"; 

export const SOURCES = ["INDIAMART", "GOOGLEADS"] as const;

export const leadSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    phone: z.string(),
    email: z.string(),
    description: z.string().optional(),
    assigned_to: z.coerce.number(),
    source: z.enum(SOURCES),
    product: z.string(),
    company_name: z.string(),
    address: z.string(),
    gst_no: z.string().optional(),
});

export type AddLead = z.infer<typeof leadSchema>;