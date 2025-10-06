import cron from 'node-cron';
import { prisma } from '../libs/prisma';
import { emailQueue } from '../queues/email.queue';

const notificationReminderCron = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [{ send_at: null }, { send_at: { lte: now } }],
        is_sent: false,
      },
      include: { recipient_list: { include: { user: true } } },
    });

    if (!notifications.length) return;

    await prisma.notification.updateMany({
      where: { id: { in: notifications.map((n) => n.id) } },
      data: { is_sent: true },
    });

    for (const notification of notifications) {
      const recipientPromises = notification.recipient_list.map(async (recipient) => {
        await prisma.recipient.update({
          where: { id: recipient.id },
          data: { is_ready: true, ready_at: new Date() },
        });
        await emailQueue.add('sendEmail', {
          recipientId: recipient.id,
          userEmail: recipient.user.email,
          title: notification.title,
          message: notification.message,
        });
      });
      await Promise.all(recipientPromises);
    }
  });
};

export default notificationReminderCron;