import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let adminToken: string;

beforeAll(async () => {
  app = await getTestApp();
  const adminLogin = await loginAs('admin@tutora.id');
  adminToken = adminLogin.accessToken;
});
afterAll(async () => { await closeTestApp(); });

describe('Admin Module', () => {
  describe('GET /admin/dashboard', () => {
    it('should return dashboard stats', async () => {
      const res = await app.inject({
        method: 'GET', url: '/admin/dashboard',
        headers: authHeader(adminToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.users).toBeDefined();
      expect(body.data.orders).toBeDefined();
    });

    it('should reject non-admin users', async () => {
      const studentLogin = await loginAs('delia@gmail.com');
      const res = await app.inject({
        method: 'GET', url: '/admin/dashboard',
        headers: authHeader(studentLogin.accessToken),
      });
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /admin/teachers/pending', () => {
    it('should list pending teachers', async () => {
      const res = await app.inject({
        method: 'GET', url: '/admin/teachers/pending',
        headers: authHeader(adminToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
    });
  });

  describe('Admin Promotions & Vouchers', () => {
    let promoId: string;

    it('should create a promotion', async () => {
      const res = await app.inject({
        method: 'POST', url: '/admin/promotions',
        headers: authHeader(adminToken),
        payload: {
          title: 'Test Promo',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
        }
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.data.id).toBeDefined();
      promoId = body.data.id;
    });

    it('should create a voucher for the promotion', async () => {
      const res = await app.inject({
        method: 'POST', url: '/admin/vouchers',
        headers: authHeader(adminToken),
        payload: {
          code: `TEST${Date.now()}`,
          promotionId: promoId,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        }
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.data.code).toBeDefined();
    });
  });
});
