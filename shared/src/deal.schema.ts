import z from "zod/v4";
import { Assignee, Client_Details, Company, Product, Source, SuccessResponse } from "./common.schema"

export const DEAL_STATUS = ["pending", "drawing", "quotation", "negotiation", "high_order_value", "order_lost", "order_confirmed"] as const;
export type deal_status = typeof DEAL_STATUS[number];

export const editStatusSchema = z.object({
    status: z.enum(DEAL_STATUS)
})

export const dealSchema = z.object({
    company_id: z.string().min(1, "Company is required"),
    employee_id: z.string().min(1, "Employee is required"),
    source_id: z.number().min(1, "Source is required"),
    product_id: z.number().min(1, "Product is required"),
    deal_status: z.enum(DEAL_STATUS),
    assigned_to: z.array(z.object({ id: z.number().min(1, "Enter valid Id") })).min(1, "Atleast 1 Id required"),
});

export type AddDeal = z.infer<typeof dealSchema>;

export type Deal = {
    company_id: number;
    source_id: number;
    product_id: number;
    id: string;
    deal_status: deal_status;
    created_at: Date;
    last_updated: Date;
    client_id: number;
    lead_id: number | null;
    updated_by: number;
}

export type GetDealOutput = Deal & {
    company: Company;
    assigned_to: Assignee[];
    product: Product;
    source: Source;
    client_detail: Client_Details;
    quotation : {
        quotation_products: {
            name: string
        }[]
    }[]
}

export type GetAllDealOutput = {
    deals: GetDealOutput[];
    totalDeals: number;
}

export type GetOnlyDealIdOutput ={
    id: string
}

export type GetOnlyDealSuccessResponse = SuccessResponse & {dealIds: GetOnlyDealIdOutput[]}
export type GetAllDealSuccessResponse = SuccessResponse & GetAllDealOutput;
export type GetDealByIdSuccessResponse = SuccessResponse & { deal: GetDealOutput | null };
export type GetDealByompanySuccessResponse = SuccessResponse & { deals: Deal[] };
