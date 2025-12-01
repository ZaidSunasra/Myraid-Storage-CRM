import { prisma } from "../../libs/prisma.js"
import { AddQuotation, DEPARTMENTS, GetAllQuotationOutput, GetCompactorDetailOutput, GetDetailByQuotationNumberOutput, GetQuotationBaseProduct, GetQuotationByDealOutput, GetQuotationOutput, } from "zs-crm-common";
import { convertQuotation, convertQuotationArray } from "./utils.js";

export const getQuotationProductsService = async (product_type: string, bay: number, compartment: number): Promise<GetQuotationBaseProduct[]> => {
    const products = await prisma.baseProduct.findMany({
        where: {
            product_type: product_type
        }
    });
    const enrichedProducts = products.map((product) => ({
        ...product,
        per_bay_qty: product.code != null ? product.per_bay_qty * bay : product.per_bay_qty,
        height: product.code != null ? product.default_height + (compartment - 4) * 400 : product.default_height,
        width: product.code != null ? product.default_width + (bay - 1) * 900 : product.default_width,
        depth: compartment === 7 && product.code === "SFMU" ? 475 : product.default_depth,
        quantity: 1,
        provided_rate: 0,
        market_rate: 0,
        removed: false,
        description: null
    }));
    return enrichedProducts;
}

export const addQuotationService = async ({ quotation_template, quotation_item, total, grandTotal, gst, round_off, show_body_table, note, quotation_no, specifications, terms_and_condition}: AddQuotation,
    deal_id: string, author: any): Promise<any> => {
    await prisma.$transaction(async (tx) => {
        const quotation = await tx.quotation.create({
            data: {
                deal_id: deal_id,
                quotation_template: quotation_template,
                gst: gst,
                round_off: round_off,
                sub_total: total,
                grand_total: grandTotal,
                show_body_table: show_body_table,
                note: note,
                quotation_no: quotation_no,
                created_by: author.id,
                specifications: specifications,
                terms_and_condition: terms_and_condition
            },
            select: {
                id: true,
                deal: {
                    select: {
                        assigned_to: {
                            select: {
                                user_id: true
                            }
                        }
                    }
                }
            },
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
                        description: item.description ?? null,
                        height: item.height,
                        width: item.width,
                        depth: item.depth,
                        provided_rate: item.provided_rate,
                        market_rate: item.market_rate,
                        per_bay_qty: item.per_bay_qty,
                        quantity: item.quantity,
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
                    discount: product.discount,
                },
            });
        }
        const notification = await tx.notification.create({
            data: {
                deal_id: deal_id,
                is_sent: false,
                description_id: null,
                lead_id: null,
                message: `Quotation with Quotation No: ${quotation_no.toUpperCase()} added for Deal Id: ${deal_id.toUpperCase()} by ${author.name}`,
                title: "New quotation created",
                send_at: null,
                order_id: null,
                type: "add_quotation"
            },
            select: {
                id: true
            }
        })
        await tx.recipient.createMany({
            data: quotation.deal.assigned_to.map((u) => ({
                notification_id: notification.id,
                user_id: u.user_id,
            })),
        });
        if (grandTotal > 500000) {
            await tx.deal.update({
                where: {
                    id: deal_id
                },
                data: {
                    deal_status: "high_order_value"
                }
            })
        }
    });
}

export const getCompactorDetailsService = async (): Promise<GetCompactorDetailOutput[]> => {
    const compactors = await prisma.baseProduct.findMany({
        where: {
            product_type: "compactor"
        },
        select: {
            name: true,
            code: true,
            product_type: true
        }
    });
    return compactors;
}

export const getQuotationByDealService = async (deal_id: string): Promise<GetQuotationByDealOutput[]> => {
    const quotation = await prisma.quotation.findMany({
        where: {
            deal_id: deal_id
        },
        select: {
            id: true,
            deal_id: true,
            created_at: true,
            grand_total: true,
            quotation_no: true
        }
    });
    return quotation.map(q => ({
        ...q,
        grand_total: Number(q.grand_total),
    }));
}

