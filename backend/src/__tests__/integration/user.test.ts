import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;

beforeAll(async () => {
  app = await getTestApp();
  const login = await loginAs('delia@gmail.com');
  studentToken = login.accessToken;
});
afterAll(async () => { await closeTestApp(); });

describe('User Profile Module', () => {
  describe('GET /users/me', () => {
    it('should return current user profile', async () => {
      const res = await app.inject({
        method: 'GET', url: '/users/me',
        headers: authHeader(studentToken),
      });
      if (res.statusCode >= 400) console.log(res.body);
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.email).toBe('delia@gmail.com');
    });

    it('should reject unauthenticated request', async () => {
      const res = await app.inject({ method: 'GET', url: '/users/me' });
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update user name', async () => {
      const res = await app.inject({
        method: 'PATCH', url: '/users/me',
        headers: authHeader(studentToken),
        payload: { name: 'Delia Updated' },
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
