import type { FastifyRequest, FastifyReply } from 'fastify';
import * as sessionService from './session.service';

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
