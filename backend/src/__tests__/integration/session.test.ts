import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;
let teacherToken: string;
let teacherId: string;
let orderId: string;
let sessionId: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('rizky.f@gmail.com');
  studentToken = studentLogin.accessToken;
  const teacherLogin = await loginAs('rina.marlina@gmail.com');
  teacherToken = teacherLogin.accessToken;
  teacherId = teacherLogin.user.id as string;
});
afterAll(async () => { await closeTestApp(); });

describe('Session Module', () => {
  beforeAll(async () => {
    // Topup student wallet balance to ensure sufficient funds for order creation
    const { prisma } = await import('@/config/database');
    const studentUser = await prisma.user.findFirst({ where: { email: 'rizky.f@gmail.com' } });
    if (studentUser) {
      await prisma.wallet.update({
        where: { userId: studentUser.id },
        data: { balance: 500000n }
      });
    }

    // Set teacher location to match order coordinates for geofence
    const teacherUser = await prisma.user.findFirst({ where: { email: 'rina.marlina@gmail.com' } });
    if (teacherUser) {
      await prisma.teacherProfile.update({
        where: { id: teacherUser.id },
        data: { latitude: -6.2150, longitude: 106.8300 }
      });
    }

    // 1. Create order
    let res = await app.inject({
      method: 'POST', url: '/orders',
      headers: authHeader(studentToken),
      payload: {
        subject: 'Kimia', level: 'SMA', durationHours: 1, sessionsTotal: 1,
        latitude: -6.2150, longitude: 106.8300, addressText: 'Test Address', scheduleType: 'NOW'
      },
    });
    if (res.statusCode >= 400) console.log('POST /orders in session test failed:', res.statusCode, res.body);
    const orderBody = JSON.parse(res.body);
    orderId = orderBody.data?.id;

    // 2. Accept order
    const { redis } = await import('@/config/redis');
    await redis.set(`order:${orderId}:matched_tutor`, JSON.stringify({ tutorId: teacherId }), 'EX', 60);
    res = await app.inject({
      method: 'POST', url: `/orders/${orderId}/accept`,
      headers: authHeader(teacherToken),
    });
    if (res.statusCode >= 400) console.log('POST /orders/accept in session test failed:', res.statusCode, res.body);

    // 3. Get session ID directly from database for this specific order
    const sessionRecord = await prisma.session.findFirst({ where: { orderId } });
    sessionId = sessionRecord!.id;
    console.log('Setup finished. orderId:', orderId, 'sessionId:', sessionId);
  });

  describe('POST /sessions/:id/start', () => {
    it('should start session successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: `/sessions/${sessionId}/start`,
        headers: authHeader(teacherToken),
      });
      if (res.statusCode >= 400) console.log('startSession failed:', res.statusCode, res.body);
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.startedAt).toBeDefined();
    });

    it('should fail if already started', async () => {
      const res = await app.inject({
        method: 'POST', url: `/sessions/${sessionId}/start`,
        headers: authHeader(teacherToken),
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /sessions/:id/end', () => {
    it('should end session successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: `/sessions/${sessionId}/end`,
        headers: authHeader(teacherToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.endedAt).toBeDefined();
    });
  });

  describe('POST /sessions/:id/report & GET', () => {
    it('should submit report successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: `/sessions/${sessionId}/report`,
        headers: authHeader(teacherToken),
        payload: { summary: 'Great session', characters: ['Aktif', 'Fokus'] },
      });
      expect(res.statusCode).toBe(201);
    });

    it('should get report successfully', async () => {
      const res = await app.inject({
        method: 'GET', url: `/sessions/${sessionId}/report`,
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.summary).toBe('Great session');
    });
  });

  describe('POST /sessions/:id/review', () => {
    it('should submit review successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: `/sessions/${sessionId}/review`,
        headers: authHeader(studentToken),
        payload: { rating: 5, content: 'Excellent tutor!', tags: ['Ramah', 'Jelas'] },
      });
      expect(res.statusCode).toBe(201);
    });
  });

  describe('POST /sos', () => {
    it('should trigger SOS alert successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: '/sos',
        headers: authHeader(studentToken),
        payload: { sessionId, latitude: -6.2150, longitude: 106.8300 },
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
