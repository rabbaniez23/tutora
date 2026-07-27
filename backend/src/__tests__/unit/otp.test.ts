import { describe, it, expect } from 'vitest';
import { generateOTP, isOTPExpired } from '@/shared/utils/otp';

describe('OTP Utilities', () => {
  describe('generateOTP', () => {
    it('should return a 6-digit string', () => {
      const otp = generateOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs on multiple calls', () => {
      const otps = new Set(Array.from({ length: 20 }, () => generateOTP()));
      expect(otps.size).toBeGreaterThan(1);
    });
  });

  describe('isOTPExpired', () => {
    it('should return true for a past date', () => {
      const past = new Date(Date.now() - 60000);
      expect(isOTPExpired(past)).toBe(true);
    });

    it('should return false for a future date', () => {
      const future = new Date(Date.now() + 60000);
      expect(isOTPExpired(future)).toBe(false);
    });
  });
});
