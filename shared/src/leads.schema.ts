import { z } from "zod/v4";

export const SOURCES = ["india_mart", "google_ads"] as const;
export const NOTIFICATION_TYPE = ["color_changed", "drawing_uploaded", "drawing_approved", "drawing_rejected", "client_meeting"] as const;
export const RELATED_TYPE = ["lead", "deal", "order"] as const;

export type sources = typeof SOURCES[number];
export type reminder_type = typeof NOTIFICATION_TYPE[number];
export type related_type = typeof RELATED_TYPE[number];

export const leadSchema = z.object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1, "Last name required"),
    phones: z.array(z.object({number: z.string().min(5, "Phone number too short").max(15, "Phone number too long")})).min(1, "Atleast 1 phone number required"),
    emails: z.array(z.object({ email: z.string().optional()})).optional(),
    description: z.string().optional(),
    assigned_to: z.coerce.number(),
    source: z.enum(SOURCES),
    product: z.string().min(1, "Product required"),
    company_name: z.string().min(1, "Company name required"),
    address: z.string().min(1, "Address required"),
    gst_no: z.string().optional(),
});

export const addDescriptionSchema = z.object({
    description: z.string().min(1, "Description required"),
})

export const addReminderSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().optional(),
    send_at: z.preprocess(
        (val) => (val ? new Date(val as string) : undefined),
        z.date("Date is required")
    ),
    related_id: z.string(),
    reminder_type: z.enum(NOTIFICATION_TYPE),
    related_type: z.enum(RELATED_TYPE)
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

export type AddReminder = z.infer<typeof addReminderSchema>;