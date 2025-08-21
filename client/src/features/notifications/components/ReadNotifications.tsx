import { Card, CardContent } from "@/shared/components/ui/card";
import {getNavigationLink} from "@/utils/getNavigationLink";
import { useNavigate } from "react-router";
import type { GetNotificationOutput } from "zs-crm-common";

const ReadNotifications = ({ notification }: { notification: GetNotificationOutput }) => {
	const navigate = useNavigate();
	const path = getNavigationLink(notification.notification);

	return (
		<Card className={`transition-all duration-200 hover:shadow-md ${!notification.is_read ? "bg-blue-50/50 border-blue-200" : "bg-card"}`}>
			<CardContent className="px-4" onClick={() => navigate(path)}>
				<div className="flex items-start space-x-4">
					<div className="flex-1 space-y-1">
						<h4 className="font-semibold text-sm">{notification.notification.title}</h4>
						{notification.notification.message && <p className="text-muted-foreground text-sm">{notification.notification.message}</p>}
						<span className="text-xs text-muted-foreground">{new Date(notification.notification.created_at).toLocaleString()}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ReadNotifications;
