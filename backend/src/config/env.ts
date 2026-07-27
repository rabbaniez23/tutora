import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  MIDTRANS_SERVER_KEY: z.string().default(''),
  MIDTRANS_CLIENT_KEY: z.string().default(''),
  XENDIT_SECRET_KEY: z.string().default(''),
  XENDIT_CALLBACK_TOKEN: z.string().default(''),
  PAYMENT_MODE: z.enum(['sandbox', 'production']).default('sandbox'),
  APP_URL: z.string().default('http://localhost:3000'),
  FONNTE_TOKEN: z.string().default(''),
  FCM_PROJECT_ID: z.string().default(''),
  SUPABASE_URL: z.string().url().or(z.literal('')).default(''),
  SUPABASE_KEY: z.string().default(''),
  PORT: z.coerce.number().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
