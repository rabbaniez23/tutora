import { Worker } from 'bullmq';
import { redis } from '@/config/redis';
import { processOrderTimeout } from './order-timeout.job';

const worker = new Worker(
  'orders',
  async (job) => {
    console.log(`[WORKER] Processing job: ${job.name} (${job.id})`);

    switch (job.name) {
      case 'order-timeout':
        return processOrderTimeout(job.data);
      default:
        console.warn(`[WORKER] Unknown job type: ${job.name}`);
        return { success: false, reason: 'Unknown job type' };
    }
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

worker.on('completed', (job) => {
  console.log(`[WORKER] Job ${job.name} (${job.id}) completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[WORKER] Job ${job?.name} (${job?.id}) failed:`, err.message);
});

worker.on('ready', () => {
  console.log('[WORKER] Order worker ready');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[WORKER] Shutting down...');
  await worker.close();
  process.exit(0);
});

export { worker };
