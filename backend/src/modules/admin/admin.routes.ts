import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import {
  getDashboardHandler,
  getPendingTeachersHandler,
  getTeacherDocumentsHandler,
  approveTeacherHandler,
  rejectTeacherHandler,
  getAllOrdersHandler,
  getAllTransactionsHandler,
  createPromotionHandler,
  createVoucherHandler,
  getActivePromotionsHandler,
  validateVoucherHandler,
} from './admin.controller';

export async function adminRoutes(app: FastifyInstance) {
  const adminOnly = [authenticate, authorize('ADMIN')];

  app.get('/admin/dashboard', {
    schema: {
      tags: ['Admin'],
      summary: 'Get dashboard stats',
      security: [{ bearerAuth: [] }],
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: getDashboardHandler,
  });

  app.get('/admin/teachers/pending', {
    schema: {
      tags: ['Admin'],
      summary: 'List teachers pending review',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: getPendingTeachersHandler,
  });

  app.get('/admin/teachers/:id/documents', {
    schema: {
      tags: ['Admin'],
      summary: 'Get teacher documents for review',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: getTeacherDocumentsHandler,
  });

  app.patch('/admin/teachers/:id/approve', {
    schema: {
      tags: ['Admin'],
      summary: 'Approve teacher',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: approveTeacherHandler,
  });

  app.patch('/admin/teachers/:id/reject', {
    schema: {
      tags: ['Admin'],
      summary: 'Reject teacher with reason',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      body: {
        type: 'object',
        required: ['reason'],
        properties: { reason: { type: 'string' } },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: rejectTeacherHandler,
  });

  app.get('/admin/orders', {
    schema: {
      tags: ['Admin'],
      summary: 'Get all orders (filterable)',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
          status: { type: 'string' },
          search: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: getAllOrdersHandler,
  });

  app.get('/admin/transactions', {
    schema: {
      tags: ['Admin'],
      summary: 'Get all transactions',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
          type: { type: 'string' },
          status: { type: 'string' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: getAllTransactionsHandler,
  });

  app.post('/admin/promotions', {
    schema: {
      tags: ['Admin'],
      summary: 'Create promotion',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'discountType', 'discountValue', 'startDate', 'endDate'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          discountType: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
          discountValue: { type: 'number' },
          minOrderAmount: { type: 'integer' },
          maxDiscount: { type: 'integer' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
      response: { 201: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: createPromotionHandler,
  });

  app.post('/admin/vouchers', {
    schema: {
      tags: ['Admin'],
      summary: 'Create voucher codes',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['code', 'promotionId', 'expiresAt'],
        properties: {
          code: { type: 'string' },
          promotionId: { type: 'string', format: 'uuid' },
          maxUsage: { type: 'integer' },
          expiresAt: { type: 'string', format: 'date-time' },
        },
      },
      response: { 201: { type: 'object', additionalProperties: true } },
    },
    preHandler: adminOnly,
    handler: createVoucherHandler,
  });

  // Public routes
  app.get('/promotions', {
    schema: {
      tags: ['Promotions'],
      summary: 'Get active promotions',
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    handler: getActivePromotionsHandler,
  });

  app.post('/vouchers/validate', {
    schema: {
      tags: ['Vouchers'],
      summary: 'Validate voucher code',
      body: {
        type: 'object',
        required: ['code', 'orderAmount'],
        properties: {
          code: { type: 'string' },
          orderAmount: { type: 'integer' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    handler: validateVoucherHandler,
  });
}
