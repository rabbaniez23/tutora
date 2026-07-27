import Fastify from 'fastify';
import cors from '@fastify/cors';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
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
import { adminRoutes } from '@/modules/admin/admin.routes';
import { errorHandler } from '@/shared/middleware/error-handler';
import { socketPlugin } from '@/shared/plugins/socket.plugin';
import { globalRateLimit } from '@/shared/middleware/rate-limit';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
    },
  });

  // CORS
  const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:19000',
    'exp://',
  ];

  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
  }

  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
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
        contact: {
          name: 'Tutora Team',
          email: 'api@tutora.id',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.tutora.id',
          description: 'Production server',
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

  // Global rate limit
  await app.addHook('onRequest', globalRateLimit(100, 60000));

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
  await app.register(adminRoutes);

  return app;
}
