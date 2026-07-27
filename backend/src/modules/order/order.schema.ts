import { z } from 'zod';

export const createOrderSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  level: z.enum(['SD', 'SMP', 'SMA']),
  durationHours: z.number().positive().max(8, 'Maximum 8 hours per session'),
  sessionsTotal: z.number().int().positive().max(30, 'Maximum 30 sessions'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  addressText: z.string().min(5, 'Address is required'),
  scheduleType: z.enum(['NOW', 'SCHEDULED']),
  scheduledAt: z.string().datetime().optional(),
  voucherCode: z.string().optional(),
  studentId: z.string().uuid().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
