import { z } from "zod/v4"

export const ORDER_STATUS = ["pending", "in_progress", "dispatched"] as const;
export type order_status = typeof ORDER_STATUS[number]; 

export const addOrderSchema = z.object({
    quotation_no: z.string(),
    height: z.string().min(1, "Height is required"),
    total: z.number().min(1, "Total is required"),
    total_body: z.number().min(1, "Total is required"),
    pi_number: z.string().optional().nullable(),
    po_number: z.string().optional().nullable(),
    dispatch_at: z.date({ error: "Dispatch date is required" }),
    status: z.enum(ORDER_STATUS),
    colour: z.string().min(1, "Colour is required"),
    deal_id: z.string()
})

export type AddOrder = z.infer<typeof addOrderSchema>