import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;
let notificationId: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('delia@gmail.com');
  studentToken = studentLogin.accessToken;
});
afterAll(async () => { await closeTestApp(); });

describe('Notification Module', () => {
  describe('GET /notifications', () => {
    it('should return notifications list', async () => {
      const res = await app.inject({
        method: 'GET', url: '/notifications',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
      
      // Store ID if there's any notification to test mark as read
      if (body.data.length > 0) {
        notificationId = body.data[0].id;
      }
    });
  });

  describe('PATCH /notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      // If we don't have a notification ID from the previous test, we can skip or create one
      if (!notificationId) {
        console.log('Skipping mark as read test (no notifications found)');
        return;
      }

      const res = await app.inject({
        method: 'PATCH', url: `/notifications/${notificationId}/read`,
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.message).toContain('marked as read');
    });
  });

  describe('POST /notifications/register-device', () => {
    it('should register FCM device token', async () => {
      const res = await app.inject({
        method: 'POST', url: '/notifications/register-device',
        headers: authHeader(studentToken),
        payload: { token: 'fake-fcm-token-123', deviceInfo: 'iOS 16' },
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
