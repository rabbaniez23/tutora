import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('delia@gmail.com');
  studentToken = studentLogin.accessToken;
});
afterAll(async () => { await closeTestApp(); });

describe('Wallet Module', () => {
  describe('GET /wallet/balance', () => {
    it('should return current wallet balance', async () => {
      const res = await app.inject({
        method: 'GET', url: '/wallet/balance',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.balance).toBeDefined();
    });
  });

  describe('GET /wallet/transactions', () => {
    it('should return transaction history', async () => {
      const res = await app.inject({
        method: 'GET', url: '/wallet/transactions',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.pagination).toBeDefined();
    });
  });
});
