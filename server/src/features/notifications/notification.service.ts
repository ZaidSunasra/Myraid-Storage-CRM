import { prisma } from "../../libs/prisma.js";
import { GetNotificationOutput } from "zs-crm-common";

export const getUnreadNotificationsService = async (id: string): Promise<GetNotificationOutput[]> => {
    const notifications = await prisma.recipient.findMany({
        where: {
            user_id: parseInt(id),
            is_ready: true,
            is_read: false
        },
        include: {
            notification: true
        }
    });
    return notifications
}

export const getReadNotificationsService = async (id: string): Promise<GetNotificationOutput[]> => {
    const notifications = await prisma.recipient.findMany({
        where: {
            user_id: parseInt(id),
            is_read: true
        },
        include: {
            notification: true
        }
    });
    return notifications
}

export const markNotificationService = async (recipient_id: string): Promise<void> => {
    await prisma.recipient.update({
        where: {
            id: parseInt(recipient_id)
        },
        data: {
            is_read: true,
            read_at: new Date()
        }
    })
}

export const markAllNotificationService = async (author : any): Promise<void> => {
    await prisma.recipient.updateMany({
        where: {
            user_id: author.id,
            is_read: false,
            is_ready: true
        },
        data: {
            is_read: true,
            read_at: new Date()
        }
    })
}