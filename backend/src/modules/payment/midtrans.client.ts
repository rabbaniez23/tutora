import crypto from 'node:crypto';
import { env } from '@/config/env';

const IS_SANDBOX = process.env.PAYMENT_MODE === 'sandbox' || !env.MIDTRANS_SERVER_KEY;

const MIDTRANS_BASE_URL = IS_SANDBOX
  ? 'https://app.sandbox.midtrans.com/api/v2'
  : 'https://api.midtrans.com/api/v2';

const MIDTRANS_CLIENT_KEY = IS_SANDBOX
  ? (process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-XXXXXXXXXXXXXXXX')
  : (process.env.MIDTRANS_CLIENT_KEY || '');

function getAuthHeader(): string {
  const key = env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-XXXXXXXXXXXXXXXX';
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
}

export interface MidtransCustomerDetails {
  firstName: string;
  email: string;
  phone: string;
}

export interface MidtransItemDetails {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface MidtransTransactionResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotificationPayload {
  transaction_status: string;
  fraud_status: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_id: string;
  status_code: string;
  status_message: string;
  signature_key: string;
  settlement_time?: string;
  expiry_time?: string;
}

export class MidtransClient {
  static async createTransaction(
    orderId: string,
    amount: number,
    customer: MidtransCustomerDetails,
    items: MidtransItemDetails[],
  ): Promise<MidtransTransactionResponse> {
    if (IS_SANDBOX) {
      console.log(`[MIDTRANS SANDBOX] Creating transaction: ${orderId}, Rp${amount}`);
      return {
        token: `sandbox-snap-token-${orderId}-${Date.now()}`,
        redirect_url: `https://app.sandbox.midtrans.com/snap/v2/pay/${orderId}`,
      };
    }

    const response = await fetch(`${MIDTRANS_BASE_URL}/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        payment_type: 'gopay',
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        customer_details: customer,
        item_details: items,
        gopay: {
          enable_callback: true,
          callback_url: `${process.env.APP_URL || 'http://localhost:3000'}/payments/callback/gopay`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw Object.assign(new Error(`Midtrans error: ${error.status_message || 'Unknown error'}`), {
        statusCode: 502,
      });
    }

    const data = await response.json();
    return {
      token: data.token,
      redirect_url: data.redirect_url,
    };
  }

  static verifyNotification(payload: MidtransNotificationPayload): boolean {
    const signatureKey = crypto
      .createHash('sha512')
      .update(
        `${payload.order_id}${payload.status_code}${payload.gross_amount}${env.MIDTRANS_SERVER_KEY}`,
      )
      .digest('hex');

    return signatureKey === payload.signature_key;
  }

  static isSettled(notification: MidtransNotificationPayload): boolean {
    return (
      notification.transaction_status === 'capture' &&
      notification.fraud_status === 'accept'
    );
  }

  static isExpired(notification: MidtransNotificationPayload): boolean {
    return (
      notification.transaction_status === 'expire' ||
      notification.transaction_status === 'cancel' ||
      notification.transaction_status === 'deny'
    );
  }
}
