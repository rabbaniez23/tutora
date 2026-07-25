import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import {
  getBalanceHandler,
  getTransactionsHandler,
} from './wallet.controller';

export async function walletRoutes(app: FastifyInstance) {
  app.get('/wallet/balance', {
    schema: {
      tags: ['Wallet'],
      summary: 'Get current wallet balance',
      security: [{ bearerAuth: [] }],
      response: { 200: { type: 'object' } },
    },
    preHandler: [authenticate],
    handler: getBalanceHandler,
  });

  app.get('/wallet/transactions', {
    schema: {
      tags: ['Wallet'],
      summary: 'Get transaction history',
      security: [{ bearerAuth: [] }],
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
    handler: getTransactionsHandler,
  });
}
