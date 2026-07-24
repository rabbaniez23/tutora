import { z } from 'zod';

const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(phoneRegex, 'Phone must be a valid Indonesian number (08xx or +628xx)')
    .min(10, 'Phone must be at least 10 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['STUDENT', 'PARENT']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const otpSendSchema = z.object({
  phone: z
    .string()
    .regex(phoneRegex, 'Phone must be a valid Indonesian number'),
});

export const otpVerifySchema = z.object({
  phone: z
    .string()
    .regex(phoneRegex, 'Phone must be a valid Indonesian number'),
  code: z.string().length(6, 'OTP must be 6 digits'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const teacherRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(phoneRegex, 'Phone must be a valid Indonesian number')
    .min(10, 'Phone must be at least 10 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  university: z.string().min(2, 'University is required'),
  major: z.string().min(2, 'Major is required'),
  yearEnrolled: z.number().int().min(2000).max(new Date().getFullYear()),
  gpa: z.number().min(0).max(4),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  bio: z.string().optional(),
});

export const teacherKycSchema = z.object({
  nik: z.string().length(16, 'NIK must be 16 characters'),
  ktpPhotoUrl: z.string().url('KTP photo URL is required'),
});

export const teacherDocumentsSchema = z.object({
  documentUrls: z.array(z.string().url()).min(1, 'At least one document is required'),
});

export const teacherVideoSchema = z.object({
  videoUrl: z.string().url('Video URL is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpSendInput = z.infer<typeof otpSendSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchema>;
export type TeacherKycInput = z.infer<typeof teacherKycSchema>;
export type TeacherDocumentsInput = z.infer<typeof teacherDocumentsSchema>;
export type TeacherVideoInput = z.infer<typeof teacherVideoSchema>;
