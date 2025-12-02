import { Deal_Status } from "@prisma/client";
import { prisma } from "../../libs/prisma.js"
import { AddDeal, DEPARTMENTS, Deal, GetAllDealOutput, GetDealByDuration, GetDealOutput, GetOnlyDealIdOutput } from "zs-crm-common";
import { Include } from "./constants.js";
import { convertAssignIdsIntoArray } from "../leads/lead.service.js";

export const generateDealId = async (quotation_code: string): Promise<string> => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const fyStart = month < 3 ? year - 1 : year;
    const fyEnd = fyStart + 1;
    const lastDealNumber = await prisma.deal.findFirst({
        where: {
            id: {
                startsWith: `MSS_LP-${String(fyStart).slice(2)}_${String(fyEnd).slice(2)}-${quotation_code.slice(0, 2)}`
            }
        },
        orderBy: {
            created_at: "desc"
        },
        select: {
            id: true
        }
    });
    const latestDealNumber = lastDealNumber ? parseInt(lastDealNumber?.id.slice(-4)) + 1 : quotation_code;
    return `MSS_LP-${String(fyStart).slice(2)}_${String(fyEnd).slice(2)}-${latestDealNumber}`;
}

export const getDealService = async (user: any, rows: number, page: number, search: string, startDate: string, endDate: string, employeeId: string[], sourceId: string[]): Promise<GetAllDealOutput> => {
    const isAdmin = user.department === DEPARTMENTS[1] || user.department === DEPARTMENTS[3];
    const deals = await prisma.deal.findMany({
        where: {
            AND: [
                sourceId.length > 0 ? {
                    source_id: { in: sourceId.map(Number) }
                } : {},
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
                            company: {
                                name: { contains: search, mode: 'insensitive' }
                            }
                        },
                        {
                            id: { contains: search, mode: 'insensitive' }
                        },
                        {
                            client_detail: {
                                first_name: { contains: search, mode: 'insensitive' }
                            }
                        },
                        {
                            client_detail: {
                                last_name: { contains: search, mode: 'insensitive' }
                            }
                        }
                    ]
                } : {},
                !isAdmin
                    ? { assigned_to: { some: { user_id: user.id } } }
                    : employeeId.length > 0
                        ? { assigned_to: { some: { user_id: { in: employeeId.map(Number) } } } }
                        : {},
            ]
        },
        take: rows,
        skip: (page - 1) * rows,
        include: Include,
        orderBy: {
            created_at: "desc"
        }
    });
    const totalDeals = await prisma.deal.count();
    return { deals, totalDeals };
};

export const getDealByCompanyService = async (company_id: string): Promise<Deal[]> => {
    const deals = await prisma.deal.findMany({
        where: {
            company_id: parseInt(company_id)
        }
    });
    return deals;
};

export const getDealByIdService = async (id: string): Promise<GetDealOutput | null> => {
    const deal = await prisma.deal.findUnique({
        where: {
            id: id
        },
        include: Include
    });
    return deal;
}

export const convertLeadToDealService = async (lead_id: string, author: { id: number, name: string, }, quotation_code: string): Promise<void> => {
    const deal_id = await generateDealId(quotation_code);

    await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
            where: {
                quotation_code: quotation_code,
            },
            select: {
                id: true
            }
        });
        const lead = await tx.lead.findUnique({
            where: {
                id: parseInt(lead_id)
            }
        });
        if (lead) {
            const deal = await tx.deal.create({
                data: {
                    id: deal_id,
                    deal_status: Deal_Status.pending,
                    company_id: lead.company_id,
                    client_id: lead.client_id,
                    source_id: lead.source_id,
                    product_id: lead.product_id,
                    lead_id: parseInt(lead_id),
                    updated_by: user?.id as number
                }
            })
            await tx.asignee.updateMany({
                where: {
                    lead_id: parseInt(lead_id)
                },
                data: {
                    deal_id: deal.id,
                }
            });
            await tx.notification.updateMany({
                where: {
                    lead_id: parseInt(lead_id)
                },
                data: {
                    deal_id: deal.id,
                }
            });
            await tx.description.updateMany({
                where: {
                    lead_id: parseInt(lead_id)
                },
                data: {
                    deal_id: deal.id,
                }
            })
            await tx.lead.update({
                where: {
                    id: parseInt(lead_id)
                },
                data: {
                    is_converted: true
                }
            });
        }
    })
}

export const editDealStatusService = async (deal_id: string, status: Deal_Status): Promise<void> => {
    await prisma.deal.update({
        where: {
            id: deal_id
        },
        data: {
            deal_status: status
        }
    });
}

export const addDealService = async ({ company_id, employee_id, source_id, product_id, assigned_to, deal_status }: AddDeal, author: any): Promise<void> => {

    const editedId = convertAssignIdsIntoArray(assigned_to);
    const recipientId = editedId.filter((id) => id !== author.id);

    await prisma.$transaction(async (tx) => {
        const quotation_code = await tx.user.findUnique({
            where: {
                id: assigned_to[0].id
            },
            select: {
                quotation_code: true
            }
        });
        const deal_id = await generateDealId(String(quotation_code?.quotation_code));
        await tx.deal.create({
            data: {
                company_id: parseInt(company_id),
                client_id: parseInt(employee_id),
                source_id: source_id,
                product_id: product_id,
                deal_status: deal_status,
                id: deal_id,
                lead_id: null,
                updated_by: assigned_to[0].id,
            }
        });
        await tx.asignee.createMany({
            data: assigned_to.map((id) => ({
                user_id: id.id,
                deal_id: deal_id
            }))
        })
        if (recipientId.length > 0) {
            const notification = await tx.notification.create({
                data: {
                    title: "Deal assigned",
                    message: `You were assigned to a new deal by ${author.name}`,
                    type: "deal_assigned",
                    send_at: null,
                    deal_id: deal_id
                }
            })
            await tx.recipient.createMany({
                data: recipientId.map((id) => ({
                    notification_id: notification.id,
                    user_id: id
                }))
            })
        }
    })
}

