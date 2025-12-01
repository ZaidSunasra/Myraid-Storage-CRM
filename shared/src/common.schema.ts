import { reminder_type } from "./reminder.schema";

export type SuccessResponse = {
    message: string;
};

export type ErrorResponse = {
    message: string;
    error?: any;
}

export type Assignee = {
    user: {
        first_name: string;
        last_name: string;
        id: number;
    }
}

export type Company = {
    name: string;
    id: number;
    address: string;
    gst_no: string | null;
    created_at: Date;
}

export type Product = {
    id: number;
    name: string;
};

export type Source = {
    id: number;
    name: string;
}

export type Client_Details = {
    id?: number,
    company_id?: number,
    first_name: string;
    last_name: string | null;
    emails: { email: string | null; }[];
    phones: { phone: string; }[];
};

export type Notification = {
	id: number;
	lead_id: number | null;
	deal_id: string | null;
    order_id: number | null;
	created_at: Date;
	message: string | null;
	title: string;
	send_at: Date | null;
	is_sent: boolean;
	type: reminder_type;
	description_id: number | null;
}