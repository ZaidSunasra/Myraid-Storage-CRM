import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { transporter } from '../libs/mailer';

const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
});

const emailWorker = new Worker('emailQueue', async (job) => {
    const { userEmail, title, message } = job.data;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: title,
        text: message,
    });
    return info.messageId;
}, { connection });

emailWorker.on('failed', (job, error) => {
    console.error('❌ Job failed:', job?.id, error);
});

const shutdown = async () => {
    await emailWorker.close();
    await connection.quit();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);