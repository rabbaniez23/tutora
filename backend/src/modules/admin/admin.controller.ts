import type { FastifyRequest, FastifyReply } from 'fastify';
import * as adminService from './admin.service';

export async function getDashboardHandler(request: FastifyRequest, reply: FastifyReply) {
  const dashboard = await adminService.getDashboard();
  return reply.send({ message: 'Dashboard retrieved successfully', data: dashboard });
}

export async function getPendingTeachersHandler(
  request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await adminService.getPendingTeachers(page, limit);
  return reply.send({ message: 'Pending teachers retrieved', ...result });
}

export async function getTeacherDocumentsHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const docs = await adminService.getTeacherDocuments(request.params.id);
  return reply.send({ message: 'Teacher documents retrieved', data: docs });
}

export async function approveTeacherHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const result = await adminService.approveTeacher(request.params.id);
  return reply.send({ message: 'Teacher approved successfully', data: result });
}

export async function rejectTeacherHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: { reason: string } }>,
  reply: FastifyReply,
) {
  const result = await adminService.rejectTeacher(request.params.id, request.body.reason);
  return reply.send({ message: 'Teacher rejected', data: result });
}

export async function getAllOrdersHandler(
  request: FastifyRequest<{
    Querystring: { page?: number; limit?: number; status?: string; search?: string; startDate?: string; endDate?: string };
  }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await adminService.getAllOrders(page, limit, {
    status: request.query.status,
    search: request.query.search,
    startDate: request.query.startDate,
    endDate: request.query.endDate,
  });
  return reply.send({ message: 'Orders retrieved successfully', ...result });
}

export async function getAllTransactionsHandler(
  request: FastifyRequest<{ Querystring: { page?: number; limit?: number; type?: string; status?: string } }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await adminService.getAllTransactions(page, limit, {
    type: request.query.type,
    status: request.query.status,
  });
  return reply.send({ message: 'Transactions retrieved successfully', ...result });
}

export async function createPromotionHandler(
  request: FastifyRequest<{ Body: any }>,
  reply: FastifyReply,
) {
  const promo = await adminService.createPromotion(request.body as any);
  return reply.status(201).send({ message: 'Promotion created successfully', data: promo });
}

export async function createVoucherHandler(
  request: FastifyRequest<{ Body: any }>,
  reply: FastifyReply,
) {
  const voucher = await adminService.createVoucher(request.body as any);
  return reply.status(201).send({ message: 'Voucher created successfully', data: voucher });
}

export async function getActivePromotionsHandler(request: FastifyRequest, reply: FastifyReply) {
  const promos = await adminService.getActivePromotions();
  return reply.send({ message: 'Active promotions retrieved', data: promos });
}

export async function validateVoucherHandler(
  request: FastifyRequest<{ Body: { code: string; orderAmount: number } }>,
  reply: FastifyReply,
) {
  const result = await adminService.validateVoucher(request.body.code, request.body.orderAmount);
  return reply.send({ message: 'Voucher is valid', data: result });
}
