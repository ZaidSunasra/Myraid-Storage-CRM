import { prisma } from "../../libs/prisma";

export const getUnreadNotificationsService = async (id: string): Promise<any> => {
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

export const getReadNotificationsService = async (id: string): Promise<any> => {
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

export const markNotificationService = async(recipient_id: string) : Promise<void> => {
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