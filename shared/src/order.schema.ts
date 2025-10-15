import { z } from "zod/v4"
import { Assignee, Company, SuccessResponse } from "./common.schema";

export const ORDER_STATUS = ["pending", "in_progress", "dispatched"] as const;
export type order_status = typeof ORDER_STATUS[number]; 

export const addOrderSchema = z.object({
    quotation_no: z.string(),
    height: z.string().min(1, "Height is required"),
    total: z.number().min(1, "Total is required"),
    total_body: z.number().min(1, "Total is required"),
    pi_number: z.boolean(),
    fitted_by: z.string().optional().nullable(),
    bill_number: z.string().optional().nullable(),
    po_number: z.string().optional().nullable(),
    dispatch_at: z.date({ error: "Dispatch date is required" }),
    status: z.enum(ORDER_STATUS),
    colour: z.string().min(1, "Colour is required"),
    deal_id: z.string()
})

export type AddOrder = z.infer<typeof addOrderSchema>

export const addPaymentSchema = z.object({
    amount: z.number().min(1, "Amount is required"),
    date: z.date("Date is required")
});

export type AddPayment = z.infer<typeof addPaymentSchema>

export type Advance = {
    id: number;
    order_id: number;
    advance_amount: number;
    advance_date: Date;
}

export type Order = {
    id: number;
    deal_id: string;
    created_at: Date;
    status: order_status;
    height: string;
    total_body: number;
    pi_number: boolean;
    po_number: string | null;
    dispatch_at: Date;
    colour: string;
    fitted_by: string | null
    order_number: number;
    balance: number;
    bill_number: string | null
    quotation_id: number;
    quotation: {
        quotation_no: string
    }
    advance: Advance[];
    deal : {
        assigned_to : Assignee[]
        company : Pick<Company, "name">
    }
}

export type GetOrderOutput = {
    orders: Order[],
    totalOrders: number
}

export type GetOrderSuccessResponse = SuccessResponse & GetOrderOutput

export type GetOrderByIdSuccessResponse = SuccessResponse & {
    order: Order | null
}