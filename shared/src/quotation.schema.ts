import z from "zod/v4";
import { Client_Details, Company, SuccessResponse } from "./common.schema";

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
    show_body_table: z.boolean(),
})

export type QuotationProduct = z.infer<typeof quotationProductSchema>;
export type QuotationItem = z.infer<typeof quotationItemSchema>
export type AddQuotation = z.infer<typeof addQuotationSchema>;

export type Quotation = {
    created_at: Date,
    deal_id: string
    discount: number
    grand_total: number
    gst: number
    id: number
    quotation_template: quotation_template
    round_off: number
    show_body_table: boolean
    sub_total: number
    quotation_products: Quotation_Product[]
}

export type Quotation_Product = {
    id: number,
    name: string,
    quotation_item: Quotation_Item[],
    quotation_working: Quotation_Working[]
}

export type Quotation_Working = {
    accomodation: number
    id: number
    installation: number
    labour_cost: number
    market_total_cost: number
    metal_rate: number
    powder_coating: number
    profit_percent: number
    provided_total_cost: number
    quotation_product_id: number
    set: number
    ss_material: number
    total_body: number
    total_weight: number
    transport: number
    trolley_material: number
}

export type Quotation_Item = {
    depth: number
    height: number
    id: number
    item_code: string | null
    item_name: string
    market_rate: number
    per_bay_qty: number
    provided_rate: number
    quantity: number
    quotation_product_id: number
    width: number
}

export type GetQuotationOutput = Quotation & {
    deal: {
        client_detail: Client_Details,
        company: Company,
    },
};

export type GetQuotationByDealOutput = {
    id: number,
    deal_id: string,
    created_at: Date,
    grand_total: number,
    quotation_products: {
        name: string
    }[]
}

export type GetQuotationBaseProduct = {
    per_bay_qty: number;
    default_height: number;
    default_width: number;
    default_depth: number;
    qty: number;
    provided_rate: number;
    market_rate: number;
    id: number;
    product_type: product_type;
    compartment: number;
    name: string;
    code: string | null;
}

export type QuotationBaseProductSuccessResponse = SuccessResponse & {
    products: GetQuotationBaseProduct[]
}

export type GetQuotationByDealSuccessResponse = SuccessResponse & {
    quotations: GetQuotationByDealOutput[]
}

export type GetQuotationSuccessResponse = SuccessResponse & {
    quotations: GetQuotationOutput[] | null
}

export type GetQuotationByIdSuccessResponse = SuccessResponse & {
    quotation: GetQuotationOutput | null
}