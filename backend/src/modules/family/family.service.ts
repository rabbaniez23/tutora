import { prisma } from '@/config/database';

export async function addChild(parentId: string, data: { childName: string; childGrade: string }) {
  const child = await prisma.parentChild.create({
    data: {
      parentId,
      childName: data.childName,
      childGrade: data.childGrade,
    },
  });

  return child;
}

export async function getChildren(parentId: string) {
  const children = await prisma.parentChild.findMany({
    where: { parentId },
    include: {
      parent: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get order counts and wallet balances for each child
  const childrenWithDetails = await Promise.all(
    children.map(async (child) => {
      // Children don't have wallets in current schema, but they share parent's wallet
      const orderCount = await prisma.order.count({
        where: { studentId: parentId, subject: { not: undefined } },
      });

      return {
        id: child.id,
        childName: child.childName,
        childGrade: child.childGrade,
        totalOrders: orderCount,
        createdAt: child.createdAt,
      };
    }),
  );

  return childrenWithDetails;
}

export async function getChildDetail(parentId: string, childId: string) {
  const child = await prisma.parentChild.findFirst({
    where: { id: childId, parentId },
  });

  if (!child) {
    throw Object.assign(new Error('Child not found'), { statusCode: 404 });
  }

  return child;
}

export async function topupChild(parentId: string, childId: string, amount: number) {
  if (amount <= 0) {
    throw Object.assign(new Error('Amount must be positive'), { statusCode: 400 });
  }

  const child = await prisma.parentChild.findFirst({
    where: { id: childId, parentId },
  });

  if (!child) {
    throw Object.assign(new Error('Child not found'), { statusCode: 404 });
  }

  const parentWallet = await prisma.wallet.findUnique({ where: { userId: parentId } });

  if (!parentWallet) {
    throw Object.assign(new Error('Parent wallet not found'), { statusCode: 404 });
  }

  if (parentWallet.balance < BigInt(amount)) {
    throw Object.assign(new Error('Insufficient balance'), { statusCode: 400 });
  }

  // Create or find child's wallet
  let childWallet = await prisma.wallet.findUnique({ where: { userId: childId } });

  if (!childWallet) {
    childWallet = await prisma.wallet.create({
      data: { userId: childId, balance: BigInt(0) },
    });
  }

  // Transfer from parent to child
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: parentWallet.id },
      data: { balance: { decrement: BigInt(amount) } },
    }),
    prisma.wallet.update({
      where: { id: childWallet.id },
      data: { balance: { increment: BigInt(amount) } },
    }),
    prisma.transaction.create({
      data: {
        userId: parentId,
        walletId: parentWallet.id,
        type: 'CHARGE',
        amount: BigInt(amount),
        status: 'SUCCESS',
        description: `Topup for child: ${child.childName}`,
      },
    }),
  ]);

  return {
    message: `Rp${amount.toLocaleString()} transferred to ${child.childName}`,
    amount,
  };
}

export async function getChildOrders(parentId: string, childId: string, page: number, limit: number) {
  const child = await prisma.parentChild.findFirst({
    where: { id: childId, parentId },
  });

  if (!child) {
    throw Object.assign(new Error('Child not found'), { statusCode: 404 });
  }

  const offset = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        orderedById: parentId,
        studentId: parentId,
      },
      include: {
        teacher: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.order.count({
      where: {
        orderedById: parentId,
        studentId: parentId,
      },
    }),
  ]);

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
