import { describe, it, expect } from 'vitest';
import { calculatePrice, applyFlashDeal, calculateCommission } from '@/shared/utils/pricing';

describe('Pricing Utilities', () => {
  describe('calculatePrice', () => {
    it('should calculate SD level price correctly', () => {
      const result = calculatePrice('SD', 2, 4);
      expect(result.pricePerHour).toBe(45000);
      expect(result.basePrice).toBe(360000);
    });

    it('should calculate SMP level price correctly', () => {
      const result = calculatePrice('SMP', 1, 2);
      expect(result.pricePerHour).toBe(55000);
      expect(result.basePrice).toBe(110000);
    });

    it('should calculate SMA level price correctly', () => {
      const result = calculatePrice('SMA', 3, 1);
      expect(result.pricePerHour).toBe(70000);
      expect(result.basePrice).toBe(210000);
    });
  });

  describe('applyFlashDeal', () => {
    it('should apply 20% discount during flash hours (19:00-20:59)', () => {
      const result = applyFlashDeal(100000, new Date('2026-07-27T19:30:00'));
      expect(result.isFlashDeal).toBe(true);
      expect(result.discount).toBe(20000);
      expect(result.finalPrice).toBe(80000);
    });

    it('should not apply discount outside flash hours', () => {
      const result = applyFlashDeal(100000, new Date('2026-07-27T14:00:00'));
      expect(result.isFlashDeal).toBe(false);
      expect(result.discount).toBe(0);
      expect(result.finalPrice).toBe(100000);
    });

    it('should not apply discount at 21:00 (boundary)', () => {
      const result = applyFlashDeal(100000, new Date('2026-07-27T21:00:00'));
      expect(result.isFlashDeal).toBe(false);
    });
  });

  describe('calculateCommission', () => {
    it('should calculate 15% platform fee and 85% teacher payout', () => {
      const result = calculateCommission(100000);
      expect(result.platformFee).toBe(15000);
      expect(result.teacherPayout).toBe(85000);
    });

    it('should floor fractional amounts', () => {
      const result = calculateCommission(99999);
      expect(result.platformFee).toBe(Math.floor(99999 * 0.15));
      expect(result.teacherPayout).toBe(99999 - Math.floor(99999 * 0.15));
    });
  });
});