export const getQuotationService = async (user: any, page: number, search: string, employeeId: string[], rows: number, startDate: string, endDate: string, sortBy: string, sortOrder: string): Promise<GetAllQuotationOutput> => {
    const isAdmin = user.department === DEPARTMENTS[1];
    const quotation = await prisma.quotation.findMany({
        take: rows,
        skip: (page - 1) * rows,
        where: {
            AND: [
                startDate && endDate ? {
                    created_at: {
                        gte: new Date(startDate),
                        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                    }
                } : startDate ? {
                    created_at: {
                        gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                        lte: new Date(new Date(startDate).setHours(23, 59, 59, 999))
                    }
                } : endDate ? {
                    created_at: {
                        gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
                        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                    }
                } : {},
                search ? {
                    OR: [
                        {
                            deal: {
                                company: {
                                    name: { contains: search, mode: 'insensitive' }
                                }
                            }
                        },
                        {
                            deal: {
                                client_detail: {
                                    first_name: { contains: search, mode: 'insensitive' }
                                }
                            }
                        },
                        {
                            deal: {
                                client_detail: {
                                    last_name: { contains: search, mode: 'insensitive' }
                                }
                            }
                        }
                    ]
                } : {},
                !isAdmin
                    ? {
                        deal: {
                            assigned_to: { some: { user_id: user.id } }
                        }
                    }
                    : employeeId.length > 0
                        ? { deal: { assigned_to: { some: { user_id: { in: employeeId.map(Number) } } } } }
                        : {},
            ]
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
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const totalQuotations = await prisma.quotation.count();

    const convertedQuotation = convertQuotationArray(quotation)

    return { convertedQuotation, totalQuotations }
}

export const getQuotationByIdService = async (id: string): Promise<GetQuotationOutput | null> => {
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
                    },
                    assigned_to: {
                        select: {
                            user: {
                                select: {
                                    phone: true,
                                    department: true
                                }
                            }
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

    if (!quotation) return null;

    const convertedQuotation = convertQuotation(quotation)

    return convertedQuotation;
}

export const editQuotationService = async ({ quotation_template, quotation_item, total, grandTotal, gst, round_off, show_body_table, note, quotation_no, specifications, terms_and_condition}: AddQuotation,
    deal_id: string, id: string, author: any): Promise<any> => {
    await prisma.$transaction(async (tx) => {
        const quotation = await tx.quotation.update({
            where: {
                id: parseInt(id)
            },
            data: {
                quotation_no: quotation_no,
                deal_id: deal_id,
                quotation_template: quotation_template,
                gst: gst,
                round_off: round_off,
                sub_total: total,
                grand_total: grandTotal,
                show_body_table: show_body_table,
                note: note,
                created_at: new Date(Date.now()),
                created_by: author.id,
                specifications: specifications,
                terms_and_condition: terms_and_condition
            },
            select: { id: true },
        });
        await tx.quotationProducts.deleteMany({
            where: {
                quotation_id: quotation.id
            }
        })
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
                        description: item.description ?? null,
                        height: item.height,
                        width: item.width,
                        depth: item.depth,
                        provided_rate: item.provided_rate,
                        market_rate: item.market_rate,
                        per_bay_qty: item.per_bay_qty,
                        quantity: item.quantity,
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
                    discount: product.discount
                },
            });
        }
        if (grandTotal >= 500000) {
            await tx.deal.update({
                where: {
                    id: deal_id
                },
                data: {
                    deal_status: "high_order_value"
                }
            })
        } else {
            await tx.deal.update({
                where: {
                    id: deal_id
                },
                data: {
                    deal_status: "quotation"
                }
            })
        }
    });
}

