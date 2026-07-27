import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeAll(async () => { app = await getTestApp(); });
afterAll(async () => { await closeTestApp(); });

describe('Auth Module', () => {
  describe('POST /auth/login', () => {
    it('should login student successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/login',
        payload: { email: 'delia@gmail.com', password: 'Password123!' },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
      expect(body.user.role).toBe('STUDENT');
    });

    it('should login teacher successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/login',
        payload: { email: 'budi.santoso@gmail.com', password: 'Password123!' },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.user.role).toBe('TEACHER');
    });

    it('should login parent successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/login',
        payload: { email: 'hendra.puspito@gmail.com', password: 'Password123!' },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.user.role).toBe('PARENT');
    });

    it('should login admin successfully', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/login',
        payload: { email: 'admin@tutora.id', password: 'Password123!' },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.user.role).toBe('ADMIN');
    });

    it('should reject invalid password', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/login',
        payload: { email: 'delia@gmail.com', password: 'WrongPassword!' },
      });
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });

    it('should reject non-existent email', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/login',
        payload: { email: 'nobody@gmail.com', password: 'Password123!' },
      });
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new student', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/register',
        payload: {
          name: 'Test Student', email: `test.student.${Date.now()}@test.com`,
          phone: `08${Date.now().toString().slice(-10)}`, password: 'Password123!', role: 'STUDENT',
        },
      });
      expect(res.statusCode).toBe(201);
    });

    it('should reject duplicate email', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/register',
        payload: {
          name: 'Duplicate', email: 'delia@gmail.com',
          phone: '089999999999', password: 'Password123!', role: 'STUDENT',
        },
      });
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const { refreshToken } = await loginAs('delia@gmail.com');
      const res = await app.inject({
        method: 'POST', url: '/auth/refresh',
        payload: { refreshToken },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.accessToken).toBeDefined();
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const { accessToken, refreshToken } = await loginAs('delia@gmail.com');
      const res = await app.inject({
        method: 'POST', url: '/auth/logout',
        headers: authHeader(accessToken),
        payload: { refreshToken },
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /auth/otp/send & /auth/otp/verify', () => {
    it('should send OTP', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/otp/send',
        payload: { phone: '081234567001' },
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /auth/teacher/register', () => {
    it('should register a new teacher', async () => {
      const res = await app.inject({
        method: 'POST', url: '/auth/teacher/register',
        payload: {
          name: 'New Teacher', email: `teacher.${Date.now()}@test.com`,
          phone: `087${Date.now().toString().slice(-9)}`, password: 'Password123!',
          university: 'UI', major: 'Fisika', yearEnrolled: 2020, gpa: 3.5,
          subjects: ['Fisika'], bio: 'Test bio',
        },
      });
      expect(res.statusCode).toBe(201);
    });
  });

  describe('Teacher onboarding (KYC, documents, video)', () => {
    it('should submit KYC as teacher', async () => {
      const { accessToken } = await loginAs('budi.santoso@gmail.com');
      const res = await app.inject({
        method: 'POST', url: '/auth/teacher/kyc',
        headers: authHeader(accessToken),
        payload: { nik: '3201010101010099', ktpPhotoUrl: 'https://example.com/ktp.jpg' },
      });
      expect(res.statusCode).toBe(200);
    });

    it('should submit documents as teacher', async () => {
      const { accessToken } = await loginAs('budi.santoso@gmail.com');
      const res = await app.inject({
        method: 'POST', url: '/auth/teacher/documents',
        headers: authHeader(accessToken),
        payload: { documentUrls: ['https://example.com/doc1.pdf'] },
      });
      expect(res.statusCode).toBe(200);
    });

    it('should submit video as teacher', async () => {
      const { accessToken } = await loginAs('budi.santoso@gmail.com');
      const res = await app.inject({
        method: 'POST', url: '/auth/teacher/video',
        headers: authHeader(accessToken),
        payload: { videoUrl: 'https://example.com/intro.mp4' },
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
