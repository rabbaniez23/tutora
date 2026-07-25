import crypto from 'node:crypto';
import { env } from '@/config/env';

const IS_SANDBOX = process.env.PAYMENT_MODE === 'sandbox' || !env.XENDIT_SECRET_KEY;

const XENDIT_BASE_URL = IS_SANDBOX
  ? 'https://api.xendit.co'
  : 'https://api.xendit.co';

function getAuthHeader(): string {
  const key = env.XENDIT_SECRET_KEY || 'xnd_test_XXXXXXXXXXXXXXXX';
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`;
}

export interface DisbursementBankCode {
  BANK_BCA: 'BANK_BCA';
  BANK_BNI: 'BANK_BNI';
  BANK_MANDIRI: 'BANK_MANDIRI';
  BANK_BRI: 'BANK_BRI';
  BANK_CIMB: 'BANK_CIMB';
  BANK_PERMATA: 'BANK_PERMATA';
}

export type BankCodeType = keyof DisbursementBankCode | string;

export interface CreateDisbursementRequest {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  description: string;
  referenceId?: string;
}

export interface DisbursementResponse {
  id: string;
  status: string;
  amount: number;
  bank_code: string;
  account_number: string;
  account_holder_name: string;
  description: string;
  created: string;
  completed?: string;
}

export interface XenditWebhookPayload {
  id: string;
  status: string;
  amount: number;
  bank_code: string;
  account_number: string;
  account_holder_name: string;
  description: string;
  reference_id?: string;
  created: string;
  completed?: string;
  signature?: string;
}

export class XenditClient {
  static async createDisbursement(
    request: CreateDisbursementRequest,
  ): Promise<DisbursementResponse> {
    if (IS_SANDBOX) {
      console.log(`[XENDIT SANDBOX] Disbursement: Rp${request.amount} → ${request.bankCode} ${request.accountNumber}`);
      return {
        id: `xendit-disb-${Date.now()}`,
        status: 'PENDING',
        amount: request.amount,
        bank_code: request.bankCode,
        account_number: request.accountNumber,
        account_holder_name: request.accountName,
        description: request.description,
        created: new Date().toISOString(),
      };
    }

    const response = await fetch(`${XENDIT_BASE_URL}/disbursements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify({
        external_id: request.referenceId || `disb-${Date.now()}`,
        amount: request.amount,
        bank_code: request.bankCode,
        account_number: request.accountNumber,
        account_holder_name: request.accountName,
        description: request.description,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as Record<string, unknown>;
      throw Object.assign(new Error(`Xendit error: ${(error.message as string) || 'Unknown error'}`), {
        statusCode: 502,
      });
    }

    return response.json() as Promise<DisbursementResponse>;
  }

  static verifyWebhook(payload: XenditWebhookPayload): boolean {
    if (IS_SANDBOX) return true;

    const callbackToken = env.XENDIT_CALLBACK_TOKEN || '';
    if (!callbackToken) return true;

    const signature = crypto
      .createHmac('sha256', callbackToken)
      .update(`${payload.id}${payload.status}${payload.amount}`)
      .digest('hex');

    return signature === payload.signature;
  }

  static isCompleted(payload: XenditWebhookPayload): boolean {
    return payload.status === 'COMPLETED';
  }

  static isFailed(payload: XenditWebhookPayload): boolean {
    return payload.status === 'FAILED';
  }
}