export const copyQuotationDataService = async (quotation: GetQuotationOutput | null, deal_id: string, quotation_no: string, author: any): Promise<void> => {
    if (!quotation) return;
    await prisma.$transaction(async (tx) => {
        const quotation_id = await tx.quotation.create({
            data: {
                deal_id: deal_id,
                quotation_no: quotation_no.toUpperCase(),
                quotation_template: quotation?.quotation_template,
                gst: quotation.gst,
                round_off: quotation.round_off,
                sub_total: quotation.sub_total,
                grand_total: quotation.grand_total,
                show_body_table: quotation.show_body_table,
                note: quotation.note,
                created_by: quotation.created_by,
                specifications: quotation.specifications,
                terms_and_condition: quotation.terms_and_condition
            },
            select: {
                id: true,
                deal: {
                    select: {
                        assigned_to: {
                            select: {
                                user_id: true
                            }
                        }
                    }
                }
            },
        });
        for (const product of quotation.quotation_products) {
            const createdProduct = await tx.quotationProducts.create({
                data: {
                    quotation_id: quotation_id.id,
                    name: product.name,
                },
            });
            if (product.quotation_item && product.quotation_item.length > 0) {
                await tx.quotationItem.createMany({
                    data: product.quotation_item.map((item) => ({
                        quotation_product_id: createdProduct.id,
                        item_name: item.item_name,
                        item_code: item.item_code ?? null,
                        description: item.description ?? null,
                        height: item.height,
                        width: item.width,
                        depth: item.depth,
                        provided_rate: item.provided_rate,
                        market_rate: item.market_rate,
                        per_bay_qty: item.per_bay_qty,
                        quantity: item.quantity,
                    })),
                });
            }
            await tx.quotationWorking.create({
                data: {
                    quotation_product_id: createdProduct.id,
                    total_weight: product.quotation_working[0].total_weight,
                    ss_material: product.quotation_working[0].ss_material,
                    trolley_material: product.quotation_working[0].trolley_material,
                    powder_coating: product.quotation_working[0].powder_coating,
                    labour_cost: product.quotation_working[0].labour_cost,
                    installation: product.quotation_working[0].installation,
                    transport: product.quotation_working[0].transport,
                    accomodation: product.quotation_working[0].accomodation,
                    provided_total_cost: product.quotation_working[0].provided_total_cost,
                    market_total_cost: product.quotation_working[0].market_total_cost,
                    total_body: product.quotation_working[0].total_body,
                    metal_rate: product.quotation_working[0].metal_rate,
                    set: product.quotation_working[0].set,
                    profit_percent: product.quotation_working[0].profit_percent,
                    discount: product.quotation_working[0].discount,
                },
            });
        }
        const notification = await tx.notification.create({
            data: {
                deal_id: deal_id,
                is_sent: false,
                description_id: null,
                lead_id: null,
                message: `Quotation with Quotation No: ${quotation_no.toUpperCase()} copied for Deal Id: ${deal_id.toUpperCase()} by ${author.name}`,
                title: "New quotation created",
                send_at: null,
                order_id: null,
                type: "add_quotation"
            },
            select: {
                id: true
            }
        })
        await tx.recipient.createMany({
            data: quotation_id.deal.assigned_to.map((u) => ({
                notification_id: notification.id,
                user_id: u.user_id,
            })),
        });
        if (quotation.grand_total > 500000) {
            await tx.deal.update({
                where: {
                    id: deal_id
                },
                data: {
                    deal_status: "high_order_value"
                }
            })
        }
    })
}

export const deleteQuotationService = async (id: string): Promise<void> => {
    await prisma.quotation.delete({
        where: {
            id: parseInt(id)
        }
    })
}

export const getDetailByQuotationNumberService = async (quotation_no: string): Promise<GetDetailByQuotationNumberOutput> => {
    const quotation = await prisma.quotation.findUnique({
        where: {
            quotation_no: quotation_no
        },
        select: {
            grand_total: true,
            quotation_products: {
                select: {
                    quotation_working: {
                        select: {
                            total_body: true,
                        }
                    },
                    quotation_item: {
                        select: {
                            height: true
                        }
                    }
                }
            }
        }
    });

    const totalBody = quotation?.quotation_products.reduce((sum, product) => {
        return sum + (product.quotation_working?.[0]?.total_body || 0);
    }, 0);

    const allHeights = new Set(
        quotation?.quotation_products.flatMap((product) =>
            product.quotation_item
                .map((item) => item.height)
                .filter((h) => h > 0)
        )
    );

    const result = {
        grand_total: Number(quotation?.grand_total),
        total_body: totalBody,
        height: [...allHeights]?.join("/")
    };
    return result;
}