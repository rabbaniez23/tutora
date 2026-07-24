import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/shared/middleware/authenticate';
import { authorize } from '@/shared/middleware/authorize';
import {
  registerSchema,
  loginSchema,
  otpSendSchema,
  otpVerifySchema,
  refreshSchema,
  teacherRegisterSchema,
  teacherKycSchema,
  teacherDocumentsSchema,
  teacherVideoSchema,
} from './auth.schema';
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  otpSendHandler,
  otpVerifyHandler,
  teacherRegisterHandler,
  teacherKycHandler,
  teacherDocumentsHandler,
  teacherVideoHandler,
} from './auth.controller';

export async function authRoutes(app: FastifyInstance) {
  // Student/Parent registration
  app.post('/auth/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Register as student or parent',
      body: {
        type: 'object',
        required: ['name', 'email', 'phone', 'password', 'role'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          password: { type: 'string', minLength: 8 },
          role: { type: 'string', enum: ['STUDENT', 'PARENT'] },
        },
      },
      response: { 201: { type: 'object' } },
    },
    preHandler: [async (req, reply) => { registerSchema.parse(req.body); }],
    handler: registerHandler,
  });

  // Login
  app.post('/auth/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Login with email and password',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [async (req, reply) => { loginSchema.parse(req.body); }],
    handler: loginHandler,
  });

  // Logout
  app.post('/auth/logout', {
    schema: {
      tags: ['Auth'],
      summary: 'Logout and invalidate refresh token',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [
      authenticate,
      async (req, reply) => { refreshSchema.parse(req.body); },
    ],
    handler: logoutHandler,
  });

  // Refresh token
  app.post('/auth/refresh', {
    schema: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [async (req, reply) => { refreshSchema.parse(req.body); }],
    handler: refreshHandler,
  });

  // OTP Send
  app.post('/auth/otp/send', {
    schema: {
      tags: ['Auth'],
      summary: 'Send OTP to phone number',
      body: {
        type: 'object',
        required: ['phone'],
        properties: {
          phone: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [async (req, reply) => { otpSendSchema.parse(req.body); }],
    handler: otpSendHandler,
  });

  // OTP Verify
  app.post('/auth/otp/verify', {
    schema: {
      tags: ['Auth'],
      summary: 'Verify OTP code',
      body: {
        type: 'object',
        required: ['phone', 'code'],
        properties: {
          phone: { type: 'string' },
          code: { type: 'string', minLength: 6, maxLength: 6 },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [async (req, reply) => { otpVerifySchema.parse(req.body); }],
    handler: otpVerifyHandler,
  });

  // Teacher registration
  app.post('/auth/teacher/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Register as teacher',
      body: {
        type: 'object',
        required: ['name', 'email', 'phone', 'password', 'university', 'major', 'yearEnrolled', 'gpa', 'subjects'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          password: { type: 'string', minLength: 8 },
          university: { type: 'string' },
          major: { type: 'string' },
          yearEnrolled: { type: 'integer' },
          gpa: { type: 'number' },
          subjects: { type: 'array', items: { type: 'string' }, minItems: 1 },
          bio: { type: 'string' },
        },
      },
      response: { 201: { type: 'object' } },
    },
    preHandler: [async (req, reply) => { teacherRegisterSchema.parse(req.body); }],
    handler: teacherRegisterHandler,
  });

  // Teacher KYC
  app.post('/auth/teacher/kyc', {
    schema: {
      tags: ['Auth'],
      summary: 'Submit KYC documents',
      body: {
        type: 'object',
        required: ['nik', 'ktpPhotoUrl'],
        properties: {
          nik: { type: 'string', minLength: 16, maxLength: 16 },
          ktpPhotoUrl: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
      async (req, reply) => { teacherKycSchema.parse(req.body); },
    ],
    handler: teacherKycHandler,
  });

  // Teacher documents
  app.post('/auth/teacher/documents', {
    schema: {
      tags: ['Auth'],
      summary: 'Submit supporting documents',
      body: {
        type: 'object',
        required: ['documentUrls'],
        properties: {
          documentUrls: { type: 'array', items: { type: 'string' }, minItems: 1 },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
      async (req, reply) => { teacherDocumentsSchema.parse(req.body); },
    ],
    handler: teacherDocumentsHandler,
  });

  // Teacher video
  app.post('/auth/teacher/video', {
    schema: {
      tags: ['Auth'],
      summary: 'Submit introduction video',
      body: {
        type: 'object',
        required: ['videoUrl'],
        properties: {
          videoUrl: { type: 'string' },
        },
      },
      response: { 200: { type: 'object' } },
    },
    preHandler: [
      authenticate,
      authorize('TEACHER'),
      async (req, reply) => { teacherVideoSchema.parse(req.body); },
    ],
    handler: teacherVideoHandler,
  });
}
