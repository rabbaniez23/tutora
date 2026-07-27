import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import {
  getNotificationsHandler,
  markAsReadHandler,
  registerDeviceHandler,
} from './notification.controller';

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/notifications', {
    schema: {
      tags: ['Notifications'],
      summary: 'Get notifications (paginated)',
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
    handler: getNotificationsHandler,
  });

  app.patch('/notifications/:id/read', {
    schema: {
      tags: ['Notifications'],
      summary: 'Mark notification as read',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [authenticate],
    handler: markAsReadHandler,
  });

  app.post('/notifications/register-device', {
    schema: {
      tags: ['Notifications'],
      summary: 'Register FCM device token',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string' },
          deviceInfo: { type: 'string' },
        },
      },
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    preHandler: [authenticate],
    handler: registerDeviceHandler,
  });
}
