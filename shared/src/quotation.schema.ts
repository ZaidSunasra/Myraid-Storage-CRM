import z from "zod/v4";

export const QUOTATION_TEMPLATE = ["set_wise", "item_wise"] as const;
export type quotation_template = typeof QUOTATION_TEMPLATE[number];

export const PRODUCT_TYPE = ["compactor", "locker"] as const;
export type product_type = typeof PRODUCT_TYPE[number];

export const quotationItemSchema = z.object({
    id: z.number().min(1, "Id is required"),
    code: z.string().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    default_height: z.number(),
    default_width: z.number(),
    default_depth: z.number(),
    qty: z.number(),
    per_bay_qty: z.number(),
    provided_rate: z.number(),
    market_rate: z.number(),
})

export const quotationProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    items: z.array(quotationItemSchema),
    powder_coating: z.number(),
    trolley_material: z.number(),
    ss_material: z.number(),
    total_weight: z.number(),
    labour_cost: z.number(),
    installation: z.number(),
    accomodation: z.number(),
    transport: z.number(),
    metal_rate: z.number(),
    total_body: z.number(),
    total_market_rate: z.number(),
    total_provided_rate: z.number(),
    set: z.number(),
    profit_percent: z.number()
})

export const addQuotationSchema = z.object({
    quotation_template: z.enum(QUOTATION_TEMPLATE),
    product_type: z.enum(PRODUCT_TYPE),
    bay: z.number().gte(1).lte(7),
    compartment: z.number().gte(4).lte(7),
    quotation_item: z.array(quotationProductSchema).optional(),
    total: z.number(),
    grandTotal: z.number(),
    gst: z.number(),
    discount: z.number(),
    round_off: z.number(),
})

export type QuotationProduct = z.infer<typeof quotationProductSchema>;
export type QuotationItem = z.infer<typeof quotationItemSchema>
export type AddQuotation = z.infer<typeof addQuotationSchema>;