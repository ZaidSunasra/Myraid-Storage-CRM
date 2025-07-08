import { z } from "zod/v4";

export const NOTIFICATION_TYPE = ["color_changed", "drawing_uploaded", "drawing_approved", "drawing_rejected", "client_meeting"] as const;

export type reminder_type = typeof NOTIFICATION_TYPE[number];

export const leadSchema = z.object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1, "Last name required"),
    phones: z.array(z.object({number: z.string().min(5, "Phone number too short").max(15, "Phone number too long")})).min(1, "Atleast 1 phone number required"),
    emails: z.array(z.object({ email: z.email("Enter valid email address").optional()})).optional(),
    assigned_to: z.array(z.object({id: z.coerce.number().min(1, "Enter valid Id")})).min(1, "Atleast 1 Id required"),
    source_id: z.coerce.number().min(1, "Source is required"),
    product_id: z.coerce.number().min(1, "Product is required"),
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
    send_at: z.coerce.date("Date and time are required"),
    reminder_type: z.enum(NOTIFICATION_TYPE),
    lead_id: z.coerce.number().optional(),
    deal_id: z.coerce.number().optional()
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