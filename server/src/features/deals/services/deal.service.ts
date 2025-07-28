import { Deal_Status, Notification_Type } from "@prisma/client";
import { prisma } from "../../../libs/prisma"
import { DEPARTMENTS, Deal, GetAllDealOutput, GetDealOutput } from "zs-crm-common";
import { Include } from "../constants";

export const getDealService = async (user: any, rows: number, page: number, search: string, startDate: string, endDate: string, employeeId: string[], sourceId: string[]): Promise<GetAllDealOutput> => {
    const isAdmin = user.department === DEPARTMENTS[1];
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
        include: Include
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
            id: parseInt(id)
        },
        include: Include
    });
    return deal;
}

export const convertLeadToDealService = async (lead_id: string, author: { id: number, name: string, }): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const lead = await tx.lead.findUnique({
            where: {
                id: parseInt(lead_id)
            }
        });
        if (lead) {
            const deal = await tx.deal.create({
                data: {
                    deal_status: Deal_Status.pending,
                    company_id: lead.company_id,
                    client_id: lead.client_id,
                    source_id: lead.source_id,
                    product_id: lead.product_id,
                    lead_id: parseInt(lead_id),
                    updated_by: author.id
                }
            })
            await tx.asignee.updateMany({
                where: {
                    lead_id: parseInt(lead_id)
                },
                data: {
                    deal_id: deal.id,
                    lead_id: null
                }
            });
            await tx.notification.updateMany({
                where: {
                    OR: [
                        { type: Notification_Type.client_meeting },
                        { type: Notification_Type.mentioned }
                    ],
                    lead_id: parseInt(lead_id)
                },
                data: {
                    deal_id: deal.id,
                    lead_id: null,
                }
            });
            await tx.description.updateMany({
                where: {
                    lead_id: parseInt(lead_id)
                },
                data: {
                    deal_id: deal.id,
                    lead_id: null
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
            id: parseInt(deal_id)
        },
        data: {
            deal_status: status
        }
    });
}
