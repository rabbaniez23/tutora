import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp, closeTestApp, loginAs, authHeader } from '../helpers/test-app';
import type { FastifyInstance } from 'fastify';
import { prisma } from '@/config/database';

let app: FastifyInstance;
let studentToken: string;
let teacherToken: string;
let roomId: string;

beforeAll(async () => {
  app = await getTestApp();
  const studentLogin = await loginAs('delia@gmail.com');
  studentToken = studentLogin.accessToken;
  const teacherLogin = await loginAs('budi.santoso@gmail.com');
  teacherToken = teacherLogin.accessToken;
  
  const dummyOrder = await prisma.order.create({
    data: {
      studentId: studentLogin.user.id as string,
      orderedById: studentLogin.user.id as string,
      teacherId: teacherLogin.user.id as string,
      subject: 'Test Subject',
      level: 'SMA',
      durationHours: 2,
      sessionsTotal: 1,
      latitude: 0,
      longitude: 0,
      addressText: 'Test Address',
      scheduleType: 'NOW',
      status: 'MATCHED',
      basePrice: 100000,
      finalPrice: 100000,
    }
  });

  // Create a chat room directly in DB since the order accept flow handles it normally
  const room = await prisma.chatRoom.create({
    data: {
      orderId: dummyOrder.id,
      members: {
        create: [
          { userId: studentLogin.user.id as string },
          { userId: teacherLogin.user.id as string }
        ]
      }
    }
  });
  roomId = room.id;
});
afterAll(async () => { await closeTestApp(); });

describe('Chat Module', () => {
  describe('POST /chats/:roomId/messages', () => {
    it('should send a message from student', async () => {
      const res = await app.inject({
        method: 'POST', url: `/chats/${roomId}/messages`,
        headers: authHeader(studentToken),
        payload: { content: 'Halo kak!' }
      });
      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.body);
      expect(body.data.content).toBe('Halo kak!');
    });

    it('should send a reply from teacher', async () => {
      const res = await app.inject({
        method: 'POST', url: `/chats/${roomId}/messages`,
        headers: authHeader(teacherToken),
        payload: { content: 'Halo juga! Ada yang bisa dibantu?' }
      });
      expect(res.statusCode).toBe(201);
    });
  });

  describe('GET /chats/:roomId/messages', () => {
    it('should retrieve messages', async () => {
      const res = await app.inject({
        method: 'GET', url: `/chats/${roomId}/messages`,
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('PATCH /chats/:roomId/read', () => {
    it('should mark messages as read', async () => {
      const res = await app.inject({
        method: 'PATCH', url: `/chats/${roomId}/read`,
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /chats', () => {
    it('should list chat rooms', async () => {
      const res = await app.inject({
        method: 'GET', url: '/chats',
        headers: authHeader(studentToken),
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
    });
  });
});
