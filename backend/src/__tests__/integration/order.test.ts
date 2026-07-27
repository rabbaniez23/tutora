import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;
let teacherToken: string;
let studentId: string;
let teacherId: string;
let createdOrderId: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('delia@gmail.com');
  studentToken = studentLogin.accessToken;
  studentId = studentLogin.user.id as string;
  const teacherLogin = await loginAs('budi.santoso@gmail.com');
  teacherToken = teacherLogin.accessToken;
  teacherId = teacherLogin.user.id as string;
});
afterAll(async () => { await closeTestApp(); });

describe('Order Module', () => {
  describe('POST /orders', () => {
    it('should create a new order', async () => {
      // Topup wallet to ensure sufficient balance
      const { prisma } = await import('@/config/database');
      await prisma.wallet.update({
        where: { userId: studentId },
        data: { balance: 200000n }
      });
      const res = await app.inject({
        method: 'POST', url: '/orders',
        headers: authHeader(studentToken),
        payload: {
          subject: 'Matematika', level: 'SMA', durationHours: 1.5, sessionsTotal: 1,
          latitude: -6.21, longitude: 106.84, addressText: 'Test Address', scheduleType: 'NOW'
        },
      });
      if (res.statusCode >= 400) console.log('POST /orders Error:', res.body);
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.data.id).toBeDefined();
      expect(body.data.status).toBe('SEARCHING');
      createdOrderId = body.data.id;
    });

    it('should reject order if insufficient balance', async () => {
      // Login as student with 0 balance (e.g. Rangga)
      const ranggaLogin = await loginAs('rangga.d@gmail.com');
      const res = await app.inject({
        method: 'POST', url: '/orders',
        headers: authHeader(ranggaLogin.accessToken),
        payload: {
          subject: 'Matematika', level: 'SMA', durationHours: 1.5, sessionsTotal: 1,
          latitude: -6.21, longitude: 106.84, addressText: 'Test Address', scheduleType: 'NOW'
        },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.message).toContain('Insufficient balance');
    });
  });

  describe('GET /orders/active', () => {
    it('should get active order', async () => {
      const res = await app.inject({
        method: 'GET', url: '/orders/active',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(createdOrderId);
    });
  });

  describe('POST /orders/:id/accept', () => {
    it('should allow teacher to accept order', async () => {
      // Mock the redis matched_tutor logic for test
      const { redis } = await import('@/config/redis');
      await redis.set(`order:${createdOrderId}:matched_tutor`, JSON.stringify({ tutorId: teacherId }), 'EX', 60);

      const res = await app.inject({
        method: 'POST', url: `/orders/${createdOrderId}/accept`,
        headers: authHeader(teacherToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.status).toBe('MATCHED');
      expect(body.data.teacherId).toBe(teacherId);
    });
  });

  describe('PATCH /orders/:id/cancel', () => {
    it('should cancel the order and refund', async () => {
      const res = await app.inject({
        method: 'PATCH', url: `/orders/${createdOrderId}/cancel`,
        headers: authHeader(studentToken),
        payload: { reason: 'Test cancellation' }
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /orders/history', () => {
    it('should list order history', async () => {
      const res = await app.inject({
        method: 'GET', url: '/orders/history',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
    });
  });
});
