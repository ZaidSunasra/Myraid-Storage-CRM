import cron from 'node-cron';
import { prisma } from '../libs/prisma';

const  notificationReminderCron = () => {
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        now.setSeconds(0);
        now.setMilliseconds(0);
        console.log(now);

        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    {
                        send_at: null
                    },
                    {
                        send_at: {
                            equals: now
                        }
                    }
                ],
                is_sent: false,
            },
           include: {
            recipient_list: true
           }
        });
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: notifications.map((n) => n.id)
                }
            },
            data: {
                is_sent: true
            }
        })

        await prisma.recipient.updateMany({
            where: {
                notification_id: {
                    in: notifications.map((n) => n.id)
                }
            },
            data: {
                is_ready: true
            }
        })
    });

}

export default notificationReminderCron;