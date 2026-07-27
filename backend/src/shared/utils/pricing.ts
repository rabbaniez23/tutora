import type { EducationLevel } from '@prisma/client';
import { COMMISSION_RATE } from '@/config/constants';
import { prisma } from '@/config/database';

const PRICE_PER_HOUR: Record<EducationLevel, number> = {
  SD: 45000,
  SMP: 55000,
  SMA: 70000,
};

export function calculatePrice(level: EducationLevel, durationHours: number, sessionsTotal: number) {
  const pricePerHour = PRICE_PER_HOUR[level];
  const basePrice = pricePerHour * durationHours * sessionsTotal;
  return { pricePerHour, basePrice };
}

export async function applyVoucher(basePrice: number, voucherCode: string) {
  if (!voucherCode) {
    return { discountAmount: 0, finalPrice: basePrice, voucherCode: null };
  }

  const voucher = await prisma.voucher.findUnique({
    where: { code: voucherCode },
    include: { promotion: true },
  });

  if (!voucher || !voucher.isActive) {
    throw Object.assign(new Error('Voucher not found or inactive'), { statusCode: 400 });
  }

  if (voucher.expiresAt < new Date()) {
    throw Object.assign(new Error('Voucher has expired'), { statusCode: 400 });
  }

  if (voucher.maxUsage > 0 && voucher.currentUsage >= voucher.maxUsage) {
    throw Object.assign(new Error('Voucher usage limit reached'), { statusCode: 400 });
  }

  if (voucher.promotion.minOrderAmount > 0 && BigInt(basePrice) < voucher.promotion.minOrderAmount) {
    throw Object.assign(
      new Error(`Minimum order amount is Rp${voucher.promotion.minOrderAmount.toLocaleString()}`),
      { statusCode: 400 },
    );
  }

  let discountAmount = 0;
  const promo = voucher.promotion;

  if (promo.discountType === 'PERCENTAGE') {
    discountAmount = Math.floor(basePrice * (promo.discountValue / 100));
  } else {
    discountAmount = Math.floor(promo.discountValue);
  }

  if (promo.maxDiscount && discountAmount > Number(promo.maxDiscount)) {
    discountAmount = Number(promo.maxDiscount);
  }

  const finalPrice = Math.max(basePrice - discountAmount, 0);

  await prisma.voucher.update({
    where: { id: voucher.id },
    data: { currentUsage: { increment: 1 } },
  });

  return { discountAmount, finalPrice, voucherCode };
}

export function applyFlashDeal(basePrice: number, scheduledAt: Date | null) {
  const targetDate = scheduledAt || new Date();
  const hour = targetDate.getHours();

  if (hour >= 19 && hour < 21) {
    const discount = Math.floor(basePrice * 0.2);
    return { discount, finalPrice: basePrice - discount, isFlashDeal: true };
  }

  return { discount: 0, finalPrice: basePrice, isFlashDeal: false };
}

export function calculateCommission(finalPrice: number) {
  const platformFee = Math.floor(finalPrice * COMMISSION_RATE);
  const teacherPayout = finalPrice - platformFee;
  return { teacherPayout, platformFee };
}
