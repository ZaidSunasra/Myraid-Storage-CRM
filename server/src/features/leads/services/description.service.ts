import { GetDescriptionByIdOutput, GetDescriptionOutput } from "zs-crm-common";
import { prisma } from "../../../libs/prisma";

export const getDescriptionsService = async (lead_id: string): Promise<GetDescriptionOutput[]> => {
    const descriptions = await prisma.description.findMany({
        where: {
            lead_id: parseInt(lead_id)
        },
        include: {
            user: {
                select: {
                    first_name: true,
                    last_name: true
                }
            }
        }
    });
    return descriptions;
}

export const getDescriptionByIdService = async (description_id: string): Promise<GetDescriptionByIdOutput | null> => {
    const description = await prisma.description.findUnique({
        where: {
            id: parseInt(description_id)
        }
    });
    return description;
}

export const addDescriptionService = async (lead_id: string, description: string, author: any): Promise<void> => {
    const ids = [...description.matchAll(/@\[[^\]]+\]\s\((\d+)\)/g)].map(m => Number(m[1]));
    await prisma.$transaction(async (tx) => {
        const description_id = await tx.description.create({
            data: {
                notes: description.toLowerCase(),
                lead_id: parseInt(lead_id),
                updated_by: parseInt(author.id)
            },
            select: {
                id: true
            }
        });
        if (ids.length > 0) {
            const notification_id = await tx.notification.create({
                data: {
                    title: "Mentioned you",
                    message: `${author.name} mentioned you in a lead`,
                    type: "mentioned",
                    send_at: null,
                    description_id: description_id.id,
                    lead_id: parseInt(lead_id)
                },
                select: {
                    id: true
                }
            });
            await tx.recipient.createMany({
                data: ids.map((id) => ({
                    notification_id: notification_id.id,
                    user_id: id,
                }))
            });
        }
    })
}

export const editDescriptionService = async (description_id: string, description: string, author: any): Promise<void> => {
    const ids = [...description.matchAll(/@\[[^\]]+\]\s\((\d+)\)/g)].map(m => Number(m[1]));
    await prisma.$transaction(async (tx) => {
        const lead_id = await tx.description.update({
            where: {
                id: parseInt(description_id)
            },
            data: {
                notes: description.toLowerCase(),
                updated_by: parseInt(author.id)
            },
            select: {
                lead_id: true
            }
        })
        const notifications = await tx.notification.findMany({
            where: {
                description_id: parseInt(description_id)
            },
            select: { id: true }
        })
        for (const notification of notifications) {
            await tx.notification.delete({
                where: {
                    id: notification.id
                }
            });
        }
        if (ids.length > 0) {
            const notification = await tx.notification.create({
                data: {
                    title: "Mentioned you",
                    message: `${author.name} mentioned you in a lead`,
                    type: "mentioned",
                    send_at: null,
                    description_id: parseInt(description_id),
                    lead_id: lead_id.lead_id
                },
                select: {
                    id: true
                }
            });
            await tx.recipient.createMany({
                data: ids.map((id) => ({
                    notification_id: notification.id,
                    user_id: id,
                }))
            });
        }
    })
}

export const deleteDescriptionService = async (description_id: string): Promise<void> => {
    await prisma.description.delete({
        where: {
            id: parseInt(description_id)
        }
    });
}