import type { FastifyRequest, FastifyReply } from 'fastify';
import * as orderService from './order.service';
import type { CreateOrderInput, CancelOrderInput } from './order.schema';

export async function createOrderHandler(
  request: FastifyRequest<{ Body: CreateOrderInput }>,
  reply: FastifyReply,
) {
  const order = await orderService.createOrder(request.user.id, request.body);
  return reply.status(201).send({
    message: 'Order created successfully, searching for tutor...',
    data: order,
  });
}

export async function getOrderHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const order = await orderService.getOrder(request.params.id);
  return reply.send({
    message: 'Order retrieved successfully',
    data: order,
  });
}

export async function getActiveOrderHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const order = await orderService.getActiveOrder(request.user.id);

  if (!order) {
    return reply.send({ message: 'No active order', data: null });
  }

  return reply.send({
    message: 'Active order retrieved successfully',
    data: order,
  });
}

export async function getOrderHistoryHandler(
  request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await orderService.getOrderHistory(request.user.id, page, limit);
  return reply.send({
    message: 'Order history retrieved successfully',
    ...result,
  });
}

export async function cancelOrderHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: CancelOrderInput }>,
  reply: FastifyReply,
) {
  const result = await orderService.cancelOrder(request.user.id, request.params.id);
  return reply.send({
    message: 'Order cancelled and refunded successfully',
    data: result,
  });
}

export async function acceptOrderHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const order = await orderService.acceptOrder(request.user.id, request.params.id);
  return reply.send({
    message: 'Order accepted successfully',
    data: order,
  });
}

export async function rejectOrderHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await orderService.rejectOrder(request.user.id, request.params.id);
  return reply.send({
    message: 'Order rejected, forwarded to next tutor',
    data: result,
  });
}
