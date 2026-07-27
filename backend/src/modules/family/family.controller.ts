import type { FastifyRequest, FastifyReply } from 'fastify';
import * as familyService from './family.service';

export async function addChildHandler(
  request: FastifyRequest<{
    Body: {
      childUserId?: string;
      childName?: string;
      childEmail?: string;
      childPhone?: string;
      childGrade: string;
    };
  }>,
  reply: FastifyReply,
) {
  const child = await familyService.addChild(request.user.id, request.body);
  return reply.status(201).send({
    message: 'Child added successfully',
    data: child,
  });
}

export async function getChildrenHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const children = await familyService.getChildren(request.user.id);
  return reply.send({
    message: 'Children retrieved successfully',
    data: children,
  });
}

export async function getChildDetailHandler(
  request: FastifyRequest<{ Params: { childId: string } }>,
  reply: FastifyReply,
) {
  const child = await familyService.getChildDetail(request.user.id, request.params.childId);
  return reply.send({
    message: 'Child detail retrieved successfully',
    data: child,
  });
}

export async function topupChildHandler(
  request: FastifyRequest<{
    Params: { childId: string };
    Body: { amount: number };
  }>,
  reply: FastifyReply,
) {
  const result = await familyService.topupChild(
    request.user.id,
    request.params.childId,
    request.body.amount,
  );
  return reply.send({
    message: result.message,
    data: { amount: result.amount },
  });
}

export async function getChildOrdersHandler(
  request: FastifyRequest<{
    Params: { childId: string };
    Querystring: { page?: number; limit?: number };
  }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await familyService.getChildOrders(
    request.user.id,
    request.params.childId,
    page,
    limit,
  );
  return reply.send({
    message: 'Child orders retrieved successfully',
    ...result,
  });
}
