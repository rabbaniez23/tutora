import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authRoutes } from '@/modules/auth/auth.routes';
import { userRoutes } from '@/modules/user/user.routes';
import { teacherRoutes } from '@/modules/teacher/teacher.routes';
import { orderRoutes } from '@/modules/order/order.routes';
import { sessionRoutes } from '@/modules/session/session.routes';
import { walletRoutes } from '@/modules/wallet/wallet.routes';
import { paymentRoutes } from '@/modules/payment/payment.routes';
import { chatRoutes } from '@/modules/chat/chat.routes';
import { familyRoutes } from '@/modules/family/family.routes';
import { notificationRoutes } from '@/modules/notification/notification.routes';
import { errorHandler } from '@/shared/middleware/error-handler';
import { socketPlugin } from '@/shared/plugins/socket.plugin';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
    },
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(helmet);

  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Tutora API',
        description: 'Backend API for Tutora - on-demand tutor marketplace',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Socket.IO
  await app.register(socketPlugin);

  app.setErrorHandler(errorHandler);

  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  });

  // API Routes
  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(teacherRoutes);
  await app.register(orderRoutes);
  await app.register(sessionRoutes);
  await app.register(walletRoutes);
  await app.register(paymentRoutes);
  await app.register(chatRoutes);
  await app.register(familyRoutes);
  await app.register(notificationRoutes);

  return app;
}
