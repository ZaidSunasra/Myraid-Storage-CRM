import { FetchUnreadNotifications } from "@/api/notifications/notification.queries";
import { createContext, useContext, type ReactNode } from "react";
import type { GetNotificationOutput } from "zs-crm-common";

type NotificationContextType = { notifications: GetNotificationOutput[]; unreadCount: number; isLoading: boolean };

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const { data, isLoading } = FetchUnreadNotifications();
	const notifications = data?.notifications ?? [];

	const unreadCount = notifications.length;

	return <NotificationContext.Provider value={{ notifications, unreadCount, isLoading }}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (!context) throw new Error("Must be used inside NotificationProvider");
	return context;
};
