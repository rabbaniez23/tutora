import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import {
  listTeachersSchema,
  toggleStatusSchema,
  updateLocationSchema,
} from './teacher.schema';
import {
  listTeachersHandler,
  getTeacherDetailHandler,
  toggleOnlineHandler,
  updateLocationHandler,
} from './teacher.controller';

export async function teacherRoutes(app: FastifyInstance) {
  app.get('/teachers', {
    schema: {
      tags: ['Teachers'],
      summary: 'List nearby teachers with filters',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          subject: { type: 'string' },
          level: { type: 'string', enum: ['SD', 'SMP', 'SMA'] },
          lat: { type: 'number' },
          lng: { type: 'number' },
          radius: { type: 'number', default: 5000 },
          minRating: { type: 'number', minimum: 0, maximum: 5 },
          sort: { type: 'string', enum: ['distance', 'rating', 'sessions'], default: 'distance' },
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20, maximum: 50 },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      async (req) => { listTeachersSchema.parse(req.query); },
    ],
    handler: listTeachersHandler,
  });

  app.get('/teachers/:id', {
    schema: {
      tags: ['Teachers'],
      summary: 'Get teacher detail with reviews',
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
    handler: getTeacherDetailHandler,
  });

  app.patch('/teachers/me/status', {
    schema: {
      tags: ['Teachers'],
      summary: 'Toggle online/offline status',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['isOnline'],
        properties: {
          isOnline: { type: 'boolean' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
      async (req) => { toggleStatusSchema.parse(req.body); },
    ],
    handler: toggleOnlineHandler,
  });

  app.put('/teachers/me/location', {
    schema: {
      tags: ['Teachers'],
      summary: 'Update GPS location',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['latitude', 'longitude'],
        properties: {
          latitude: { type: 'number', minimum: -90, maximum: 90 },
          longitude: { type: 'number', minimum: -180, maximum: 180 },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
      async (req) => { updateLocationSchema.parse(req.body); },
    ],
    handler: updateLocationHandler,
  });
}
