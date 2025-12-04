import { AddOrder, DEPARTMENTS, AddPayment, GetOrderOutput, AddColour, Order } from "zs-crm-common";
import { prisma } from "../../libs/prisma.js";
import Include from "./constants.js";

export const generateOrderNumber = async (): Promise<number> => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const fyStart = month < 3 ? year - 1 : year;
    const fyEnd = fyStart + 1;
    const orderLength = await prisma.order.count({
        where: {
            deal_id: {
                contains: `${String(fyStart).slice(2)}_${String(fyEnd).slice(2)}`
            }
        }
    })
    return orderLength + 1;
}

export const addOrderService = async ({ quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, deal_id, fitted_by, bill_number, powder_coating, count_order }: AddOrder): Promise<void> => {
    const orderNumber = await generateOrderNumber();
    await prisma.$transaction(async (tx) => {
        const quotation_id = await tx.quotation.findUnique({
            where: {
                quotation_no: quotation_no
            },
            select: {
                id: true
            }
        });
        await tx.deal.update({
            where: {
                id: deal_id
            },
            data: {
                deal_status: "order_confirmed"
            }
        });
        if (quotation_id) {
            await tx.order.create({
                data: {
                    deal_id: deal_id,
                    dispatch_at: dispatch_at,
                    height: height,
                    total_body: total_body,
                    balance: total,
                    pi_number: pi_number,
                    po_number: po_number,
                    status: status,
                    quotation_id: quotation_id?.id,
                    order_number: orderNumber,
                    fitted_by: fitted_by,
                    bill_number: bill_number,
                    powder_coating: powder_coating,
                    count_order: count_order
                }
            })
        }
    })
}

export const getOrderService = async (user: any, rows: number, page: number, search: string, startDate: string, endDate: string, employeeId: string[]): Promise<GetOrderOutput> => {
    const isSales = user.department === DEPARTMENTS[0]
    const orders = await prisma.order.findMany({
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
                                },
                                id: { contains: search, mode: 'insensitive' }
                            }
                        }
                    ]
                } : {},
                isSales
                    ? { deal: { assigned_to: { some: { user_id: user.id } } } }
                    : employeeId.length > 0
                        ? { deal: { assigned_to: { some: { user_id: { in: employeeId.map(Number) } } } } }
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
    const totalOrders = await prisma.order.count();
    return { orders, totalOrders };
}

export const getOrderByIdService = async (id: string): Promise<Order | null> => {
    const order = await prisma.order.findUnique({
        where: {
            id: parseInt(id)
        },
        include: Include
    });
    if (!order) return null;
    return order;
}

export const editOrderService = async ({ quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, deal_id, fitted_by, bill_number, count_order, powder_coating }: AddOrder, id: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        if (quotation_no) {
            const quotation_id = await tx.quotation.findUnique({
                where: {
                    quotation_no: quotation_no
                },
                select: {
                    id: true
                }
            });
            await tx.order.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    quotation_id: quotation_id?.id
                }
            })
        }
        await tx.order.update({
            where: {
                id: parseInt(id)
            },
            data: {
                deal_id: deal_id,
                dispatch_at: dispatch_at,
                height: height,
                total_body: total_body,
                balance: total,
                pi_number: pi_number,
                po_number: po_number,
                status: status,
                powder_coating: powder_coating,
                count_order: count_order,
                fitted_by: fitted_by,
                bill_number: bill_number
            }
        })
    })
}

export const deleteOrderService = async (id: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const order = await tx.order.delete({
            where: {
                id: parseInt(id)
            },
            select: {
                deal_id: true
            }
        });
        await tx.deal.update({
            where: {
                id: order.deal_id
            },
            data: {
                deal_status: "negotiation"
            }
        })
    })
}

export const addColourService = async ({ colour }: AddColour, order_id: string, author: any): Promise<void> => {

    await prisma.$transaction(async (tx) => {
        const deptUsers = await tx.user.findMany({
            where: {
                department: {
                    in: ["admin", "accounts", "factory"]
                }
            },
            select: { id: true }
        });
        const orderData = await tx.order.findFirst({
            where: { id: parseInt(order_id) },
            select: {
                deal: {
                    select: {
                        assigned_to: {
                            select: {
                                user: {
                                    select: { id: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        const recipientIds = new Set<number>();
        deptUsers.forEach((u) => recipientIds.add(u.id));
        const assigned = orderData?.deal.assigned_to ?? [];
        assigned.forEach((a) => recipientIds.add(a.user.id));

        const recipientsArray = Array.from(recipientIds);

        await tx.colourChange.create({
            data: {
                colour,
                changed_on: new Date(),
                user_id: author.id,
                order_id: parseInt(order_id),
            }
        });
        const notification = await tx.notification.create({
            data: ({
                order_id: parseInt(order_id),
                type: "color_changed",
                title: "Colour Changed",
                message: `Order ${order_id} colour changed to ${colour}`,
                created_at: new Date(),
            }),
            select: {
                id: true
            }
        })
        await tx.recipient.createMany({
            data: recipientsArray.map(id => ({
                notification_id: notification.id,
                user_id: id
            }))
        })
    });
}

export const addPaymentService = async ({ amount, date }: AddPayment, order_id: string): Promise<void> => {
    await prisma.advance.create({
        data: {
            advance_amount: amount,
            order_id: parseInt(order_id),
            advance_date: date
        }
    })
}

export const editPaymentService = async ({ amount, date }: AddPayment, id: string): Promise<void> => {
    await prisma.advance.update({
        where: {
            id: parseInt(id)
        },
        data: {
            advance_amount: amount,
            advance_date: date
        }
    })
}

export const deletePaymentService = async (id: string): Promise<void> => {
    await prisma.advance.delete({
        where: {
            id: parseInt(id)
        }
    })
}