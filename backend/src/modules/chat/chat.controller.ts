import type { FastifyRequest, FastifyReply } from 'fastify';
import * as chatService from './chat.service';

export async function getChatRoomsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rooms = await chatService.getChatRooms(request.user.id);
  return reply.send({
    message: 'Chat rooms retrieved successfully',
    data: rooms,
  });
}

export async function getMessagesHandler(
  request: FastifyRequest<{
    Params: { roomId: string };
    Querystring: { cursor?: string; limit?: number };
  }>,
  reply: FastifyReply,
) {
  const { roomId } = request.params;
  const cursor = request.query.cursor;
  const limit = Number(request.query.limit) || 50;

  const result = await chatService.getMessages(roomId, request.user.id, cursor, limit);
  return reply.send({
    message: 'Messages retrieved successfully',
    ...result,
  });
}

export async function sendMessageHandler(
  request: FastifyRequest<{
    Params: { roomId: string };
    Body: { content: string };
  }>,
  reply: FastifyReply,
) {
  const { roomId } = request.params;
  const { content } = request.body;

  const message = await chatService.sendMessage(roomId, request.user.id, content);
  return reply.status(201).send({
    message: 'Message sent successfully',
    data: message,
  });
}

export async function markAsReadHandler(
  request: FastifyRequest<{ Params: { roomId: string } }>,
  reply: FastifyReply,
) {
  const result = await chatService.markAsRead(request.params.roomId, request.user.id);
  return reply.send(result);
}
