import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { updateProfileSchema } from './user.schema';
import {
  getProfileHandler,
  updateProfileHandler,
} from './user.controller';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', {
    schema: {
      tags: ['Users'],
      summary: 'Get current user profile',
      security: [{ bearerAuth: [] }],
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: getProfileHandler,
  });

  app.patch('/users/me', {
    schema: {
      tags: ['Users'],
      summary: 'Update current user profile',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          avatarUrl: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [
      authenticate,
      async (req) => { updateProfileSchema.parse(req.body); },
    ],
    handler: updateProfileHandler,
  });
}
