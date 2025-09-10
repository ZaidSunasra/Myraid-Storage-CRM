import { Product_Type } from "@prisma/client"
import { prisma } from "../../libs/prisma"
import { AddQuotation } from "zs-crm-common";

export const getQuotationProductsService = async (product_type: Product_Type, bay: number, compartment: number): Promise<any> => {
    const products = await prisma.baseProduct.findMany({
        where: {
            product_type: product_type
        }
    });
    const enrichedProducts = products.map((product) => ({
        ...product,
        per_bay_qty: product.code != null ? product.per_bay_qty * bay : product.per_bay_qty,
        default_height: product.code != null ? product.default_height + (compartment - 4) * 400 : product.default_height,
        default_width: product.code != null ? product.default_width + (bay - 1) * 900 : product.default_width,
        default_depth: compartment === 7 && product.code === "SFMU" ? 475 : product.default_depth,
        qty: 1,
        provided_rate: 0,
        market_rate: 0
    }));
    return enrichedProducts;
}

export const adddQuotationService = async ({ quotation_template, product_type, bay, compartment, quotation_item, powder_coating, trolley_material,
    sheet_material, total_weight, labour_cost, installation, accomodation, transport, metal_rate, total, grandTotal, gst, discount, total_body, total_market_rate,
    total_provided_rate, round_off }: AddQuotation, deal_id: string): Promise<any> => {

    await prisma.$transaction(async (tx) => {
        const quotation = await tx.quotation.create({
            data: {
                deal_id: deal_id,
                subject: `${bay} Bay ${compartment} Compartment - ${product_type}`,
                quotation_template: quotation_template,
                gst: gst,
                discount: discount,
                round_off: round_off,
                sub_total: total,
                grand_total: grandTotal
            },
            select: {
                id: true
            }
        });
       if(quotation_item && quotation_item?.length > 0) {
            await tx.quotationItem.createMany({
                data: quotation_item?.map((item) => ({
                    quotation_id: quotation.id,
                    item_name: item.name,
                    item_code: item.code,
                    height: item.default_height,
                    width: item.default_width,
                    depth: item.default_depth,
                    provided_rate: item.provided_rate,
                    market_rate: item.market_rate,
                    quantity: item.qty
                }))
            })
        }
        await tx.quotationWorking.create({
            data: {
                quotation_id: quotation.id,
                total_weight: total_weight,
                sheet_material: sheet_material,
                trolley_material: trolley_material,
                powder_coating: powder_coating,
                labour_cost: labour_cost,
                installation: installation,
                transport: transport,
                accomodation: accomodation,
                provided_total_cost: total_provided_rate,
                market_total_cost: total_market_rate,
                total_body: total_body,
                metal_rate: metal_rate
            }
        })
    });
}

export const getQuotationByDealService = async (deal_id: string) : Promise<any> => {
    const quotation = await prisma.quotation.findMany({
        where: {
            deal_id: deal_id
        },
        include: {
            deal: true,
            items: true,
            working: true
        }
    });
    return quotation;
}

export const getQuotationService = async () : Promise<any> => {
    const quotation = await prisma.quotation.findMany({
        where: {},
        include: {
            deal: true,
            items: true,
            working: true
        },
        orderBy: {
            created_at: "desc"
        }
    });
    return quotation;
}

export const getQuotationByIdService = async (id: string) : Promise<any> => {
    const quotation = await prisma.quotation.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            deal: true,
            items: true,
            working: true
        }
    });
    return quotation;
}