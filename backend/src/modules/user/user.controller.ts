import type { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from './user.service';
import type { UpdateProfileInput } from './user.schema';

export async function getProfileHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const profile = await userService.getProfile(request.user.id);
  return reply.send({
    message: 'Profile retrieved successfully',
    data: profile,
  });
}

export async function updateProfileHandler(
  request: FastifyRequest<{ Body: UpdateProfileInput }>,
  reply: FastifyReply,
) {
  const updated = await userService.updateProfile(request.user.id, request.body);
  return reply.send({
    message: 'Profile updated successfully',
    data: updated,
  });
}
