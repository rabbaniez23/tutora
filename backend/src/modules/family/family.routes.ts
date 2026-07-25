import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import {
  addChildHandler,
  getChildrenHandler,
  getChildDetailHandler,
  topupChildHandler,
  getChildOrdersHandler,
} from './family.controller';

export async function familyRoutes(app: FastifyInstance) {
  app.post('/parent/children', {
    schema: {
      tags: ['Family'],
      summary: 'Add a child (parent only)',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['childName', 'childGrade'],
        properties: {
          childName: { type: 'string', minLength: 2 },
          childGrade: { type: 'string' },
        },
      },
      response: { 201: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('PARENT')],
    handler: addChildHandler,
  });

  app.get('/parent/children', {
    schema: {
      tags: ['Family'],
      summary: 'Get all children (parent only)',
      security: [{ bearerAuth: [] }],
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('PARENT')],
    handler: getChildrenHandler,
  });

  app.get('/parent/children/:childId', {
    schema: {
      tags: ['Family'],
      summary: 'Get child detail (parent only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['childId'],
        properties: { childId: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('PARENT')],
    handler: getChildDetailHandler,
  });

  app.post('/parent/children/:childId/topup', {
    schema: {
      tags: ['Family'],
      summary: 'Topup child balance (parent only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['childId'],
        properties: { childId: { type: 'string', format: 'uuid' } },
      },
      body: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'integer', minimum: 10000 },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('PARENT')],
    handler: topupChildHandler,
  });

  app.get('/parent/children/:childId/orders', {
    schema: {
      tags: ['Family'],
      summary: 'Get child order history (parent only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['childId'],
        properties: { childId: { type: 'string', format: 'uuid' } },
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('PARENT')],
    handler: getChildOrdersHandler,
  });
}
