import { Queue } from 'bullmq';
import { redis } from '@/config/redis';

export const orderQueue = new Queue('orders', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
