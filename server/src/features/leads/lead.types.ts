export interface addLead {
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    description: string,
    assigned_to: number,
    source: "INDIAMART" | "GOOGLEADS",
    product: string,
    company_name: string,
    address: string,
    gst_no: string,
}

export type LeadSuccessResponse = {
    message: string,
    id: number
};

export type LeadErrorResponse = {
    message: string,
    error?: any
}