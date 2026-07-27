import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import {
  createTopupHandler,
  midtransWebhookHandler,
  requestWithdrawHandler,
  xenditWebhookHandler,
} from './payment.controller';

export async function paymentRoutes(app: FastifyInstance) {
  app.post('/payments/topup', {
    schema: {
      tags: ['Payments'],
      summary: 'Create topup via Midtrans',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'integer', minimum: 10000 },
        },
      },
      response: { 201: { type: 'object', additionalProperties: true } },
    },
    preHandler: [authenticate],
    handler: createTopupHandler,
  });

  app.post('/payments/withdraw', {
    schema: {
      tags: ['Payments'],
      summary: 'Request withdrawal via Xendit (teacher only)',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['amount', 'bankCode', 'accountNumber', 'accountName'],
        properties: {
          amount: { type: 'integer', minimum: 50000 },
          bankCode: { type: 'string', enum: ['BANK_BCA', 'BANK_BNI', 'BANK_MANDIRI', 'BANK_BRI', 'BANK_CIMB', 'BANK_PERMATA'] },
          accountNumber: { type: 'string' },
          accountName: { type: 'string' },
        },
      },
      response: { 201: { type: 'object', additionalProperties: true } },
    },
    preHandler: [authenticate, authorize('TEACHER')],
    handler: requestWithdrawHandler,
  });

  app.post('/webhooks/midtrans', {
    schema: {
      tags: ['Webhooks'],
      summary: 'Midtrans payment notification webhook',
      consumes: ['application/json'],
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    handler: midtransWebhookHandler,
  });

  app.post('/webhooks/xendit', {
    schema: {
      tags: ['Webhooks'],
      summary: 'Xendit disbursement webhook',
      consumes: ['application/json'],
      response: { 200: { type: 'object', additionalProperties: true } },
    },
    handler: xenditWebhookHandler,
  });
}
