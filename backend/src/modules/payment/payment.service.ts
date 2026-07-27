import { prisma } from '@/config/database';
import { TOPUP_FEE, WITHDRAW_FEE, MIN_WITHDRAW_AMOUNT } from '@/config/constants';
import { MidtransClient, type MidtransNotificationPayload } from './midtrans.client';
import { XenditClient, type XenditWebhookPayload } from './xendit.client';

export async function createTopup(userId: string, amount: number) {
  if (amount < 10000) {
    throw Object.assign(new Error('Minimum topup is Rp10,000'), { statusCode: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const orderId = `TOPUP-${userId.slice(0, 8)}-${Date.now()}`;
  const totalAmount = amount + TOPUP_FEE;

  const snapResponse = await MidtransClient.createTransaction(
    orderId,
    totalAmount,
    {
      firstName: user.name,
      email: user.email,
      phone: user.phone,
    },
    [
      {
        id: 'topup',
        name: `Top Up Saldo Rp${amount.toLocaleString()}`,
        quantity: 1,
        price: amount,
      },
      {
        id: 'fee',
        name: 'Biaya Admin',
        quantity: 1,
        price: TOPUP_FEE,
      },
    ],
  );

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      walletId: wallet.id,
      type: 'TOPUP',
      amount: BigInt(amount),
      gateway: 'midtrans',
      gatewayRefId: orderId,
      status: 'PENDING',
      description: `Top up Rp${amount.toLocaleString()} via Midtrans`,
    },
  });

  return {
    transactionId: transaction.id,
    snapToken: snapResponse.token,
    redirectUrl: snapResponse.redirect_url,
    amount,
    fee: TOPUP_FEE,
    totalAmount,
  };
}

export async function handleMidtransWebhook(payload: MidtransNotificationPayload) {
  console.log(`[MIDTRANS WEBHOOK] Received: ${JSON.stringify(payload)}`);

  const isValid = MidtransClient.verifyNotification(payload);

  if (!isValid) {
    console.error('[MIDTRANS WEBHOOK] Invalid signature');
    throw Object.assign(new Error('Invalid signature'), { statusCode: 401 });
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      gateway: 'midtrans',
      gatewayRefId: payload.order_id,
      type: 'TOPUP',
    },
  });

  if (!transaction) {
    console.error(`[MIDTRANS WEBHOOK] Transaction not found: ${payload.order_id}`);
    throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  }

  if (transaction.status !== 'PENDING') {
    console.log(`[MIDTRANS WEBHOOK] Transaction already processed: ${transaction.id}`);
    return { alreadyProcessed: true };
  }

  if (MidtransClient.isSettled(payload)) {
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          description: `Top up successful - ${payload.payment_type}`,
        },
      }),
      prisma.wallet.update({
        where: { id: transaction.walletId },
        data: { balance: { increment: transaction.amount } },
      }),
    ]);

    console.log(`[MIDTRANS WEBHOOK] Topup success: ${transaction.id}, Rp${transaction.amount}`);
    return { success: true };
  }

  if (MidtransClient.isExpired(payload)) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'FAILED',
        description: `Payment ${payload.transaction_status}`,
      },
    });

    console.log(`[MIDTRANS WEBHOOK] Payment failed: ${transaction.id}, ${payload.transaction_status}`);
    return { success: false, reason: payload.transaction_status };
  }

  return { success: false, reason: 'Unknown status' };
}

export async function requestWithdraw(
  userId: string,
  amount: number,
  bankCode: string,
  accountNumber: string,
  accountName: string,
) {
  if (amount < MIN_WITHDRAW_AMOUNT) {
    throw Object.assign(
      new Error(`Minimum withdraw is Rp${MIN_WITHDRAW_AMOUNT.toLocaleString()}`),
      { statusCode: 400 },
    );
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  }

  const totalDeduction = amount + WITHDRAW_FEE;

  if (wallet.balance < BigInt(totalDeduction)) {
    throw Object.assign(
      new Error(
        `Insufficient balance. Need Rp${totalDeduction.toLocaleString()} (Rp${amount.toLocaleString()} + Rp${WITHDRAW_FEE.toLocaleString()} fee)`,
      ),
      { statusCode: 400 },
    );
  }

  const referenceId = `WD-${userId.slice(0, 8)}-${Date.now()}`;

  // Debit wallet first
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: BigInt(totalDeduction) } },
    }),
    prisma.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: 'DISBURSEMENT',
        amount: BigInt(amount),
        gateway: 'xendit',
        gatewayRefId: referenceId,
        status: 'PENDING',
        description: `Withdraw Rp${amount.toLocaleString()} to ${bankCode} ${accountNumber}`,
      },
    }),
  ]);

  // Call Xendit disbursement
  const disbursement = await XenditClient.createDisbursement({
    amount,
    bankCode,
    accountNumber,
    accountName,
    description: `Tutora Withdrawal - ${userId}`,
    referenceId,
  });

  // Update transaction with disbursement ID
  await prisma.transaction.update({
    where: {
      id: (
        await prisma.transaction.findFirst({
          where: { gatewayRefId: referenceId },
        })
      )!.id,
    },
    data: {
      gatewayRefId: disbursement.id,
    },
  });

  return {
    disbursementId: disbursement.id,
    status: disbursement.status,
    amount,
    fee: WITHDRAW_FEE,
    totalDeduction,
    bankCode,
    accountNumber,
    accountName,
  };
}

export async function handleXenditWebhook(payload: XenditWebhookPayload) {
  console.log(`[XENDIT WEBHOOK] Received: ${JSON.stringify(payload)}`);

  const isValid = XenditClient.verifyWebhook(payload);

  if (!isValid) {
    console.error('[XENDIT WEBHOOK] Invalid signature');
    throw Object.assign(new Error('Invalid webhook signature'), { statusCode: 401 });
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      gateway: 'xendit',
      gatewayRefId: payload.id,
      type: 'DISBURSEMENT',
    },
  });

  if (!transaction) {
    console.error(`[XENDIT WEBHOOK] Transaction not found: ${payload.id}`);
    throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
  }

  if (transaction.status !== 'PENDING') {
    console.log(`[XENDIT WEBHOOK] Transaction already processed: ${transaction.id}`);
    return { alreadyProcessed: true };
  }

  if (XenditClient.isCompleted(payload)) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'SUCCESS',
        description: `Withdrawal completed to ${payload.bank_code} ${payload.account_number}`,
      },
    });

    console.log(`[XENDIT WEBHOOK] Disbursement success: ${transaction.id}`);
    return { success: true };
  }

  if (XenditClient.isFailed(payload)) {
    // Refund wallet
    const wallet = await prisma.wallet.findUnique({ where: { userId: transaction.userId } });

    if (wallet) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: transaction.amount + BigInt(WITHDRAW_FEE) } },
        }),
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            description: `Disbursement failed: ${payload.status}`,
          },
        }),
        prisma.transaction.create({
          data: {
            userId: transaction.userId,
            walletId: wallet.id,
            type: 'REFUND',
            amount: transaction.amount + BigInt(WITHDRAW_FEE),
            gateway: 'xendit',
            status: 'SUCCESS',
            description: 'Refund: disbursement failed',
          },
        }),
      ]);
    }

    console.log(`[XENDIT WEBHOOK] Disbursement failed: ${transaction.id}, refunding`);
    return { success: false, reason: payload.status };
  }

  return { success: false, reason: 'Unknown status' };
}
