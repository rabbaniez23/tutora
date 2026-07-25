import { Worker } from 'bullmq';
import { redis } from '@/config/redis';
import { prisma } from '@/config/database';
import { FCMClient } from '@/modules/notification/fcm.client';

interface NotificationJobData {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

async function processNotification(job: { data: NotificationJobData }) {
  const { userId, title, body, data } = job.data;

  // Get user's FCM tokens
  const fcmTokens = await prisma.fcmToken.findMany({
    where: { userId },
    select: { token: true },
  });

  if (fcmTokens.length === 0) {
    console.log(`[NOTIFICATION JOB] No FCM tokens for user ${userId}`);
    return { success: true, reason: 'No tokens' };
  }

  const tokens = fcmTokens.map((t) => t.token);
  const result = await FCMClient.sendMultiplePush(tokens, title, body, data);

  console.log(`[NOTIFICATION JOB] Sent to user ${userId}: ${result.success} success, ${result.failed} failed`);

  return result;
}

const worker = new Worker(
  'notifications',
  async (job) => {
    console.log(`[NOTIFICATION WORKER] Processing: ${job.id}`);
    return processNotification(job as any);
  },
  {
    connection: redis,
    concurrency: 3,
  },
);

worker.on('completed', (job) => {
  console.log(`[NOTIFICATION WORKER] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[NOTIFICATION WORKER] Job ${job?.id} failed:`, err.message);
});

worker.on('ready', () => {
  console.log('[NOTIFICATION WORKER] Ready');
});

process.on('SIGTERM', async () => {
  console.log('[NOTIFICATION WORKER] Shutting down...');
  await worker.close();
  process.exit(0);
});

export { worker as notificationWorker };