export const editDealService = async ({ company_id, employee_id, source_id, product_id, assigned_to, deal_status }: AddDeal, deal_id: string, author: any): Promise<void> => {
    const editedId = convertAssignIdsIntoArray(assigned_to);
    await prisma.$transaction(async (tx) => {
        const deal = await tx.deal.findUnique({
            where: {
                id: deal_id
            }
        });
        const prevMasterUser = deal?.updated_by;
        const currentMasterUser = assigned_to[0].id;
        const recipientId = editedId.filter((id) => id !== prevMasterUser && id !== author.id);
        if (prevMasterUser === currentMasterUser) {
            await tx.deal.update({
                where: {
                    id: deal_id
                },
                data: {
                    company_id: parseInt(company_id),
                    client_id: parseInt(employee_id),
                    source_id: source_id,
                    product_id: product_id,
                    deal_status: deal_status
                }
            });
            await tx.asignee.deleteMany({
                where: {
                    deal_id: deal_id
                }
            });
            await tx.asignee.createMany({
                data: assigned_to.map((id) => ({
                    user_id: id.id,
                    deal_id: deal_id
                }))
            });
            if (recipientId.length > 0) {
                const notification = await tx.notification.create({
                    data: {
                        title: "Deal assigned",
                        message: `You were assigned to an existing deal by ${author.name}`,
                        type: "deal_assigned",
                        send_at: null,
                        deal_id: deal_id
                    }
                })
                await tx.recipient.createMany({
                    data: recipientId.map((id) => ({
                        notification_id: notification.id,
                        user_id: id
                    }))
                })
            }
        } else {
            const quotation_code = await tx.user.findUniqueOrThrow({
                where: {
                    id: assigned_to[0].id
                },
                select: {
                    quotation_code: true
                }
            })
            const newDealId = await generateDealId(quotation_code.quotation_code as string);
            await tx.deal.create({
                data: {
                    id: newDealId,
                    company_id: parseInt(company_id),
                    client_id: parseInt(employee_id),
                    source_id: source_id,
                    product_id: product_id,
                    deal_status: deal_status,
                    updated_by: currentMasterUser,
                    lead_id: deal?.lead_id ?? null
                }
            });
            await tx.asignee.deleteMany({
                where: {
                    deal_id: deal_id
                }
            });
            await tx.asignee.createMany({
                data: assigned_to.map((id) => ({
                    user_id: id.id,
                    deal_id: newDealId
                }))
            });
            if (recipientId.length > 0) {
                const notification = await tx.notification.create({
                    data: {
                        title: "Deal assigned",
                        message: `You were assigned to an existing deal by ${author.name}`,
                        type: "deal_assigned",
                        send_at: null,
                        deal_id: deal_id
                    }
                })
                await tx.recipient.createMany({
                    data: recipientId.map((id) => ({
                        notification_id: notification.id,
                        user_id: id
                    }))
                })
            }
            await tx.notification.updateMany({ where: { deal_id }, data: { deal_id: newDealId } });
            await tx.drawing.updateMany({ where: { deal_id }, data: { deal_id: newDealId } });
            await tx.quotation.updateMany({ where: { deal_id }, data: { deal_id: newDealId, quotation_no: newDealId } });
            await tx.order.updateMany({ where: { deal_id }, data: { deal_id: newDealId } });
            await tx.description.updateMany({ where: { deal_id }, data: { deal_id: newDealId } });
            await tx.deal.delete({ where: { id: deal_id } })
        }
    })
}

export const getDealIdService = async (author: any): Promise<GetOnlyDealIdOutput[]> => {
    const dealIds = await prisma.deal.findMany({
        where: {
            assigned_to: {
                some: {
                    user_id: author.id
                }
            }
        },
        select: {
            id: true
        }
    });
    return dealIds;
}

const getDate = (range: "today" | "weekly" | "monthly" | "yearly" | "all") => {
    const now = new Date()
    const dayOfWeek = now.getDay() || 7;
    switch (range) {
        case "today":
            return {
                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
                lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
            }
        case "weekly":
            return {
                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - (dayOfWeek - 1), 0, 0, 0, 0),
                lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
            }
        case "monthly":
            return {
                gte: new Date(now.getFullYear(), now.getMonth(), 0, 0, 0, 0, 0),
                lte: new Date(now)
            }
        case "weekly":
            return {
                gte: new Date(now.getFullYear(), 0, 0, 0, 0, 0, 0),
                lte: new Date(now)
            }
        default:
            return undefined;
    }
}

export const getDealByDurationService = async (duration: "today" | "weekly" | "monthly" | "yearly" | "all"): Promise<GetDealByDuration> => {
    const dateFilter = getDate(duration);
    const whereClause = dateFilter ? { created_at: dateFilter } : {};
    const deals = await prisma.deal.findMany({
        where: whereClause,
        select: {
            assigned_to: {
                select: {
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true
                        }
                    }
                }
            }
        }
    });
    const totalDeals = deals.length;
    const employeeDealCount: Record<string, number> = {};
    for (const deal of deals) {
        for (const asignee of deal.assigned_to) {
            const fullName = `${asignee.user.first_name} ${asignee.user.last_name}`;
            employeeDealCount[fullName] = (employeeDealCount[fullName] || 0) + 1
        }
    }
    return { employeeDealCount, totalDeals }
}