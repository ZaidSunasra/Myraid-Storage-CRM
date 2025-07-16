import { z } from "zod/v4";

export const NOTIFICATION_TYPE = ["color_changed", "drawing_uploaded", "drawing_approved", "drawing_rejected", "client_meeting", "mentioned", "lead_assigned"] as const;

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
    deal_id: z.coerce.number().optional(),
    description_id: z.coerce.number().optional()
})

export type SuccessResponse = {
    message: string;
};

export type ErrorResponse = {
    message: string;
    error?: any;
}

export type AddLead = z.infer<typeof leadSchema>;

export type EditLead = AddLead & { id: number };

export type AddLeadSuccessResponse = SuccessResponse & {
    id: number;
}

export type FetchLeadOutput = {
    id: number;
    created_at: Date;
    company_id: number;
    client_id: number;
    source_id: number;
    product_id: number;
    company: {
        name: string;
        id: number;
        address: string;
        gst_no: string | null;
        created_at: Date;
    };
    assigned_to: {
        user: {
            first_name: string;
            last_name: string;
            id: number;
        }
    }[];
    client_detail: {
        first_name: string;
        last_name: string;
        emails: { email: string | null }[];
        phones: { phone: string }[];
    }
}

export type FetchLeadSuccessResponse = {
    message?: string;
    leads: FetchLeadOutput[];
    totalLeads: number;
}

export type FetchLeadByIdSuccessResponse = {
    messafe: string;
    lead: FetchLeadOutput | null;
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

export type FetchReminderSuccessResponse = {
    message: string;
    reminders: Reminders[];
}

export type AddDescription = z.infer<typeof addDescriptionSchema>

export type GetDescriptionByIdOutput = {
    id: number;
    lead_id: number;
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