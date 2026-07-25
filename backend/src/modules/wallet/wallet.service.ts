import { prisma } from '@/config/database';
import { calculateCommission } from '@/shared/utils/pricing';

export async function getBalance(userId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: {
      id: true,
      balance: true,
      updatedAt: true,
    },
  });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  return wallet;
}

export async function getTransactions(userId: string, page: number, limit: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  const offset = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { walletId: wallet.id },
      include: {
        order: {
          select: {
            id: true,
            subject: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.transaction.count({ where: { walletId: wallet.id } }),
  ]);

  return {
    data: transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function holdFunds(userId: string, amount: number, orderId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  if (wallet.balance < BigInt(amount)) {
    throw Object.assign(new Error('Insufficient balance'), { statusCode: 400 });
  }

  const [updatedWallet, transaction] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: BigInt(amount) } },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId,
        walletId: wallet.id,
        type: 'HOLD',
        amount: BigInt(amount),
        status: 'SUCCESS',
        description: `Funds held for order ${orderId}`,
      },
    }),
  ]);

  return {
    wallet: updatedWallet,
    transaction,
  };
}

export async function releaseFunds(orderId: string) {
  const holdTransaction = await prisma.transaction.findFirst({
    where: {
      orderId,
      type: 'HOLD',
      status: 'SUCCESS',
    },
  });

  if (!holdTransaction) {
    throw Object.assign(new Error('Hold transaction not found'), { statusCode: 404 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || !order.teacherId) {
    throw Object.assign(new Error('Order or teacher not found'), { statusCode: 404 });
  }

  const teacherWallet = await prisma.wallet.findUnique({ where: { userId: order.teacherId } });

  if (!teacherWallet) {
    throw Object.assign(new Error('Teacher wallet not found'), { statusCode: 404 });
  }

  const { teacherPayout, platformFee } = calculateCommission(Number(order.finalPrice));

  // Release from hold (debit student wallet) + credit teacher + platform fee
  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: holdTransaction.id },
      data: { description: 'Released for completed session' },
    }),
    prisma.wallet.update({
      where: { id: teacherWallet.id },
      data: { balance: { increment: BigInt(teacherPayout) } },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId: order.teacherId,
        walletId: teacherWallet.id,
        type: 'DISBURSEMENT',
        amount: BigInt(teacherPayout),
        status: 'SUCCESS',
        description: 'Payment for completed session',
      },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId: order.teacherId,
        walletId: teacherWallet.id,
        type: 'PLATFORM_FEE',
        amount: BigInt(platformFee),
        status: 'SUCCESS',
        description: 'Platform commission (15%)',
      },
    }),
  ]);

  return { teacherPayout, platformFee };
}

export async function refundHold(orderId: string) {
  const holdTransaction = await prisma.transaction.findFirst({
    where: {
      orderId,
      type: 'HOLD',
      status: 'SUCCESS',
    },
  });

  if (!holdTransaction) {
    throw Object.assign(new Error('Hold transaction not found'), { statusCode: 404 });
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: holdTransaction.userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: holdTransaction.amount } },
    }),
    prisma.transaction.create({
      data: {
        orderId,
        userId: holdTransaction.userId,
        walletId: wallet.id,
        type: 'REFUND',
        amount: holdTransaction.amount,
        status: 'SUCCESS',
        description: 'Refund for cancelled order',
      },
    }),
    prisma.transaction.update({
      where: { id: holdTransaction.id },
      data: { description: 'Refunded - order cancelled' },
    }),
  ]);

  return { refunded: Number(holdTransaction.amount) };
}
