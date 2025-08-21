import { useMarkNotification } from "@/api/notifications/notification.mutation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getNavigationLink } from "@/utils/getNavigationLink";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import type { GetNotificationOutput } from "zs-crm-common";

const NotificationCard = ({ notification }: { notification: GetNotificationOutput }) => {
	const markNotification = useMarkNotification();
	const navigate = useNavigate();
	const path = getNavigationLink(notification.notification);

	return (
		<Card className={`transition-all duration-200 hover:shadow-md ${!notification.is_read ? "bg-blue-50/50 border-blue-200" : "bg-card"}`}>
			<CardContent>
				<div className="flex-1 space-y-2" onClick={() => navigate(path)}>
					<div className="flex items-center space-x-2">
						{!notification.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
						<h4 className="font-semibold text-sm">{notification.notification.title}</h4>
					</div>
					{notification.notification.message && <p className="text-muted-foreground text-sm">{notification.notification.message}</p>}
					<div className="flex items-center justify-between">
						<span className="text-xs text-muted-foreground">{new Date(notification.notification.created_at).toLocaleString()}</span>
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								markNotification.mutate(String(notification.id));
							}}
							className="h-7 text-xs bg-transparent"
						>
							<Check className="h-3 w-3 mr-1" />
							Mark as read
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default NotificationCard;
