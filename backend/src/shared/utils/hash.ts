import bcrypt from 'bcryptjs';

const SALT_ROUNDS = process.env.NODE_ENV === 'test' || process.env.VITEST ? 1 : 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
