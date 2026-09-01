import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/razorpay-service';
import { logAuditEvent } from '@/lib/audit-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, customer, keyId, keySecret } = body;

    const rzp = new RazorpayService(keyId, keySecret);
    const amountInPaise = Math.round(amount * 100);

    const link = await rzp.createPaymentLink({
      amount: amountInPaise,
      description: description || 'Agentic Commerce Fallback Payment Link',
      customer: customer || { name: 'Customer', email: 'customer@example.com' }
    });

    logAuditEvent(
      'FALLBACK_INITIATED',
      'RAZORPAY_GATEWAY',
      `Razorpay Smart Payment Link Created (${link.id})`,
      `Created instant recovery payment link: ${link.short_url} for ₹${amount.toLocaleString('en-IN')}.`,
      'RECOVERED',
      { amountInr: amount, recoveryAction: `Payment Link: ${link.short_url}` }
    );

    return NextResponse.json({ success: true, paymentLink: link });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
