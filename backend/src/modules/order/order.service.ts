import { prisma } from '@/config/database';
import type { CreateOrderInput } from './order.schema';
import { calculatePrice, applyVoucher, applyFlashDeal } from '@/shared/utils/pricing';
import { findAndNotifyTutor } from './order.matching';

export async function createOrder(userId: string, data: CreateOrderInput) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  const { basePrice } = calculatePrice(data.level, data.durationHours, data.sessionsTotal);

  let finalPrice = basePrice;
  let discountAmount = 0;
  let voucherCode: string | null = null;

  if (data.voucherCode) {
    const voucherResult = await applyVoucher(basePrice, data.voucherCode);
    discountAmount = voucherResult.discountAmount;
    finalPrice = voucherResult.finalPrice;
    voucherCode = voucherResult.voucherCode;
  }

  // Flash deal check
  const scheduledDate = data.scheduledAt ? new Date(data.scheduledAt) : null;
  const flashResult = applyFlashDeal(finalPrice, scheduledDate);

  if (flashResult.isFlashDeal) {
    discountAmount += flashResult.discount;
    finalPrice = flashResult.finalPrice;
  }

  if (wallet.balance < BigInt(finalPrice)) {
    throw Object.assign(
      new Error(`Insufficient balance. Need Rp${finalPrice.toLocaleString()}, have Rp${Number(wallet.balance).toLocaleString()}`),
      { statusCode: 400 },
    );
  }

  // Hold funds: debit wallet, create HOLD transaction
  const [order] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: BigInt(finalPrice) } },
    }),
    prisma.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: 'HOLD',
        amount: BigInt(finalPrice),
        status: 'SUCCESS',
        description: `Hold for order: ${data.subject} (${data.level})`,
      },
    }),
    prisma.order.create({
      data: {
        studentId: data.studentId || userId,
        orderedById: userId,
        subject: data.subject,
        level: data.level,
        durationHours: data.durationHours,
        sessionsTotal: data.sessionsTotal,
        status: 'SEARCHING',
        latitude: data.latitude,
        longitude: data.longitude,
        addressText: data.addressText,
        scheduleType: data.scheduleType,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        basePrice: BigInt(basePrice),
        discountAmount: BigInt(discountAmount),
        finalPrice: BigInt(finalPrice),
        voucherCode,
      },
    }),
  ]);

  // Link HOLD transaction to order
  await prisma.transaction.updateMany({
    where: {
      walletId: wallet.id,
      type: 'HOLD',
      orderId: null,
    },
    data: { orderId: order.id },
  });

  // Trigger matching asynchronously
  findAndNotifyTutor(order.id).catch((err) => {
    console.error(`[MATCHING] Error for order ${order.id}:`, err);
  });

  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  }

  if (order.orderedById !== userId) {
    throw Object.assign(new Error('Not authorized to cancel this order'), { statusCode: 403 });
  }

  if (!['SEARCHING', 'MATCHED', 'ON_THE_WAY'].includes(order.status)) {
    throw Object.assign(new Error(`Cannot cancel order in ${order.status} status`), { statusCode: 400 });
  }

  // Refund held amount
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: order.finalPrice } },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId,
        walletId: wallet.id,
        type: 'REFUND',
        amount: order.finalPrice,
        status: 'SUCCESS',
        description: 'Refund: order cancelled',
      },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    }),
  ]);

  return { message: 'Order cancelled and refunded' };
}

export async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatarUrl: true,
        },
      },
      orderedBy: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      teacher: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatarUrl: true,
        },
      },
      sessions: true,
      reviews: true,
    },
  });

  if (!order) {
    throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  }

  return order;
}

export async function getActiveOrder(userId: string) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderedById: userId },
        { studentId: userId },
        { teacherId: userId },
      ],
      status: {
        notIn: ['DONE', 'CANCELLED'],
      },
    },
    include: {
      student: {
        select: { id: true, name: true, phone: true, avatarUrl: true },
      },
      teacher: {
        select: { id: true, name: true, phone: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return order || null;
}

export async function getOrderHistory(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        OR: [
          { orderedById: userId },
          { studentId: userId },
          { teacherId: userId },
        ],
      },
      include: {
        teacher: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.order.count({
      where: {
        OR: [
          { orderedById: userId },
          { studentId: userId },
          { teacherId: userId },
        ],
      },
    }),
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function acceptOrder(teacherId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  }

  if (order.status !== 'SEARCHING') {
    throw Object.assign(new Error('Order is not available for acceptance'), { statusCode: 400 });
  }

  // Verify this tutor was the one notified
  const { redis } = await import('@/config/redis');
  const matchedData = await redis.get(`order:${orderId}:matched_tutor`);

  if (!matchedData) {
    throw Object.assign(new Error('No matching data found or timeout expired'), { statusCode: 400 });
  }

  const matched = JSON.parse(matchedData);

  if (matched.tutorId !== teacherId) {
    throw Object.assign(new Error('This order was not assigned to you'), { statusCode: 403 });
  }

  // Cancel timeout job
  const { orderQueue } = await import('@/jobs/queue');
  const jobIds = await orderQueue.getJobIds('delayed', 0, 100);
  for (const jobId of jobIds) {
    if (jobId.includes(orderId)) {
      const job = await orderQueue.getJob(jobId);
      if (job) {
        await job.remove();
      }
    }
  }

  // Update order and create session
  const [updatedOrder] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        teacherId,
        status: 'MATCHED',
      },
    }),
    prisma.session.create({
      data: {
        orderId,
        startedAt: new Date(),
      },
    }),
  ]);

  // TODO: Notify student via Socket.IO / FCM
  console.log(`[ORDER] Tutor ${teacherId} accepted order ${orderId}`);

  return updatedOrder;
}

export async function rejectOrder(teacherId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  }

  if (order.status !== 'SEARCHING') {
    throw Object.assign(new Error('Order is not available for rejection'), { statusCode: 400 });
  }

  // Cancel timeout job for this tutor
  const { orderQueue } = await import('@/jobs/queue');
  const jobIds = await orderQueue.getJobIds('delayed', 0, 100);
  for (const jobId of jobIds) {
    if (jobId.includes(orderId)) {
      const job = await orderQueue.getJob(jobId);
      if (job) {
        await job.remove();
      }
    }
  }

  // Find next tutor
  const { notifyNextTutor } = await import('./order.matching');
  await notifyNextTutor(orderId, [teacherId]);

  console.log(`[ORDER] Tutor ${teacherId} rejected order ${orderId}, forwarding to next tutor`);

  return { message: 'Order forwarded to next tutor' };
}
