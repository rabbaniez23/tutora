import { prisma } from '@/config/database';
import { FCMClient } from './fcm.client';
import type { NotificationType } from '@prisma/client';

export async function send(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  // Save to database
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data: data || undefined,
    },
  });

  // Get user's FCM tokens
  const fcmTokens = await prisma.fcmToken.findMany({
    where: { userId },
    select: { token: true },
  });

  if (fcmTokens.length > 0) {
    // Send push notifications asynchronously
    const tokens = fcmTokens.map((t) => t.token);
    FCMClient.sendMultiplePush(tokens, title, body, data).catch((err) => {
      console.error(`[NOTIFICATION] Push failed for user ${userId}:`, err);
    });
  }

  return notification;
}

export async function getNotifications(userId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return {
    data: notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function markAsRead(notifId: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notifId } });

  if (!notification) {
    throw Object.assign(new Error('Notification not found'), { statusCode: 404 });
  }

  if (notification.userId !== userId) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  await prisma.notification.update({
    where: { id: notifId },
    data: { isRead: true },
  });

  return { message: 'Notification marked as read' };
}

export async function registerDevice(userId: string, token: string, deviceInfo?: string) {
  const existing = await prisma.fcmToken.findUnique({ where: { token } });

  if (existing) {
    // Update existing token
    await prisma.fcmToken.update({
      where: { id: existing.id },
      data: { deviceInfo, updatedAt: new Date() },
    });
  } else {
    await prisma.fcmToken.create({
      data: {
        userId,
        token,
        deviceInfo,
      },
    });
  }

  return { message: 'Device registered successfully' };
}

export async function unregisterDevice(token: string) {
  await prisma.fcmToken.deleteMany({ where: { token } });
  return { message: 'Device unregistered' };
}
