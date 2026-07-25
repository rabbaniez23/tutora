import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import {
  getChatRoomsHandler,
  getMessagesHandler,
  sendMessageHandler,
  markAsReadHandler,
} from './chat.controller';

export async function chatRoutes(app: FastifyInstance) {
  app.get('/chats', {
    schema: {
      tags: ['Chat'],
      summary: 'Get chat rooms with last message preview',
      security: [{ bearerAuth: [] }],
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: getChatRoomsHandler,
  });

  app.get('/chats/:roomId/messages', {
    schema: {
      tags: ['Chat'],
      summary: 'Get messages (cursor-based pagination)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['roomId'],
        properties: { roomId: { type: 'string', format: 'uuid' } },
      },
      querystring: {
        type: 'object',
        properties: {
          cursor: { type: 'string', format: 'date-time' },
          limit: { type: 'integer', default: 50, maximum: 100 },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: getMessagesHandler,
  });

  app.post('/chats/:roomId/messages', {
    schema: {
      tags: ['Chat'],
      summary: 'Send a message',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['roomId'],
        properties: { roomId: { type: 'string', format: 'uuid' } },
      },
      body: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', minLength: 1, maxLength: 2000 },
        },
      },
      response: { 201: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: sendMessageHandler,
  });

  app.patch('/chats/:roomId/read', {
    schema: {
      tags: ['Chat'],
      summary: 'Mark all messages as read',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['roomId'],
        properties: { roomId: { type: 'string', format: 'uuid' } },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: markAsReadHandler,
  });
}
