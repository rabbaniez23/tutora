import { z } from 'zod';

export const listTeachersSchema = z.object({
  subject: z.string().optional(),
  level: z.enum(['SD', 'SMP', 'SMA']).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().default(5000),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['distance', 'rating', 'sessions']).default('distance'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const toggleStatusSchema = z.object({
  isOnline: z.boolean(),
});

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type ListTeachersInput = z.infer<typeof listTeachersSchema>;
export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
