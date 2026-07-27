import type { FastifyInstance } from 'fastify';
import { Server as SocketIOServer, type Socket } from 'socket.io';
import { verifyAccessToken } from '@/shared/utils/jwt';
import { redis } from '@/config/redis';

let io: SocketIOServer;

export function getIO(): SocketIOServer {
  return io;
}

export async function socketPlugin(app: FastifyInstance) {
  io = new SocketIOServer(app.server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  // Auth middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const payload = verifyAccessToken(token);
      (socket as any).userId = payload.id;
      (socket as any).userRole = payload.role;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const userId = (socket as any).userId as string;
    const userRole = (socket as any).userRole as string;

    console.log(`[SOCKET] User connected: ${userId} (${userRole})`);

    // Join personal room
    socket.join(`user:${userId}`);

    // Store connection in Redis
    await redis.sadd(`socket:users`, userId);
    await redis.set(`socket:user:${userId}:socketId`, socket.id);

    // Handle location updates from teachers
    if (userRole === 'TEACHER') {
      socket.on('location_update', async (data: { latitude: number; longitude: number; orderId?: string }) => {
        // Store in Redis
        await redis.setex(
          `teacher:${userId}:location`,
          300, // 5 minutes TTL
          JSON.stringify({ latitude: data.latitude, longitude: data.longitude, updatedAt: new Date().toISOString() }),
        );

        // Update teacher profile
        const { prisma } = await import('@/config/database');
        await prisma.teacherProfile.update({
          where: { id: userId },
          data: { latitude: data.latitude, longitude: data.longitude },
        });

        // If tied to an order, broadcast to student
        if (data.orderId) {
          const { prisma: db } = await import('@/config/database');
          const order = await db.order.findUnique({ where: { id: data.orderId } });

          if (order) {
            io.to(`user:${order.studentId}`).emit('teacher_location', {
              orderId: data.orderId,
              teacherId: userId,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }
        }
      });
    }

    // Handle SOS alert
    socket.on('sos_alert', async (data: { sessionId: string; latitude: number; longitude: number }) => {
      const { prisma } = await import('@/config/database');
      const session = await prisma.session.findUnique({
        where: { id: data.sessionId },
        include: { order: true },
      });

      if (!session) return;

      // Save SOS alert
      await prisma.sosAlert.create({
        data: {
          sessionId: data.sessionId,
          triggeredBy: userId,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      });

      // Get parent
      const orderedByUser = await prisma.user.findUnique({
        where: { id: session.order.orderedById },
        select: { id: true, role: true },
      });

      if (orderedByUser?.role === 'PARENT') {
        io.to(`user:${orderedByUser.id}`).emit('sos_alert', {
          sessionId: data.sessionId,
          teacherId: session.order.teacherId,
          studentId: session.order.studentId,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }

      // Notify admin
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });

      for (const admin of admins) {
        io.to(`user:${admin.id}`).emit('sos_alert', {
          sessionId: data.sessionId,
          triggeredBy: userId,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    socket.on('disconnect', async () => {
      console.log(`[SOCKET] User disconnected: ${userId}`);
      await redis.srem('socket:users', userId);
      await redis.del(`socket:user:${userId}:socketId`);
    });
  });

  app.decorate('io', io);
}

// Helper functions to emit events from services
export function emitToUser(userId: string, event: string, data: unknown) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

export function emitToTeacher(teacherId: string, event: string, data: unknown) {
  if (io) {
    io.to(`user:${teacherId}`).emit(event, data);
  }
}
