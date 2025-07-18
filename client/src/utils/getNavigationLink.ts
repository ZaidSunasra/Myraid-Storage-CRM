import type { GetNotificationOutput, reminder_type } from "zs-crm-common";

const getNavigationLink = (notification: GetNotificationOutput) => {
	const navLink: Record<reminder_type, string> = {
		client_meeting: `/lead/${notification.notification.lead_id}?tab=scheduling`,
		mentioned: `/lead/${notification.notification.lead_id}`,
		lead_assigned: `/lead/${notification.notification.lead_id}`,
		drawing_uploaded: `/lead/${notification.notification.deal_id}`,
		drawing_approved: `/lead/${notification.notification.deal_id}`,
		drawing_rejected: `/lead/${notification.notification.deal_id}`,
		color_changed: `/lead/${notification.notification.lead_id}`
	};
	return navLink[notification.notification.type as reminder_type];
};

export default getNavigationLink;
