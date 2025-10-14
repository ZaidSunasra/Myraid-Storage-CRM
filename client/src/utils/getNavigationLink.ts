import type { reminder_type, Notification, department } from "zs-crm-common";

export const getNavigationLink = (notification: Notification) => {
	const navLink: Record<reminder_type, string> = {
		client_meeting: notification.deal_id ? `/deal/${notification.deal_id}?tab=scheduling` : `/lead/${notification.lead_id}?tab=scheduling`,
		mentioned: notification.deal_id ? `/deal/${notification.deal_id}` : `/lead/${notification.lead_id}`,
		lead_assigned: notification.deal_id ? `/deal/${notification.deal_id}` : `/lead/${notification.lead_id}`,
		deal_assigned: `/deal/${notification.deal_id}`,
		drawing_uploaded: notification.order_id ? `/order/${notification.deal_id}/${notification.order_id}?tab=drawing` : `/deal/${notification.deal_id}?tab=drawing`,
		drawing_approved: notification.order_id ? `/order/${notification.deal_id}/${notification.order_id}?tab=drawing` : `/deal/${notification.deal_id}?tab=drawing`,
		drawing_rejected: notification.order_id ? `/order/${notification.deal_id}/${notification.order_id}?tab=drawing` : `/deal/${notification.deal_id}?tab=drawing`,
		color_changed: `/lead/${notification.lead_id}`
	};
	return navLink[notification.type as reminder_type];
};

export const navItems : Record<department, {url: string, title: string}[]>= {
	admin: [
		{ title: "Leads", url: "/lead" },
		{ title: "Deals", url: "/deal" },
		{ title: "Quotation", url: "/quotation" },
		{ title: "Orders", url: "/order" },
		{ title: "Settings", url: "/setting" },
		{ title: "Calendar", url: "/calender" }
	],
	sales: [
		{ title: "Leads", url: "/lead" },
		{ title: "Deals", url: "/deal" },
		{ title: "Quotation", url: "/quotation" },
		{ title: "Orders", url: "/order" },
		{ title: "Settings", url: "/setting" },
		{ title: "Calendar", url: "/calender" }
	],
	drawing: [
		{ title: "Deals", url: "/deal" }
	],
	factory: [
		{ title: "Orders", url: "/order" }
	],
	accounts: [
		{ title: "Orders", url: "/order" }
	]
} as const;

