import type { FastifyRequest, FastifyReply } from 'fastify';
import * as walletService from './wallet.service';

export async function getBalanceHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const wallet = await walletService.getBalance(request.user.id);
  return reply.send({
    message: 'Balance retrieved successfully',
    data: {
      ...wallet,
      balance: Number(wallet.balance),
    },
  });
}

export async function getTransactionsHandler(
  request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>,
  reply: FastifyReply,
) {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 20;
  const result = await walletService.getTransactions(request.user.id, page, limit);
  return reply.send({
    message: 'Transactions retrieved successfully',
    ...result,
  });
}
