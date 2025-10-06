import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
});

connection.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

export const emailQueue = new Queue('emailQueue', { connection });
