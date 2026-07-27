import { prisma } from '@/config/database';
import { notifyNextTutor } from '@/modules/order/order.matching';

interface OrderTimeoutData {
  orderId: string;
  tutorId: string;
}

export async function processOrderTimeout(data: OrderTimeoutData) {
  const { orderId, tutorId } = data;

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    console.log(`[TIMEOUT] Order ${orderId} not found, skipping`);
    return { success: false, reason: 'Order not found' };
  }

  if (order.status !== 'SEARCHING') {
    console.log(`[TIMEOUT] Order ${orderId} is ${order.status}, skipping timeout`);
    return { success: false, reason: 'Order not in SEARCHING status' };
  }

  if (order.teacherId && order.teacherId !== tutorId) {
    console.log(`[TIMEOUT] Order ${orderId} already assigned to ${order.teacherId}, skipping`);
    return { success: false, reason: 'Order already assigned' };
  }

  console.log(`[TIMEOUT] Order ${orderId} timed out for tutor ${tutorId}`);

  // Try to find next tutor
  const result = await notifyNextTutor(orderId, [tutorId]);

  if (!result.success) {
    console.log(`[TIMEOUT] No more tutors for order ${orderId}, marking as no_tutor_found`);
    return { success: false, reason: 'No more available tutors' };
  }

  return { success: true, forwardedTo: result.tutor?.id };
}
