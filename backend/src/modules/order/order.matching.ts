import { prisma } from '@/config/database';
import { redis } from '@/config/redis';
import { ORDER_TIMEOUT_SECONDS } from '@/config/constants';
import { orderQueue } from '@/jobs/queue';
import { Prisma } from '@prisma/client';

export async function findAndNotifyTutor(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { student: true },
  });

  if (!order || order.status !== 'SEARCHING') {
    return { success: false, reason: 'Order not in SEARCHING status' };
  }

  const availableTutors = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      avatarUrl: string | null;
      subjects: string[];
      average_rating: number;
      total_sessions: number;
      latitude: number;
      longitude: number;
      distance_m: number;
    }>
  >`
    SELECT
      u.id,
      u.name,
      u."avatarUrl",
      tp.subjects,
      tp.average_rating,
      tp.total_sessions,
      tp.latitude,
      tp.longitude,
      (
        6371000 * acos(
          GREATEST(-1, LEAST(1,
            cos(radians(${order.latitude}::float)) * cos(radians(tp.latitude)) *
            cos(radians(tp.longitude) - radians(${order.longitude}::float)) +
            sin(radians(${order.latitude}::float)) * sin(radians(tp.latitude))
          ))
        )
      ) AS distance_m
    FROM users u
    INNER JOIN teacher_profiles tp ON tp.id = u.id
    INNER JOIN teacher_availability ta ON ta.teacher_id = u.id
    WHERE u.deleted_at IS NULL
      AND tp.onboard_status = 'APPROVED'
      AND tp.kyc_status = 'VERIFIED'
      AND ta.is_online = true
      AND ${order.subject} = ANY(tp.subjects)
      AND tp.latitude IS NOT NULL
      AND tp.longitude IS NOT NULL
      AND (
        6371000 * acos(
          GREATEST(-1, LEAST(1,
            cos(radians(${order.latitude}::float)) * cos(radians(tp.latitude)) *
            cos(radians(tp.longitude) - radians(${order.longitude}::float)) +
            sin(radians(${order.latitude}::float)) * sin(radians(tp.latitude))
          ))
        )
      ) <= 5000::float
    ORDER BY distance_m ASC, tp.average_rating DESC
    LIMIT 5
  `;

  if (availableTutors.length === 0) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    // Refund held amount
    const wallet = await prisma.wallet.findUnique({
      where: { userId: order.orderedById },
    });

    if (wallet) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: order.finalPrice } },
        }),
        prisma.transaction.create({
          data: {
            orderId,
            userId: order.orderedById,
            walletId: wallet.id,
            type: 'REFUND',
            amount: order.finalPrice,
            status: 'SUCCESS',
            description: 'Refund: no tutor found',
          },
        }),
      ]);
    }

    // TODO: Notify student via Socket.IO / FCM
    console.log(`[MATCHING] No tutor found for order ${orderId}`);

    return { success: false, reason: 'No available tutors found' };
  }

  const topTutor = availableTutors[0];

  // Store matching info in Redis for timeout handling
  await redis.setex(
    `order:${orderId}:matched_tutor`,
    ORDER_TIMEOUT_SECONDS + 5,
    JSON.stringify({
      tutorId: topTutor.id,
      tutorName: topTutor.name,
      distance: topTutor.distance_m,
    }),
  );

  // Add timeout job
  await orderQueue.add(
    'order-timeout',
    { orderId, tutorId: topTutor.id },
    {
      delay: ORDER_TIMEOUT_SECONDS * 1000,
      jobId: `timeout:${orderId}:${topTutor.id}`,
      removeOnComplete: true,
      removeOnFail: true,
    },
  );

  // TODO: Emit Socket.IO event to tutor
  console.log(`[MATCHING] Order ${orderId} sent to tutor ${topTutor.name} (${topTutor.id})`);

  return {
    success: true,
    tutor: {
      id: topTutor.id,
      name: topTutor.name,
      distance: Math.round(topTutor.distance_m),
    },
  };
}

export async function notifyNextTutor(orderId: string, excludeTutorIds: string[]) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.status !== 'SEARCHING') {
    return { success: false, reason: 'Order not in SEARCHING status' };
  }

  const excludeCondition = excludeTutorIds.length > 0
    ? Prisma.sql`AND u.id::text NOT IN (${Prisma.join(excludeTutorIds)})`
    : Prisma.empty;

  const availableTutors = await prisma.$queryRaw<
    Array<{
      id: string;
      name: string;
      distance_m: number;
    }>
  >`
    SELECT
      u.id,
      u.name,
      (
        6371000 * acos(
          GREATEST(-1, LEAST(1,
            cos(radians(${order.latitude}::float)) * cos(radians(tp.latitude)) *
            cos(radians(tp.longitude) - radians(${order.longitude}::float)) +
            sin(radians(${order.latitude}::float)) * sin(radians(tp.latitude))
          ))
        )
      ) AS distance_m
    FROM users u
    INNER JOIN teacher_profiles tp ON tp.id = u.id
    INNER JOIN teacher_availability ta ON ta.teacher_id = u.id
    WHERE u.deleted_at IS NULL
      AND tp.onboard_status = 'APPROVED'
      AND tp.kyc_status = 'VERIFIED'
      AND ta.is_online = true
      AND ${order.subject} = ANY(tp.subjects)
      AND tp.latitude IS NOT NULL
      AND tp.longitude IS NOT NULL
      ${excludeCondition}
      AND (
        6371000 * acos(
          GREATEST(-1, LEAST(1,
            cos(radians(${order.latitude}::float)) * cos(radians(tp.latitude)) *
            cos(radians(tp.longitude) - radians(${order.longitude}::float)) +
            sin(radians(${order.latitude}::float)) * sin(radians(tp.latitude))
          ))
        )
      ) <= 5000::float
    ORDER BY distance_m ASC, tp.average_rating DESC
    LIMIT 1
  `;

  if (availableTutors.length === 0) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: order.orderedById },
    });

    if (wallet) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: order.finalPrice } },
        }),
        prisma.transaction.create({
          data: {
            orderId,
            userId: order.orderedById,
            walletId: wallet.id,
            type: 'REFUND',
            amount: order.finalPrice,
            status: 'SUCCESS',
            description: 'Refund: no tutor found',
          },
        }),
      ]);
    }

    return { success: false, reason: 'No more available tutors' };
  }

  const nextTutor = availableTutors[0];

  await redis.setex(
    `order:${orderId}:matched_tutor`,
    ORDER_TIMEOUT_SECONDS + 5,
    JSON.stringify({
      tutorId: nextTutor.id,
      tutorName: nextTutor.name,
      distance: nextTutor.distance_m,
    }),
  );

  await orderQueue.add(
    'order-timeout',
    { orderId, tutorId: nextTutor.id },
    {
      delay: ORDER_TIMEOUT_SECONDS * 1000,
      jobId: `timeout:${orderId}:${nextTutor.id}`,
      removeOnComplete: true,
      removeOnFail: true,
    },
  );

  console.log(`[MATCHING] Order ${orderId} forwarded to tutor ${nextTutor.name}`);

  return { success: true, tutor: { id: nextTutor.id, name: nextTutor.name } };
}
