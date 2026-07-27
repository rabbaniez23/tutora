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
    // 1. Create order
    let res = await app.inject({
      method: 'POST', url: '/orders',
      headers: authHeader(studentToken),
      payload: {
        subject: 'Kimia', level: 'SMA', durationHours: 1, sessionsTotal: 1,
        // Using Rina's coordinates so distance is 0 for geo-fence check
        latitude: -6.2150, longitude: 106.8300, addressText: 'Test Address', scheduleType: 'NOW'
      },
    });
    const orderBody = JSON.parse(res.body);
    orderId = orderBody.data.id;

    // 2. Accept order
    const { redis } = await import('@/config/redis');
    await redis.set(`order:${orderId}:matched_tutor`, JSON.stringify({ tutorId: teacherId }), 'EX', 60);
    res = await app.inject({
      method: 'POST', url: `/orders/${orderId}/accept`,
      headers: authHeader(teacherToken),
    });

    // 3. Get session ID from active order
    res = await app.inject({
      method: 'GET', url: '/orders/active',
      headers: authHeader(studentToken),
    });
    const activeOrderBody = JSON.parse(res.body);
    sessionId = activeOrderBody.data.sessions[0].id;
  });

  describe('POST /sessions/:id/start', () => {
    it('should start session successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: `/sessions/${sessionId}/start`,
        headers: authHeader(teacherToken),
      });
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
