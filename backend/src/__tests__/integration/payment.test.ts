import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;
let teacherToken: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('delia@gmail.com');
  studentToken = studentLogin.accessToken;
  const teacherLogin = await loginAs('budi.santoso@gmail.com');
  teacherToken = teacherLogin.accessToken;
});
afterAll(async () => { await closeTestApp(); });

describe('Payment Module', () => {
  describe('POST /payments/topup', () => {
    it('should create topup charge', async () => {
      const res = await app.inject({
        method: 'POST', url: '/payments/topup',
        headers: authHeader(studentToken),
        payload: { amount: 50000 },
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.data.redirectUrl).toBeDefined();
    });

    it('should reject amount below minimum', async () => {
      const res = await app.inject({
        method: 'POST', url: '/payments/topup',
        headers: authHeader(studentToken),
        payload: { amount: 5000 },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /payments/withdraw', () => {
    it('should request withdrawal', async () => {
      const res = await app.inject({
        method: 'POST', url: '/payments/withdraw',
        headers: authHeader(teacherToken),
        payload: {
          amount: 100000, bankCode: 'BANK_BCA',
          accountNumber: '1234567890', accountName: 'Budi Santoso'
        },
      });
      expect(res.statusCode).toBe(201);
    });

    it('should reject non-teachers', async () => {
      const res = await app.inject({
        method: 'POST', url: '/payments/withdraw',
        headers: authHeader(studentToken), // Student trying to withdraw
        payload: {
          amount: 100000, bankCode: 'BANK_BCA',
          accountNumber: '1234567890', accountName: 'Delia'
        },
      });
      expect(res.statusCode).toBe(403);
    });

    it('should reject amount below minimum', async () => {
      const res = await app.inject({
        method: 'POST', url: '/payments/withdraw',
        headers: authHeader(teacherToken),
        payload: {
          amount: 10000, bankCode: 'BANK_BCA', // Minimum is 50000
          accountNumber: '1234567890', accountName: 'Budi Santoso'
        },
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
