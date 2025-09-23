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

export const adddQuotationService = async ({ quotation_template, product_type, bay, compartment, quotation_item, total, grandTotal, gst, discount, round_off }: AddQuotation,
    deal_id: string): Promise<any> => {
    await prisma.$transaction(async (tx) => {
        const quotation = await tx.quotation.create({
            data: {
                deal_id: deal_id,
                quotation_template: quotation_template,
                gst: gst,
                discount: discount,
                round_off: round_off,
                sub_total: total,
                grand_total: grandTotal,
            },
            select: { id: true },
        });
        for (const product of quotation_item ?? []) {
            const createdProduct = await tx.quotationProducts.create({
                data: {
                    quotation_id: quotation.id,
                    name: product.name,
                },
            });
            if (product.items && product.items.length > 0) {
                await tx.quotationItem.createMany({
                    data: product.items.map((item) => ({
                        quotation_product_id: createdProduct.id,
                        item_name: item.name,
                        item_code: item.code ?? null,
                        height: item.default_height,
                        width: item.default_width,
                        depth: item.default_depth,
                        provided_rate: item.provided_rate,
                        market_rate: item.market_rate,
                        per_bay_qty: item.per_bay_qty,
                        quantity: item.qty,
                    })),
                });
            }
            await tx.quotationWorking.create({
                data: {
                    quotation_product_id: createdProduct.id,
                    total_weight: product.total_weight,
                    ss_material: product.ss_material,
                    trolley_material: product.trolley_material,
                    powder_coating: product.powder_coating,
                    labour_cost: product.labour_cost,
                    installation: product.installation,
                    transport: product.transport,
                    accomodation: product.accomodation,
                    provided_total_cost: product.total_provided_rate,
                    market_total_cost: product.total_market_rate,
                    total_body: product.total_body,
                    metal_rate: product.metal_rate,
                    set: product.set,
                    profit_percent: product.profit_percent,
                },
            });
        }
    });
}

export const getQuotationByDealService = async (deal_id: string): Promise<any> => {
    const quotation = await prisma.quotation.findMany({
        where: {
            deal_id: deal_id
        },
        include: {
            deal: true,
            quotation_products: {
                select: {
                    name: true,
                    quotation_item: true,
                    quotation_working: true,
                    id: true
                }
            }
        }
    });
    return quotation;
}

export const getQuotationService = async (): Promise<any> => {
    const quotation = await prisma.quotation.findMany({
        where: {},
        include: {
            deal: true,
            quotation_products: {
                select: {
                    name: true,
                    quotation_item: true,
                    quotation_working: true,
                    id: true
                }
            }
        },
        orderBy: {
            created_at: "desc"
        }
    });
    return quotation;
}

export const getQuotationByIdService = async (id: string): Promise<any> => {
    const quotation = await prisma.quotation.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            deal: {
                select: {
                    company: true,
                    client_detail: {
                        include: {
                            emails: true,
                            phones: true
                        }
                    }
                },
            },
            quotation_products: {
                select: {
                    name: true,
                    quotation_item: true,
                    quotation_working: true,
                    id: true
                }
            }
        }
    });
    return quotation;
}