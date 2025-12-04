import { z } from "zod/v4"
import { Assignee, Company, SuccessResponse } from "./common.schema";

export const ORDER_STATUS = ["pending", "in_progress", "dispatched", "ready", "fabrication_ready"] as const;
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
    powder_coating: z.boolean(),
    count_order: z.boolean(),
    deal_id: z.string()
});

export type AddOrder = z.infer<typeof addOrderSchema>

export const addColourSchema = z.object({
    colour: z.string().min(1, "Colour is required")
});

export type AddColour = z.infer<typeof addColourSchema>

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

export type ColourChange = {
    id: number
    colour: string
    changed_on: Date
    order_id: number
    user_id: number
}

export type OrderColourChange = ColourChange & {
  user: {
    id: number;
    first_name: string;
    last_name: string;
  }
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
    count_order: boolean
    powder_coating: boolean
    fitted_by: string | null
    order_number: number;
    balance: number;
    bill_number: string | null
    quotation_id: number;
    quotation: {
        quotation_no: string
    }
    advance: Advance[];
    colour_change: OrderColourChange[]
    deal: {
        assigned_to: Assignee[]
        company: Pick<Company, "name">
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