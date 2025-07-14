import {  fetchUnreadNotifications } from "@/api/leads/leads.queries";
import {
    createContext,
    useContext,
    type ReactNode,
} from "react";

type Notification = {
    id: number;
    message: string;
    title: string;
    created_at: string;
    send_at: string | null;
    is_sent: boolean;
    type: string;
    lead_id: number | null;
    deal_id: number | null;
    description_id: number | null;
};

type RecipientNotification = {
    id: number;
    is_read: boolean;
    read_at: string | null;
    notification_id: number;
    user_id: number;
    is_ready: boolean;
    ready_at: string | null;
    notification: Notification;
};

type NotificationContextType = {
    notifications: RecipientNotification[];
    unreadCount: number;
    isLoading: boolean
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = fetchUnreadNotifications();
    const notifications = data?.notifications ?? [];

    const unreadCount = notifications.length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, isLoading }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("Must be used inside NotificationProvider");
    return context;
};
