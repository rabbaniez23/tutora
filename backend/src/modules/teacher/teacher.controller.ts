import type { FastifyRequest, FastifyReply } from 'fastify';
import * as teacherService from './teacher.service';
import type { ListTeachersInput, ToggleStatusInput, UpdateLocationInput } from './teacher.schema';

export async function listTeachersHandler(
  request: FastifyRequest<{ Querystring: ListTeachersInput }>,
  reply: FastifyReply,
) {
  const result = await teacherService.listTeachers(request.query);
  return reply.send({
    message: 'Teachers retrieved successfully',
    ...result,
  });
}

export async function getTeacherDetailHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const teacher = await teacherService.getTeacherDetail(request.params.id);
  return reply.send({
    message: 'Teacher detail retrieved successfully',
    data: teacher,
  });
}

export async function toggleOnlineHandler(
  request: FastifyRequest<{ Body: ToggleStatusInput }>,
  reply: FastifyReply,
) {
  const result = await teacherService.toggleOnline(request.user.id, request.body.isOnline);
  return reply.send({
    message: `Status updated to ${request.body.isOnline ? 'online' : 'offline'}`,
    data: result,
  });
}

export async function updateLocationHandler(
  request: FastifyRequest<{ Body: UpdateLocationInput }>,
  reply: FastifyReply,
) {
  const result = await teacherService.updateLocation(
    request.user.id,
    request.body.latitude,
    request.body.longitude,
  );
  return reply.send({
    message: 'Location updated successfully',
    data: result,
  });
}
