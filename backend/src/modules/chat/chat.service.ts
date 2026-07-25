import { prisma } from '@/config/database';
import { emitToUser, emitToTeacher } from '@/shared/plugins/socket.plugin';

export async function createChatRoom(orderId: string, studentId: string, teacherId: string) {
  const existing = await prisma.chatRoom.findUnique({ where: { orderId } });

  if (existing) return existing;

  const room = await prisma.chatRoom.create({
    data: {
      orderId,
      members: {
        create: [
          { userId: studentId },
          { userId: teacherId },
        ],
      },
    },
    include: { members: true },
  });

  return room;
}

export async function getChatRooms(userId: string) {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      isActive: true,
      members: { some: { userId } },
    },
    include: {
      order: {
        select: {
          id: true,
          subject: true,
          level: true,
          status: true,
        },
      },
      members: {
        select: {
          userId: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          id: true,
          content: true,
          senderId: true,
          isRead: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return rooms.map((room) => ({
    roomId: room.id,
    orderId: room.orderId,
    order: room.order,
    lastMessage: room.messages[0] || null,
    memberIds: room.members.map((m) => m.userId),
    updatedAt: room.updatedAt,
  }));
}

export async function getMessages(
  roomId: string,
  userId: string,
  cursor?: string,
  limit: number = 50,
) {
  const membership = await prisma.chatRoomMember.findUnique({
    where: {
      chatRoomId_userId: { chatRoomId: roomId, userId },
    },
  });

  if (!membership) {
    throw Object.assign(new Error('Not a member of this chat room'), { statusCode: 403 });
  }

  const where: Record<string, unknown> = { chatRoomId: roomId };

  if (cursor) {
    where.createdAt = { lt: new Date(cursor) };
  }

  const messages = await prisma.message.findMany({
    where,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return {
    data: messages,
    nextCursor: messages.length === limit ? messages[messages.length - 1].createdAt.toISOString() : null,
  };
}

export async function sendMessage(roomId: string, senderId: string, content: string) {
  const membership = await prisma.chatRoomMember.findUnique({
    where: {
      chatRoomId_userId: { chatRoomId: roomId, userId: senderId },
    },
  });

  if (!membership) {
    throw Object.assign(new Error('Not a member of this chat room'), { statusCode: 403 });
  }

  const message = await prisma.message.create({
    data: {
      chatRoomId: roomId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Update chat room's updatedAt
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  // Emit to all members
  const members = await prisma.chatRoomMember.findMany({
    where: { chatRoomId: roomId },
    select: { userId: true },
  });

  for (const member of members) {
    emitToUser(member.userId, 'chat_message', {
      roomId,
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        sender: message.sender,
        createdAt: message.createdAt,
      },
    });
  }

  return message;
}

export async function markAsRead(roomId: string, userId: string) {
  const membership = await prisma.chatRoomMember.findUnique({
    where: {
      chatRoomId_userId: { chatRoomId: roomId, userId },
    },
  });

  if (!membership) {
    throw Object.assign(new Error('Not a member of this chat room'), { statusCode: 403 });
  }

  await prisma.message.updateMany({
    where: {
      chatRoomId: roomId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  // Notify other members
  const members = await prisma.chatRoomMember.findMany({
    where: { chatRoomId: roomId, userId: { not: userId } },
    select: { userId: true },
  });

  for (const member of members) {
    emitToUser(member.userId, 'chat_read', {
      roomId,
      readBy: userId,
    });
  }

  return { message: 'Messages marked as read' };
}

export function emitTyping(roomId: string, userId: string) {
  // This is called from Socket.IO directly, no DB needed
  // Handled in socket.plugin.ts
}
