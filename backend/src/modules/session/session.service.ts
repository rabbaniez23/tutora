import { prisma } from '@/config/database';
import { haversineDistance } from '@/shared/utils/geo';
import { GEOFENCE_RADIUS_METERS } from '@/config/constants';

export async function startSession(teacherId: string, sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { order: true },
  });

  if (!session) {
    throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  }

  if (session.order.teacherId !== teacherId) {
    throw Object.assign(new Error('Not authorized for this session'), { statusCode: 403 });
  }

  if (session.startedAt) {
    throw Object.assign(new Error('Session already started'), { statusCode: 400 });
  }

  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    select: { latitude: true, longitude: true },
  });

  if (!teacherProfile?.latitude || !teacherProfile?.longitude) {
    throw Object.assign(new Error('Teacher location not available'), { statusCode: 400 });
  }

  const distance = haversineDistance(
    teacherProfile.latitude,
    teacherProfile.longitude,
    session.order.latitude,
    session.order.longitude,
  );

  const geoConfirmed = distance <= GEOFENCE_RADIUS_METERS;

  if (!geoConfirmed) {
    throw Object.assign(
      new Error(`Too far from student location (${Math.round(distance)}m). Must be within ${GEOFENCE_RADIUS_METERS}m`),
      { statusCode: 400 },
    );
  }

  const [updatedSession] = await prisma.$transaction([
    prisma.session.update({
      where: { id: sessionId },
      data: {
        startedAt: new Date(),
        geoConfirmed: true,
        geoDistanceM: distance,
      },
    }),
    prisma.order.update({
      where: { id: session.orderId },
      data: { status: 'ACTIVE' },
    }),
  ]);

  // Send notifications
  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { name: true },
  });
  const teacherName = teacher?.name || 'Tutor';

  const { send: sendNotification } = await import('@/modules/notification/notification.service');
  // Notify Student
  sendNotification(
    session.order.studentId,
    'SESSION_STARTED',
    'Sesi Belajar Dimulai',
    `Sesi belajar Anda (${session.order.subject}) dengan tutor ${teacherName} telah dimulai.`,
    { sessionId, orderId: session.orderId },
  ).catch((err) => console.error('[NOTIFICATION] Failed to notify student:', err));

  // Notify Parent if different
  if (session.order.orderedById !== session.order.studentId) {
    sendNotification(
      session.order.orderedById,
      'SESSION_STARTED',
      'Sesi Belajar Anak Dimulai',
      `Sesi belajar anak Anda (${session.order.subject}) dengan tutor ${teacherName} telah dimulai.`,
      { sessionId, orderId: session.orderId },
    ).catch((err) => console.error('[NOTIFICATION] Failed to notify parent:', err));
  }

  return updatedSession;
}

export async function endSession(teacherId: string, sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { order: true },
  });

  if (!session) {
    throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  }

  if (session.order.teacherId !== teacherId) {
    throw Object.assign(new Error('Not authorized for this session'), { statusCode: 403 });
  }

  if (!session.startedAt) {
    throw Object.assign(new Error('Session has not been started'), { statusCode: 400 });
  }

  if (session.endedAt) {
    throw Object.assign(new Error('Session already ended'), { statusCode: 400 });
  }

  const [updatedSession] = await prisma.$transaction([
    prisma.session.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    }),
    prisma.order.update({
      where: { id: session.orderId },
      data: { status: 'DONE' },
    }),
  ]);

  // Send notifications
  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { name: true },
  });
  const teacherName = teacher?.name || 'Tutor';

  const { send: sendNotification } = await import('@/modules/notification/notification.service');
  // Notify Student
  sendNotification(
    session.order.studentId,
    'SESSION_ENDED',
    'Sesi Belajar Selesai',
    `Sesi belajar Anda (${session.order.subject}) dengan tutor ${teacherName} telah selesai.`,
    { sessionId, orderId: session.orderId },
  ).catch((err) => console.error('[NOTIFICATION] Failed to notify student:', err));

  // Notify Parent if different
  if (session.order.orderedById !== session.order.studentId) {
    sendNotification(
      session.order.orderedById,
      'SESSION_ENDED',
      'Sesi Belajar Anak Selesai',
      `Sesi belajar anak Anda (${session.order.subject}) dengan tutor ${teacherName} telah selesai.`,
      { sessionId, orderId: session.orderId },
    ).catch((err) => console.error('[NOTIFICATION] Failed to notify parent:', err));
  }

  return updatedSession;
}

