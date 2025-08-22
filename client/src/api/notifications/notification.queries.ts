import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getReadNotifications, getUnreadNotifications } from "./notification.api";

export const FetchUnreadNotifications = () => {
	const { user } = useUser();
	return useQuery({ queryKey: ["notifications-unread"], queryFn: getUnreadNotifications, enabled: !!user, refetchInterval: 60000 });
};

export const FetchReadNotifications = () => {
	const {user} = useUser();
	return useQuery({ queryKey: ["notifications-read"], queryFn: getReadNotifications, enabled: !!user?.id });
};
