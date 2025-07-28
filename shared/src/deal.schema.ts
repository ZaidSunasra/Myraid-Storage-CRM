import z from "zod/v4";
import { Assignee, Client_Details, Company, SuccessResponse } from "./common.schema"

export const DEAL_STATUS = ["pending", "drawing", "quotation", "negotiation", "high_order_value", "order_lost", "order_confirmed"] as const;
export type deal_status = typeof DEAL_STATUS[number];

export const editStatusSchema = z.object({
    status: z.enum(DEAL_STATUS)
})

export type Deal = {
    company_id: number;
    source_id: number;
    product_id: number;
    id: number;
    deal_status: deal_status;
    created_at: Date;
    last_updated: Date;
    client_id: number;
    lead_id: number;
    updated_by: number;
}

export type GetDealOutput = Deal & {
    company: Company;
    assigned_to: Assignee[];
    product: {
        name: string;
        id: number;
    };
    source: {
        name: string;
        id: number;
    };
    client_detail: Client_Details
}

export type GetAllDealOutput = {
    deals: GetDealOutput[];
    totalDeals: number;
}

export type GetAllDealSuccessResponse = SuccessResponse & GetAllDealOutput;
export type GetDealByIdSuccessResponse = SuccessResponse & {deal: GetDealOutput | null};
export type GetDealByompanySuccessResponse = SuccessResponse & {deals: Deal[]};
