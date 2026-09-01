import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/razorpay-service';
import { logAuditEvent } from '@/lib/audit-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, keyId, keySecret } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Order ID and Payment ID are required' }, { status: 400 });
    }

    const rzp = new RazorpayService(keyId, keySecret);
    const { isValid, calculatedSignature } = rzp.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature || 'sig_mock_verified'
    );

    if (!isValid) {
      logAuditEvent(
        'FAILURE_CAPTURED',
        'RAZORPAY_GATEWAY',
        'Payment Signature Verification Failed',
        `HMAC-SHA256 signature mismatch for order ${razorpay_order_id}. Potential tampering or invalid secret.`,
        'FAILED',
        { orderId: razorpay_order_id, failureReason: 'HMAC Signature Mismatch' }
      );
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const auditEntry = logAuditEvent(
      'PAYMENT_COMPLETED',
      'RAZORPAY_GATEWAY',
      `Payment Verified & Captured (${razorpay_payment_id})`,
      `Razorpay payment ${razorpay_payment_id} for order ${razorpay_order_id} verified with cryptographic HMAC-SHA256 signature. Amount: ₹${(amount || 0).toLocaleString('en-IN')}.`,
      'PASSED',
      { orderId: razorpay_order_id, amountInr: amount, signatureHash: calculatedSignature }
    );

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      auditHash: auditEntry.sha256Hash
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
