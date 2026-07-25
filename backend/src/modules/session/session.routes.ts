import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import {
  startSessionHandler,
  endSessionHandler,
  submitReportHandler,
  getReportHandler,
  submitReviewHandler,
  getTeacherReviewsHandler,
  triggerSosHandler,
} from './session.controller';

export async function sessionRoutes(app: FastifyInstance) {
  app.post('/sessions/:id/start', {
    schema: {
      tags: ['Sessions'],
      summary: 'Start a session (teacher only, requires geo-fence)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('TEACHER')],
    handler: startSessionHandler,
  });

  app.post('/sessions/:id/end', {
    schema: {
      tags: ['Sessions'],
      summary: 'End a session (teacher only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('TEACHER')],
    handler: endSessionHandler,
  });

  app.post('/sessions/:id/report', {
    schema: {
      tags: ['Sessions'],
      summary: 'Submit learning report (teacher only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      body: {
        type: 'object',
        required: ['summary', 'characters'],
        properties: {
          summary: { type: 'string' },
          characters: { type: 'array', items: { type: 'string' } },
          photoUrl: { type: 'string' },
        },
      },
      response: { 201: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('TEACHER')],
    handler: submitReportHandler,
  });

  app.get('/sessions/:id/report', {
    schema: {
      tags: ['Sessions'],
      summary: 'Get learning report',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: getReportHandler,
  });

  app.post('/sessions/:id/review', {
    schema: {
      tags: ['Sessions'],
      summary: 'Submit review (student/parent only)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      body: {
        type: 'object',
        required: ['rating', 'content', 'tags'],
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
      response: { 201: { type: 'object' } },
    },
    preHandler: [authenticate, authorize('STUDENT', 'PARENT')],
    handler: submitReviewHandler,
  });

  app.get('/teachers/:id/reviews', {
    schema: {
      tags: ['Teachers'],
      summary: 'Get teacher reviews (paginated)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
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
    preHandler: [authenticate],
    handler: getTeacherReviewsHandler,
  });

  app.post('/sos', {
    schema: {
      tags: ['Sessions'],
      summary: 'Trigger SOS alert during active session',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['sessionId', 'latitude', 'longitude'],
        properties: {
          sessionId: { type: 'string', format: 'uuid' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: triggerSosHandler,
  });
}
