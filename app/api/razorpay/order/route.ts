import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/razorpay-service';
import { logAuditEvent } from '@/lib/audit-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes, keyId, keySecret } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const rzp = new RazorpayService(keyId, keySecret);
    const amountInPaise = Math.round(amount * 100);

    const order = await rzp.createOrder({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        agentOrigin: 'AI_AGENTIC_COMMERCE',
        protocol: 'NPCI_UAP',
        ...(notes || {})
      }
    });

    logAuditEvent(
      'RAZORPAY_ORDER_CREATED',
      'RAZORPAY_GATEWAY',
      `Razorpay Order Generated (${order.id})`,
      `Created Razorpay test-mode order for ₹${amount.toLocaleString('en-IN')} (${amountInPaise} paise). Mode: ${order.isMock ? 'Sandbox Simulator' : 'Live Test API'}.`,
      'PASSED',
      { orderId: order.id, amountInr: amount }
    );

    return NextResponse.json({ success: true, order, keyId: rzp.getKeyId() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Razorpay Order Creation Failed' }, { status: 500 });
  }
}
