import { buildApp } from '@/app';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;

export async function getTestApp(): Promise<FastifyInstance> {
  if (!app) {
    app = await buildApp();
    await app.ready();
  }
  return app;
}

export async function closeTestApp() {
  if (app) {
    await app.close();
  }
}

export async function loginAs(
  email: string,
  password = 'Password123!',
): Promise<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }> {
  const app = await getTestApp();
  const res = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password },
  });
  if (res.statusCode >= 400) {
    throw new Error(`Login failed for ${email} with status ${res.statusCode}: ${res.body}`);
  }
  const body = JSON.parse(res.body);
  return body;
}

export function authHeader(token: string) {
  return { authorization: `Bearer ${token}` };
}
