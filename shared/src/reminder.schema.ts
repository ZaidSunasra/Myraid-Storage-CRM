import { z } from "zod/v4";

export const NOTIFICATION_TYPE = ["color_changed", "drawing_uploaded", "drawing_approved", "drawing_rejected", "client_meeting", "mentioned", "lead_assigned", "deal_assigned", "add_quotation"] as const;

export type reminder_type = typeof NOTIFICATION_TYPE[number];

export const addReminderSchema = z.object({
    title: z.string().min(1, "Title is required"),
    message: z.string().optional(),
    send_at: z.coerce.date("Date and time are required"),
    reminder_type: z.enum(NOTIFICATION_TYPE),
    type: z.enum(["deal", "lead"]).optional(),
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
    grouped: Record<string, Record<string, GroupedRecords>>;
};

export type ReminderMonth = {
    client_name: string;
    company_name: string;
    title: string;
    lead_id: number | null;  
    deal_id: string | null; 
};

export type GroupedRecords = {
    leads: LeadByDay[];
    deals: DealByDay[];
};

export type DealByDay = {
    deal_id: string;
    company_name: string;
    client_name: string
};

export type LeadByDay = {
    lead_id: number;
    company_name: string,
    client_name: string;
    deal_id?: string; 
};