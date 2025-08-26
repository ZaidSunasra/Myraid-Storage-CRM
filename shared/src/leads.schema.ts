import { z } from "zod/v4";
import { Assignee, Client_Details, Company, Product, Source, SuccessResponse } from "./common.schema";

export const leadSchema = z.object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1, "Last name required"),
    phones: z.array(z.object({ number: z.string().min(5, "Phone number too short").max(15, "Phone number too long") })).min(1, "Atleast 1 phone number required"),
    emails: z.array(z.object({ email: z.email("Enter valid email address").optional() })).optional(),
    assigned_to: z.array(z.object({ id: z.number().min(1, "Enter valid Id") })).min(1, "Atleast 1 Id required"),
    source_id: z.number().min(1, "Source is required"),
    product_id: z.number().min(1, "Product is required"),
    company_name: z.string().min(1, "Company name required"),
    address: z.string().min(1, "Address required"),
    gst_no: z.string().optional(),
});

export type AddLead = z.infer<typeof leadSchema>;

export type EditLead = AddLead & { id: number };

export type GetLeadOutput = {
    id: number;
    created_at: Date;
    company_id: number;
    client_id: number;
    source_id: number;
    product_id: number;
    company: Company;
    assigned_to: Assignee[];
    client_detail: Client_Details;
    product: Product;
    source: Source;
    is_converted: boolean;
}

export type GetLeadSuccessResponse = {
    message?: string;
    leads: GetLeadOutput[];
    totalLeads: number;
}

export type GetLeadByIdSuccessResponse = {
    message: string;
    lead: GetLeadOutput | null;
}

export type GetLeadByDuration = {
    totalLeads: number;
    employeeLeadCount: Record<string, number>;
}

export type GetLeadByDurationSuccessResponse = SuccessResponse & GetLeadByDuration;