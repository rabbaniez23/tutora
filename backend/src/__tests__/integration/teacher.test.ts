import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let studentToken: string;
let teacherToken: string;
let teacherId: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('delia@gmail.com');
  studentToken = studentLogin.accessToken;
  const teacherLogin = await loginAs('budi.santoso@gmail.com');
  teacherToken = teacherLogin.accessToken;
  teacherId = teacherLogin.user.id as string;
});
afterAll(async () => { await closeTestApp(); });

describe('Teacher Module', () => {
  describe('GET /teachers', () => {
    it('should list nearby teachers', async () => {
      const res = await app.inject({
        method: 'GET', url: '/teachers?lat=-6.2&lng=106.8&radius=10000',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
    });

    it('should filter teachers by subject', async () => {
      const res = await app.inject({
        method: 'GET', url: '/teachers?lat=-6.2&lng=106.8&subject=Fisika',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
      // Ensure all returned teachers have Fisika in subjects
      body.data.forEach((teacher: any) => {
        expect(teacher.subjects).toContain('Fisika');
      });
    });
  });

  describe('GET /teachers/:id', () => {
    it('should return teacher detail', async () => {
      const res = await app.inject({
        method: 'GET', url: `/teachers/${teacherId}`,
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.id).toBe(teacherId);
      expect(body.data.subjects).toBeDefined();
    });

    it('should return 404 for invalid teacher id', async () => {
      const res = await app.inject({
        method: 'GET', url: `/teachers/00000000-0000-0000-0000-000000000000`,
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /teachers/me/status', () => {
    it('should toggle online status', async () => {
      const res = await app.inject({
        method: 'PATCH', url: '/teachers/me/status',
        headers: authHeader(teacherToken),
        payload: { isOnline: false },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.isOnline).toBe(false);
    });
  });

  describe('PUT /teachers/me/location', () => {
    it('should update GPS location', async () => {
      const res = await app.inject({
        method: 'PUT', url: '/teachers/me/location',
        headers: authHeader(teacherToken),
        payload: { latitude: -6.22, longitude: 106.85 },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data.latitude).toBe(-6.22);
      expect(body.data.longitude).toBe(106.85);
    });
  });
});
