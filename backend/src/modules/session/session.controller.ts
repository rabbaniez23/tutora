import type { FastifyRequest, FastifyReply } from 'fastify';
import * as sessionService from './session.service';
import { prisma } from '@/config/database';
import { emitToUser } from '@/shared/plugins/socket.plugin';

export async function startSessionHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const session = await sessionService.startSession(request.user.id, request.params.id);
  return reply.send({
    message: 'Session started successfully',
    data: session,
  });
}

export async function endSessionHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const session = await sessionService.endSession(request.user.id, request.params.id);
  return reply.send({
    message: 'Session ended successfully',
    data: session,
  });
}

export async function submitReportHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { summary: string; characters: string[]; photoUrl?: string };
  }>,
  reply: FastifyReply,
) {
  const report = await sessionService.submitReport(request.user.id, request.params.id, request.body);
  return reply.status(201).send({
    message: 'Report submitted successfully',
    data: report,
  });
}

export async function getReportHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const report = await sessionService.getReport(request.params.id);
  return reply.send({
    message: 'Report retrieved successfully',
    data: report,
  });
}

export async function submitReviewHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { rating: number; content: string; tags: string[] };
  }>,
  reply: FastifyReply,
) {
  const review = await sessionService.submitReview(request.user.id, request.params.id, request.body);
  return reply.status(201).send({
    message: 'Review submitted successfully',
    data: review,
  });
}

export async function getTeacherReviewsHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Querystring: { page?: number; limit?: number };
  }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await sessionService.getTeacherReviews(request.params.id, page, limit);
  return reply.send({
    message: 'Reviews retrieved successfully',
    ...result,
  });
}

export async function triggerSosHandler(
  request: FastifyRequest<{
    Body: { sessionId: string; latitude: number; longitude: number };
  }>,
  reply: FastifyReply,
) {
  const { sessionId, latitude, longitude } = request.body;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { order: true },
  });

  if (!session) {
    throw Object.assign(new Error('Session not found'), { statusCode: 404 });
  }

  if (session.order.studentId !== request.user.id && session.order.orderedById !== request.user.id) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  // Save SOS alert
  const sosAlert = await prisma.sosAlert.create({
    data: {
      sessionId,
      triggeredBy: request.user.id,
      latitude,
      longitude,
    },
  });

  // Notify parent
  const orderedByUser = await prisma.user.findUnique({
    where: { id: session.order.orderedById },
    select: { id: true, role: true },
  });

  if (orderedByUser?.role === 'PARENT') {
    emitToUser(orderedByUser.id, 'sos_alert', {
      sessionId,
      teacherId: session.order.teacherId,
      latitude,
      longitude,
    });
  }

  // Notify admin
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  for (const admin of admins) {
    emitToUser(admin.id, 'sos_alert', {
      sessionId,
      triggeredBy: request.user.id,
      latitude,
      longitude,
    });
  }

  return {
    message: 'SOS alert sent successfully',
    data: sosAlert,
  };
}
