import z from "zod/v4";
import { Client_Details, Company, SuccessResponse } from "./common.schema";

export const editCompanyDetailSchema = z.object({
    company_name: z.string().min(1, "Name is required"),
    gst_no: z.string().optional(),
    address: z.string().min(1, "Address is required")
});

export const editClientSchema = z.object({
    first_name: z.string().min(1, "First name required"),
    last_name: z.string().min(1, "Last name required"),
    phones: z.array(z.object({ number: z.string().min(5, "Phone number too short").max(15, "Phone number too long") })).min(1, "Atleast 1 phone number required"),
    emails: z.array(z.object({ email: z.email("Enter valid email address").optional() })).optional(),
    id: z.string().optional(),
});


export type EditCompany = z.infer<typeof editCompanyDetailSchema>;
export type EditClient = z.infer<typeof editClientSchema>;

export type GetCompanySuccessResponse = SuccessResponse & {
    companies: Company[]
}

export type GetEmployeeByCompanySuccessResponse = SuccessResponse & {
    employees: Client_Details[]
}