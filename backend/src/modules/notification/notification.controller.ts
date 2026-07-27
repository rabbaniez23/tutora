import type { FastifyRequest, FastifyReply } from 'fastify';
import * as notificationService from './notification.service';

export async function getNotificationsHandler(
  request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await notificationService.getNotifications(request.user.id, page, limit);
  return reply.send({
    message: 'Notifications retrieved successfully',
    ...result,
  });
}

export async function markAsReadHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await notificationService.markAsRead(request.params.id, request.user.id);
  return reply.send(result);
}

export async function registerDeviceHandler(
  request: FastifyRequest<{ Body: { token: string; deviceInfo?: string } }>,
  reply: FastifyReply,
) {
  const result = await notificationService.registerDevice(
    request.user.id,
    request.body.token,
    request.body.deviceInfo,
  );
  return reply.send(result);
}
