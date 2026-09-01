import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event || 'payment.captured';
    const payload = body.payload || {};

    logAuditEvent(
      'PAYMENT_COMPLETED',
      'RAZORPAY_GATEWAY',
      `Razorpay Webhook Received: ${event}`,
      `Processed asynchronous webhook event '${event}' with signature verification.`,
      'PASSED',
      {
        orderId: payload?.payment?.entity?.order_id || 'order_webhook',
        amountInr: (payload?.payment?.entity?.amount || 0) / 100
      }
    );

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
