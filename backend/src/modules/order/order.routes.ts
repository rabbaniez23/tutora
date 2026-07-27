import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import { createOrderSchema, cancelOrderSchema } from './order.schema';
import {
  createOrderHandler,
  getOrderHandler,
  getActiveOrderHandler,
  getOrderHistoryHandler,
  cancelOrderHandler,
  acceptOrderHandler,
  rejectOrderHandler,
} from './order.controller';

export async function orderRoutes(app: FastifyInstance) {
  app.post('/orders', {
    schema: {
      tags: ['Orders'],
      summary: 'Create a new order',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['subject', 'level', 'durationHours', 'sessionsTotal', 'latitude', 'longitude', 'addressText', 'scheduleType'],
        properties: {
          subject: { type: 'string' },
          level: { type: 'string', enum: ['SD', 'SMP', 'SMA'] },
          durationHours: { type: 'number' },
          sessionsTotal: { type: 'integer' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          addressText: { type: 'string' },
          scheduleType: { type: 'string', enum: ['NOW', 'SCHEDULED'] },
          scheduledAt: { type: 'string', format: 'date-time' },
          voucherCode: { type: 'string' },
          studentId: { type: 'string', format: 'uuid' },
        },
      },
      response: { 201: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      authorize('STUDENT', 'PARENT'),
      async (req) => { createOrderSchema.parse(req.body); },
    ],
    handler: createOrderHandler,
  });

  app.get('/orders/active', {
    schema: {
      tags: ['Orders'],
      summary: 'Get current active order',
      security: [{ bearerAuth: [] }],
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [authenticate],
    handler: getActiveOrderHandler,
  });

  app.get('/orders/history', {
    schema: {
      tags: ['Orders'],
      summary: 'Get order history',
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
    preHandler: [authenticate],
    handler: getOrderHistoryHandler,
  });

  app.get('/orders/:id', {
    schema: {
      tags: ['Orders'],
      summary: 'Get order detail',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [authenticate],
    handler: getOrderHandler,
  });

  app.patch('/orders/:id/cancel', {
    schema: {
      tags: ['Orders'],
      summary: 'Cancel an order',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        properties: {
          reason: { type: 'string' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      async (req) => { cancelOrderSchema.parse(req.body || {}); },
    ],
    handler: cancelOrderHandler,
  });

  app.post('/orders/:id/accept', {
    schema: {
      tags: ['Orders'],
      summary: 'Accept an order (teacher only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
    ],
    handler: acceptOrderHandler,
  });

  app.post('/orders/:id/reject', {
    schema: {
      tags: ['Orders'],
      summary: 'Reject an order (teacher only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
    ],
    handler: rejectOrderHandler,
  });
}
