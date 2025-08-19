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
    last_name: string;
    emails: { email: string | null; }[];
    phones: { phone: string; }[];
};