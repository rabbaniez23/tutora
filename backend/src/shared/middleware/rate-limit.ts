import type { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '@/config/redis';

interface RateLimitOptions {
  max: number;
  windowMs: number;
  keyPrefix: string;
}

async function rateLimitCheck(
  request: FastifyRequest,
  reply: FastifyReply,
  options: RateLimitOptions,
): Promise<boolean> {
  const ip = request.ip || request.socket.remoteAddress || 'unknown';
  const key = `${options.keyPrefix}:${ip}`;

  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.pexpire(key, options.windowMs);
    }

    if (current > options.max) {
      const ttl = await redis.pttl(key);
      reply.header('X-RateLimit-Limit', options.max);
      reply.header('X-RateLimit-Remaining', 0);
      reply.header('X-RateLimit-Reset', Math.ceil(ttl / 1000));

      return reply.status(429).send({
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil(ttl / 1000)} seconds`,
      });
    }

    return false;
  } catch {
    // If Redis fails, allow the request
    return false;
  }
}

export function globalRateLimit(max: number = 100, windowMs: number = 60000) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    return rateLimitCheck(request, reply, {
      max,
      windowMs,
      keyPrefix: 'rl:global',
    });
  };
}

export function authRateLimit(max: number = 10, windowMs: number = 60000) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    return rateLimitCheck(request, reply, {
      max,
      windowMs,
      keyPrefix: 'rl:auth',
    });
  };
}

export function otpRateLimit(max: number = 3, windowMs: number = 600000) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const phone = (request.body as any)?.phone;
    if (!phone) return false;

    const key = `rl:otp:${phone}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.pexpire(key, windowMs);
      }

      if (current > max) {
        const ttl = await redis.pttl(key);
        return reply.status(429).send({
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Too many OTP requests. Try again in ${Math.ceil(ttl / 1000)} seconds`,
        });
      }

      return false;
    } catch {
      return false;
    }
  };
}
