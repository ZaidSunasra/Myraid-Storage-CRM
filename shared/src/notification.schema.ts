import { SuccessResponse } from "./common.schema";
import { reminder_type } from "./leads.schema";

export type Receipient = {
    id: number;
    is_read: boolean;
    read_at: Date | null;
    notification_id: number;
    user_id: number;
    is_ready: boolean;
    ready_at: Date | null;
}

export type GetNotificationOutput = Receipient & {
    notification: {
        id: number;
        lead_id: number | null;
        deal_id: number | null;
        created_at: Date;
        message: string | null;
        title: string;
        send_at: Date | null;
        is_sent: boolean;
        type: reminder_type;
        description_id: number | null;
    }
}

export type GetNotificationSuccessResponse = SuccessResponse & {
    notifications: GetNotificationOutput[];
}