import { z } from "zod/v4";
import { Assignee, Client_Details, Company, Product, Source, SuccessResponse } from "./common.schema";

export const NOTIFICATION_TYPE = ["color_changed", "drawing_uploaded", "drawing_approved", "drawing_rejected", "client_meeting", "mentioned", "lead_assigned"] as const;

export type reminder_type = typeof NOTIFICATION_TYPE[number];

export const leadSchema = z.object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1, "Last name required"),
    phones: z.array(z.object({ number: z.string().min(5, "Phone number too short").max(15, "Phone number too long") })).min(1, "Atleast 1 phone number required"),
    emails: z.array(z.object({ email: z.email("Enter valid email address").optional() })).optional(),
    assigned_to: z.array(z.object({ id: z.number().min(1, "Enter valid Id") })).min(1, "Atleast 1 Id required"),
    source_id: z.number().min(1, "Source is required"),
    product_id: z.number().min(1, "Product is required"),
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
    deal_id: z.coerce.number().optional(),
    description_id: z.coerce.number().optional()
})

export type AddLead = z.infer<typeof leadSchema>;

export type EditLead = AddLead & { id: number };

export type GetLeadOutput = {
    id: number;
    created_at: Date;
    company_id: number;
    client_id: number;
    source_id: number;
    product_id: number;
    company: Company;
    assigned_to: Assignee[];
    client_detail: Client_Details;
    product: Product;
    source: Source;
}

export type GetLeadSuccessResponse = {
    message?: string;
    leads: GetLeadOutput[];
    totalLeads: number;
}

export type GetLeadByIdSuccessResponse = {
    message: string;
    lead: GetLeadOutput | null;
}

export type GetLeadByDuration = {
    totalLeads: number;
    employeeLeadCount: Record<string, number>;
}

export type GetLeadByDurationSuccessResponse = SuccessResponse & GetLeadByDuration;

export type Reminders = {
    id: number;
    message: string | null;
    title: string;
    created_at: Date;
    send_at: Date | null;
    is_sent: boolean;
    type: reminder_type;
    lead_id: number | null;
    deal_id: number | null;
    description_id: number | null;
}

export type AddReminder = z.infer<typeof addReminderSchema>;

export type GetReminderSuccessResponse = {
    message: string;
    reminders: Reminders[];
}

export type AddDescription = z.infer<typeof addDescriptionSchema>

export type GetDescriptionByIdOutput = {
    id: number;
    lead_id: number | null;
    deal_id: number | null;
    created_at: Date;
    updated_at: Date | null;
    notes: string;
    updated_by: number;
};

export type GetDescriptionByIdSuccessResponse = SuccessResponse & {
    description: GetDescriptionByIdOutput | null;
};

export type GetDescriptionOutput = GetDescriptionByIdOutput & {
    user: {
        first_name: string;
        last_name: string;
    }
}

export type GetDescriptionSuccessResponse = SuccessResponse & {
    descriptions: GetDescriptionOutput[];
}

export type GetDataByMonth = {
    remindersByDay: Record<string, ReminderMonth[]>;
    leadsGrouped: Record<string, Record<string, LeadByDay[]>>;
}

export type ReminderMonth = {
    client_name: string;
    company_name: string;
    title: string;
    lead_id: number;
}

export type LeadByDay = {
    client_id: number;
    company_id: number;
    created_at: Date;
    id: number;
    product_id: number;
    source_id: number;
    client_detail: {
        company_id: number;
        id: number;
        first_name: string;
        last_name: string;
    },
    assigned_to: Assignee[];
    company: Company;
}