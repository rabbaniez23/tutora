import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Role } from '@prisma/client';

export function authorize(...roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(request.user.role as Role)) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: `Requires one of these roles: ${roles.join(', ')}`,
      });
    }
  };
}
