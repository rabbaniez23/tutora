import { prisma } from '@/config/database';
import type { DiscountType } from '@prisma/client';

export async function getDashboard() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalStudents,
    totalTeachers,
    totalParents,
    totalAdmins,
    ordersToday,
    revenueToday,
    pendingTeachers,
    totalOrders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
    prisma.user.count({ where: { role: 'TEACHER', deletedAt: null } }),
    prisma.user.count({ where: { role: 'PARENT', deletedAt: null } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.transaction.aggregate({
      where: {
        type: 'PLATFORM_FEE',
        status: 'SUCCESS',
        createdAt: { gte: startOfDay },
      },
      _sum: { amount: true },
    }),
    prisma.teacherProfile.count({ where: { onboardStatus: 'REVIEW_VIDEO' } }),
    prisma.order.count(),
  ]);

  return {
    users: {
      students: totalStudents,
      teachers: totalTeachers,
      parents: totalParents,
      admins: totalAdmins,
      total: totalStudents + totalTeachers + totalParents + totalAdmins,
    },
    orders: {
      today: ordersToday,
      total: totalOrders,
    },
    revenue: {
      today: Number(revenueToday._sum.amount || 0),
    },
    pendingTeachers,
  };
}

export async function getPendingTeachers(page: number, limit: number) {
  const offset = (page - 1) * limit;

  const [teachers, total] = await Promise.all([
    prisma.teacherProfile.findMany({
      where: {
        onboardStatus: { in: ['DRAFT', 'REVIEW_VIDEO', 'INTERVIEW'] },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.teacherProfile.count({
      where: { onboardStatus: { in: ['DRAFT', 'REVIEW_VIDEO', 'INTERVIEW'] } },
    }),
  ]);

  return {
    data: teachers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTeacherDocuments(teacherId: string) {
  const profile = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }

  return {
    id: profile.user.id,
    name: profile.user.name,
    email: profile.user.email,
    phone: profile.user.phone,
    avatarUrl: profile.user.avatarUrl,
    kycStatus: profile.kycStatus,
    onboardStatus: profile.onboardStatus,
    nik: profile.nik,
    ktpPhotoUrl: profile.ktpPhotoUrl,
    university: profile.university,
    major: profile.major,
    yearEnrolled: profile.yearEnrolled,
    gpa: profile.gpa,
    subjects: profile.subjects,
    bio: profile.bio,
    profilePhoto: profile.profilePhoto,
    videoUrl: profile.videoUrl,
    registeredAt: profile.user.createdAt,
  };
}

export async function approveTeacher(teacherId: string) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }

  if (profile.onboardStatus === 'APPROVED') {
    throw Object.assign(new Error('Teacher already approved'), { statusCode: 400 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: { onboardStatus: 'APPROVED' },
  });

  // Notify teacher
  await prisma.notification.create({
    data: {
      userId: teacherId,
      type: 'PROMO',
      title: 'Selamat! Akun Anda Disetujui',
      body: 'Akun tutor Anda telah disetujui. Anda bisa mulai menerima order sekarang!',
    },
  });

  return updated;
}

export async function rejectTeacher(teacherId: string, reason: string) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: { onboardStatus: 'REJECTED' },
  });

  // Notify teacher
  await prisma.notification.create({
    data: {
      userId: teacherId,
      type: 'PROMO',
      title: 'Akun Tutor Ditolak',
      body: `Alasan: ${reason}. Silakan daftar ulang dengan data yang lengkap.`,
    },
  });

  return updated;
}

export async function getAllOrders(
  page: number,
  limit: number,
  filters: { status?: string; search?: string; startDate?: string; endDate?: string },
) {
  const offset = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) (where.createdAt as Record<string, unknown>).gte = new Date(filters.startDate);
    if (filters.endDate) (where.createdAt as Record<string, unknown>).lte = new Date(filters.endDate);
  }

  if (filters.search) {
    where.OR = [
      { subject: { contains: filters.search, mode: 'insensitive' } },
      { student: { name: { contains: filters.search, mode: 'insensitive' } } },
      { teacher: { name: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, phone: true } },
        teacher: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders.map((o) => ({
      ...o,
      basePrice: Number(o.basePrice),
      discountAmount: Number(o.discountAmount),
      finalPrice: Number(o.finalPrice),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAllTransactions(page: number, limit: number, filters: { type?: string; status?: string }) {
  const offset = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, subject: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.transaction.count({ where }),
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

export async function createPromotion(data: {
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
}) {
  const promotion = await prisma.promotion.create({
    data: {
      title: data.title,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: BigInt(data.minOrderAmount || 0),
      maxDiscount: data.maxDiscount ? BigInt(data.maxDiscount) : null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });

  return promotion;
}

export async function createVoucher(data: {
  code: string;
  promotionId: string;
  maxUsage?: number;
  expiresAt: string;
}) {
  const promotion = await prisma.promotion.findUnique({ where: { id: data.promotionId } });

  if (!promotion) {
    throw Object.assign(new Error('Promotion not found'), { statusCode: 404 });
  }

  const voucher = await prisma.voucher.create({
    data: {
      code: data.code.toUpperCase(),
      promotionId: data.promotionId,
      maxUsage: data.maxUsage || 0,
      expiresAt: new Date(data.expiresAt),
    },
  });

  return voucher;
}

export async function getActivePromotions() {
  const now = new Date();

  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      vouchers: {
        where: { isActive: true },
        select: {
          id: true,
          code: true,
          maxUsage: true,
          currentUsage: true,
          expiresAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return promotions.map((p) => ({
    ...p,
    minOrderAmount: Number(p.minOrderAmount),
    maxDiscount: p.maxDiscount ? Number(p.maxDiscount) : null,
  }));
}

export async function validateVoucher(code: string, orderAmount: number) {
  const voucher = await prisma.voucher.findUnique({
    where: { code: code.toUpperCase() },
    include: { promotion: true },
  });

  if (!voucher || !voucher.isActive) {
    throw Object.assign(new Error('Voucher not found or inactive'), { statusCode: 404 });
  }

  if (voucher.expiresAt < new Date()) {
    throw Object.assign(new Error('Voucher has expired'), { statusCode: 400 });
  }

  if (voucher.maxUsage > 0 && voucher.currentUsage >= voucher.maxUsage) {
    throw Object.assign(new Error('Voucher usage limit reached'), { statusCode: 400 });
  }

  if (voucher.promotion.minOrderAmount > 0 && BigInt(orderAmount) < voucher.promotion.minOrderAmount) {
    throw Object.assign(
      new Error(`Minimum order Rp${Number(voucher.promotion.minOrderAmount).toLocaleString()}`),
      { statusCode: 400 },
    );
  }

  let discount = 0;
  if (voucher.promotion.discountType === 'PERCENTAGE') {
    discount = Math.floor(orderAmount * (voucher.promotion.discountValue / 100));
  } else {
    discount = Math.floor(voucher.promotion.discountValue);
  }

  if (voucher.promotion.maxDiscount && discount > Number(voucher.promotion.maxDiscount)) {
    discount = Number(voucher.promotion.maxDiscount);
  }

  return {
    valid: true,
    code: voucher.code,
    promotionTitle: voucher.promotion.title,
    discountType: voucher.promotion.discountType,
    discountValue: voucher.promotion.discountValue,
    discount,
    finalPrice: Math.max(orderAmount - discount, 0),
  };
}
