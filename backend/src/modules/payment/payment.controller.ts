import type { FastifyRequest, FastifyReply } from 'fastify';
import * as paymentService from './payment.service';

export async function createTopupHandler(
  request: FastifyRequest<{ Body: { amount: number } }>,
  reply: FastifyReply,
) {
  const result = await paymentService.createTopup(request.user.id, request.body.amount);
  return reply.status(201).send({
    message: 'Topup created successfully',
    data: result,
  });
}

export async function midtransWebhookHandler(
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply,
) {
  const result = await paymentService.handleMidtransWebhook(
    request.body as any,
  );
  return reply.send(result);
}

export async function requestWithdrawHandler(
  request: FastifyRequest<{
    Body: {
      amount: number;
      bankCode: string;
      accountNumber: string;
      accountName: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { amount, bankCode, accountNumber, accountName } = request.body;
  const result = await paymentService.requestWithdraw(
    request.user.id,
    amount,
    bankCode,
    accountNumber,
    accountName,
  );
  return reply.status(201).send({
    message: 'Withdrawal request submitted',
    data: result,
  });
}

export async function xenditWebhookHandler(
  request: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply,
) {
  const result = await paymentService.handleXenditWebhook(
    request.body as any,
  );
  return reply.send(result);
}
