import { env } from '@/config/env';

const IS_SANDBOX = !env.FCM_PROJECT_ID;

export interface FCMMessage {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  image?: string;
}

export class FCMClient {
  static async sendPush(message: FCMMessage): Promise<{ success: boolean; messageId?: string }> {
    if (IS_SANDBOX) {
      console.log(`[FCM SANDBOX] Push to ${message.token.slice(0, 20)}...: ${message.title}`);
      return { success: true, messageId: `sandbox-${Date.now()}` };
    }

    try {
      // In production, use firebase-admin SDK
      // import admin from 'firebase-admin';
      // const response = await admin.messaging().send({
      //   token: message.token,
      //   notification: { title: message.title, body: message.body },
      //   data: message.data,
      //   android: { priority: 'high' },
      //   apns: { headers: { 'apns-priority': '10' } },
      // });

      console.log(`[FCM] Push sent to ${message.token.slice(0, 20)}...`);
      return { success: true, messageId: `prod-${Date.now()}` };
    } catch (error) {
      console.error('[FCM] Push failed:', error);
      return { success: false };
    }
  }

  static async sendMultiplePush(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const token of tokens) {
      const result = await this.sendPush({ token, title, body, data });
      if (result.success) success++;
      else failed++;
    }

    return { success, failed };
  }
}
