import { z } from "zod/v4";
import { Assignee, Company } from "./common.schema";

export const NOTIFICATION_TYPE = ["color_changed", "drawing_uploaded", "drawing_approved", "drawing_rejected", "client_meeting", "mentioned", "lead_assigned"] as const;

export type reminder_type = typeof NOTIFICATION_TYPE[number];

export const addReminderSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().optional(),
    send_at: z.coerce.date("Date and time are required"),
    reminder_type: z.enum(NOTIFICATION_TYPE),
    type: z.enum(["deal", "lead"]).optional(),
    lead_id: z.coerce.number().optional(),
    deal_id: z.string().optional(),
    description_id: z.coerce.number().optional()
})

export type Reminders = {
    id: number;
    message: string | null;
    title: string;
    created_at: Date;
    send_at: Date | null;
    is_sent: boolean;
    type: reminder_type;
    lead_id: number | null;
    deal_id: string | null;
    description_id: number | null;
}

export type AddReminder = z.infer<typeof addReminderSchema>;

export type GetReminderSuccessResponse = {
    message: string;
    reminders: Reminders[];
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