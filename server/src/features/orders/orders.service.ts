import { AddOrder } from "zs-crm-common";
import { prisma } from "../../libs/prisma";

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

export const addOrderService = async ({ quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, colour, deal_id }: AddOrder): Promise<void> => {
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
                    colour: colour,
                    quotation_id: quotation_id?.id,
                    order_number: orderNumber
                }
            })
        }
    })
}