import { z } from "zod/v4";

export const addLeadSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    phone: z.coerce.number(),
    email: z.string(),
    description: z.string().optional(),
    assigned_to: z.coerce.number(),
    source: z.enum(["INDIAMART", "GOOGLEADS"]),
    product: z.string(),
    company_name: z.string(),
    address: z.string(),
    gst_no: z.string().optional(),
})