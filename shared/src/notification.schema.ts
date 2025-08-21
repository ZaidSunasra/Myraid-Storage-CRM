import { Notification, SuccessResponse } from "./common.schema";

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
	notification: Notification
}

export type GetNotificationSuccessResponse = SuccessResponse & {
    notifications: GetNotificationOutput[];
}