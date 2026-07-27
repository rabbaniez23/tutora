import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '@/shared/utils/hash';

describe('Hash Utilities', () => {
  it('should hash a password and verify it', async () => {
    const plain = 'Password123!';
    const hashed = await hashPassword(plain);
    expect(hashed).not.toBe(plain);
    expect(await comparePassword(plain, hashed)).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hashed = await hashPassword('correct');
    expect(await comparePassword('wrong', hashed)).toBe(false);
  });

  it('should produce different hashes for same input (salted)', async () => {
    const h1 = await hashPassword('same');
    const h2 = await hashPassword('same');
    expect(h1).not.toBe(h2);
  });
});