export async function submitReport(
  teacherId: string,
  sessionId: string,
  data: { summary: string; characters: string[]; photoUrl?: string },
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { order: true },
  });

  if (!session) {
    throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  }

  if (session.order.teacherId !== teacherId) {
    throw Object.assign(new Error('Not authorized for this session'), { statusCode: 403 });
  }

  if (!session.endedAt) {
    throw Object.assign(new Error('Session must be ended before submitting report'), { statusCode: 400 });
  }

  const existingReport = await prisma.learningReport.findFirst({
    where: { sessionId },
  });

  if (existingReport) {
    throw Object.assign(new Error('Report already submitted for this session'), { statusCode: 400 });
  }

  const report = await prisma.learningReport.create({
    data: {
      sessionId,
      teacherId,
      studentId: session.order.studentId,
      summary: data.summary,
      characters: data.characters,
      photoUrl: data.photoUrl,
      submittedAt: new Date(),
    },
  });

  // Trigger escrow release
  await releaseFunds(session.orderId, session.order.finalPrice, teacherId);

  // Send notifications
  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    select: { name: true },
  });
  const teacherName = teacher?.name || 'Tutor';

  const { send: sendNotification } = await import('@/modules/notification/notification.service');
  // Notify Student
  sendNotification(
    session.order.studentId,
    'REPORT_SUBMITTED',
    'Laporan Belajar Baru',
    `Tutor ${teacherName} telah mengirimkan laporan belajar untuk sesi ${session.order.subject}.`,
    { sessionId, orderId: session.orderId },
  ).catch((err) => console.error('[NOTIFICATION] Failed to notify student:', err));

  // Notify Parent if different
  if (session.order.orderedById !== session.order.studentId) {
    sendNotification(
      session.order.orderedById,
      'REPORT_SUBMITTED',
      'Laporan Belajar Anak',
      `Tutor ${teacherName} telah mengirimkan laporan belajar anak Anda untuk sesi ${session.order.subject}.`,
      { sessionId, orderId: session.orderId },
    ).catch((err) => console.error('[NOTIFICATION] Failed to notify parent:', err));
  }

  return report;
}

export async function getReport(sessionId: string) {
  const report = await prisma.learningReport.findFirst({
    where: { sessionId },
    include: {
      teacher: {
        select: {
          id: true,
          user: { select: { name: true, avatarUrl: true } },
        },
      },
    },
  });

  if (!report) {
    throw Object.assign(new Error('Report not found'), { statusCode: 404 });
  }

  return report;
}

async function releaseFunds(orderId: string, finalPrice: bigint, teacherId: string) {
  const teacherWallet = await prisma.wallet.findUnique({ where: { userId: teacherId } });

  if (!teacherWallet) {
    throw Object.assign(new Error('Teacher wallet not found'), { statusCode: 404 });
  }

  const { calculateCommission } = await import('@/shared/utils/pricing');
  const { teacherPayout, platformFee } = calculateCommission(Number(finalPrice));

  // Find the HOLD transaction for this order
  const holdTransaction = await prisma.transaction.findFirst({
    where: {
      orderId,
      type: 'HOLD',
      status: 'SUCCESS',
    },
  });

  if (!holdTransaction) {
    throw Object.assign(new Error('Hold transaction not found'), { statusCode: 404 });
  }

  // Find student wallet from the HOLD transaction
  const studentWallet = await prisma.wallet.findUnique({
    where: { userId: holdTransaction.userId },
  });

  if (!studentWallet) {
    throw Object.assign(new Error('Student wallet not found'), { statusCode: 404 });
  }

  await prisma.$transaction([
    // Release from student's HOLD (debit student wallet)
    prisma.wallet.update({
      where: { id: studentWallet.id },
      data: { balance: { decrement: finalPrice } },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId: holdTransaction.userId,
        walletId: studentWallet.id,
        type: 'RELEASE',
        amount: finalPrice,
        status: 'SUCCESS',
        description: 'Escrow released for completed session',
      },
    }),
    // Credit teacher wallet (payout)
    prisma.wallet.update({
      where: { id: teacherWallet.id },
      data: { balance: { increment: BigInt(teacherPayout) } },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId: teacherId,
        walletId: teacherWallet.id,
        type: 'DISBURSEMENT',
        amount: BigInt(teacherPayout),
        status: 'SUCCESS',
        description: 'Payment for completed session',
      },
    }),
    // Platform fee
    prisma.transaction.create({
      data: {
        orderId,
        userId: teacherId,
        walletId: teacherWallet.id,
        type: 'PLATFORM_FEE',
        amount: BigInt(platformFee),
        status: 'SUCCESS',
        description: 'Platform commission (15%)',
      },
    }),
  ]);
}

export async function submitReview(
  reviewerId: string,
  sessionId: string,
  data: { rating: number; content: string; tags: string[] },
) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { order: true },
  });

  if (!session) {
    throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  }

  if (session.order.studentId !== reviewerId && session.order.orderedById !== reviewerId) {
    throw Object.assign(new Error('Not authorized to review this session'), { statusCode: 403 });
  }

  if (!session.endedAt) {
    throw Object.assign(new Error('Session must be ended before reviewing'), { statusCode: 400 });
  }

  const existingReview = await prisma.review.findFirst({
    where: { sessionId, reviewerId },
  });

  if (existingReview) {
    throw Object.assign(new Error('You have already reviewed this session'), { statusCode: 400 });
  }

  const review = await prisma.review.create({
    data: {
      orderId: session.orderId,
      sessionId,
      reviewerId,
      teacherId: session.order.teacherId!,
      rating: data.rating,
      content: data.content,
      tags: data.tags,
    },
  });

  // Update teacher's average rating (running average)
  const teacherId = session.order.teacherId!;
  const stats = await prisma.review.aggregate({
    where: { teacherId },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.id,
    },
  });

  return review;
}

export async function getTeacherReviews(teacherId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { teacherId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.review.count({ where: { teacherId } }),
  ]);

  return {
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
