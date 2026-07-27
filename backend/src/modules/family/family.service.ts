import { prisma } from '@/config/database';
import bcrypt from 'bcryptjs';

export async function addChild(
  parentId: string,
  data: {
    childUserId?: string;
    childName?: string;
    childEmail?: string;
    childPhone?: string;
    childGrade: string;
  },
) {
  let childUser;

  // Case 1: Link by childUserId
  if (data.childUserId) {
    childUser = await prisma.user.findUnique({
      where: { id: data.childUserId },
    });

    if (!childUser) {
      throw Object.assign(new Error('Student user not found'), { statusCode: 404 });
    }

    if (childUser.role !== 'STUDENT') {
      throw Object.assign(new Error('User is not a student'), { statusCode: 400 });
    }
  }
  // Case 2: Link or create by childEmail
  else if (data.childEmail) {
    const existing = await prisma.user.findFirst({
      where: { email: data.childEmail },
    });

    if (existing) {
      if (existing.role !== 'STUDENT') {
        throw Object.assign(new Error('User with this email is not a student'), { statusCode: 400 });
      }
      childUser = existing;
    } else {
      if (!data.childName) {
        throw Object.assign(
          new Error('childName is required to create a new child account'),
          { statusCode: 400 },
        );
      }

      const phone = data.childPhone || `0800${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const hash = await bcrypt.hash('Password123!', 10);
      childUser = await prisma.user.create({
        data: {
          role: 'STUDENT',
          name: data.childName,
          email: data.childEmail,
          phone,
          passwordHash: hash,
          phoneVerified: false,
          wallet: { create: { balance: 0 } },
        },
      });
    }
  } else {
    throw Object.assign(
      new Error('Either childUserId or childEmail must be provided'),
      { statusCode: 400 },
    );
  }

  // Check if already linked
  const alreadyLinked = await prisma.parentChild.findUnique({
    where: { childUserId: childUser.id },
  });

  if (alreadyLinked) {
    if (alreadyLinked.parentId === parentId) {
      throw Object.assign(new Error('This child is already linked to your account'), { statusCode: 409 });
    } else {
      throw Object.assign(new Error('This child is already linked to another parent account'), { statusCode: 409 });
    }
  }

  const parentChild = await prisma.parentChild.create({
    data: {
      parentId,
      childUserId: childUser.id,
      childGrade: data.childGrade,
    },
  });

  return {
    id: parentChild.id,
    childUserId: childUser.id,
    childName: childUser.name,
    childEmail: childUser.email,
    childPhone: childUser.phone,
    childGrade: parentChild.childGrade,
    createdAt: parentChild.createdAt,
  };
}

export async function getChildren(parentId: string) {
  const children = await prisma.parentChild.findMany({
    where: { parentId },
    include: {
      childUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          wallet: { select: { balance: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const childrenWithOrders = await Promise.all(
    children.map(async (child) => {
      const orderCount = await prisma.order.count({
        where: { studentId: child.childUserId },
      });

      return {
        id: child.id,
        childUserId: child.childUserId,
        childName: child.childUser.name,
        childEmail: child.childUser.email,
        childPhone: child.childUser.phone,
        childGrade: child.childGrade,
        avatarUrl: child.childUser.avatarUrl,
        walletBalance: child.childUser.wallet?.balance ?? BigInt(0),
        totalOrders: orderCount,
        createdAt: child.createdAt,
      };
    }),
  );

  return childrenWithOrders;
}

export async function getChildDetail(parentId: string, childId: string) {
  const child = await prisma.parentChild.findFirst({
    where: { id: childId, parentId },
    include: {
      childUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          wallet: { select: { balance: true } },
        },
      },
    },
  });

  if (!child) {
    throw Object.assign(new Error('Child not found'), { statusCode: 404 });
  }

  return {
    id: child.id,
    childUserId: child.childUserId,
    childName: child.childUser.name,
    childEmail: child.childUser.email,
    childPhone: child.childUser.phone,
    childGrade: child.childGrade,
    avatarUrl: child.childUser.avatarUrl,
    walletBalance: child.childUser.wallet?.balance ?? BigInt(0),
    createdAt: child.createdAt,
  };
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

  const childWallet = await prisma.wallet.findUnique({ where: { userId: child.childUserId } });

  if (!childWallet) {
    throw Object.assign(new Error('Child wallet not found'), { statusCode: 404 });
  }

  const childUser = await prisma.user.findUnique({ where: { id: child.childUserId }, select: { name: true } });

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
        description: `Topup for child: ${childUser?.name ?? 'Unknown'}`,
      },
    }),
  ]);

  return {
    message: `Rp${amount.toLocaleString()} transferred to ${childUser?.name ?? 'child'}`,
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
        studentId: child.childUserId,
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
        studentId: child.childUserId,
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
