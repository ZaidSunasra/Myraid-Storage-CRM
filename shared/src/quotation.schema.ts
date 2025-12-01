import z from "zod/v4";
import { Client_Details, Company, SuccessResponse } from "./common.schema";

export const productSelectorSchema = z.object({
    product_type: z.string(),
    bay: z.number().gte(1),
    compartment: z.number().gte(1),
})
export type ProductSelector = z.infer<typeof productSelectorSchema>

export const QUOTATION_TEMPLATE = ["set_wise", "item_wise"] as const;
export type quotation_template = typeof QUOTATION_TEMPLATE[number];

export const quotationItemSchema = z.object({
    id: z.number().min(1, "Id is required"),
    code: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    name: z.string().min(1, "Name is required"),
    height: z.number(),
    width: z.number(),
    depth: z.number(),
    quantity: z.number(),
    per_bay_qty: z.number(),
    provided_rate: z.number(),
    market_rate: z.number(),
    removed: z.boolean()
})

export const quotationProductSchema = z.object({
    id: z.number(),
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
    metal_rate: z.string(),
    total_body: z.number(),
    total_market_rate: z.number(),
    total_provided_rate: z.number(),
    set: z.number(),
    profit_percent: z.number(),
    discount: z.number(),
})

export const addQuotationSchema = z.object({
    quotation_template: z.enum(QUOTATION_TEMPLATE),
    quotation_item: z.array(quotationProductSchema).optional(),
    quotation_no: z.string(),
    total: z.number(),
    grandTotal: z.number(),
    gst: z.number(),
    round_off: z.number(),
    show_body_table: z.boolean(),
    note: z.string().trim().optional().nullable(),
    specifications: z.string(),
    terms_and_condition: z.string(),
})

export const copyQuotationschema = z.object({
    deal_id: z.string(),
    quotation_no: z.string()
})

export type CopyQuotation = z.infer<typeof copyQuotationschema>;
export type QuotationProduct = z.infer<typeof quotationProductSchema>;
export type QuotationItem = z.infer<typeof quotationItemSchema>
export type AddQuotation = z.infer<typeof addQuotationSchema>;

export type Quotation = {
    created_at: Date
    created_by: number
    deal_id: string
    grand_total: number
    quotation_no: string
    gst: number
    id: number
    quotation_template: quotation_template
    round_off: number
    show_body_table: boolean
    sub_total: number
    note: string | null
    specifications: string
    terms_and_condition: string
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
    metal_rate: string
    powder_coating: number
    profit_percent: number
    discount: number
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
    description: string | null
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

export type GetAllQuotationOutput = {
    convertedQuotation: GetQuotationOutput[] | null,
    totalQuotations: number
}

export type GetQuotationByDealOutput = {
    id: number,
    deal_id: string,
    created_at: Date,
    grand_total: number,
    quotation_no: string
}

export type GetQuotationBaseProduct = {
    per_bay_qty: number;
    height: number;
    width: number;
    depth: number;
    quantity: number;
    provided_rate: number;
    market_rate: number;
    id: number;
    product_type: string;
    compartment: number;
    name: string;
    code: string | null;
    description: string | null;
    removed: boolean
}

export type GetCompactorDetailOutput = {
    name: string,
    code: string | null,
    product_type: string
}

export type GetDetailByQuotationNumberOutput = {
    grand_total: number,
    total_body: number | undefined,
    height: string
}

export type GetCompactorDetailSuccessResponse = SuccessResponse & {
    compactors: GetCompactorDetailOutput[]
}

export type GetDetailByQuotationNumberSuccessResponse = SuccessResponse & {
    quotation: GetDetailByQuotationNumberOutput
}

export type QuotationBaseProductSuccessResponse = SuccessResponse & {
    products: GetQuotationBaseProduct[]
}

export type GetQuotationByDealSuccessResponse = SuccessResponse & {
    quotations: GetQuotationByDealOutput[]
}

export type GetAllQuotationSuccessResponse = SuccessResponse & GetAllQuotationOutput

export type GetQuotationByIdSuccessResponse = SuccessResponse & {
    quotation: GetQuotationOutput | null
}