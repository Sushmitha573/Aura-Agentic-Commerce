import { NextRequest, NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/audit-store';
import { defaultRazorpayService } from '@/lib/razorpay-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignType, customerEmail, cartValue } = body;

    if (campaignType === 'ABANDONED_CART_RECOVERY') {
      const discountedAmount = Math.round(cartValue * 0.9);
      const linkResult = await defaultRazorpayService.createPaymentLink({
        amount: discountedAmount * 100,
        description: '⚡ Exclusive 10% Cart Recovery Incentive - 15 Min Price Lock',
        customer: {
          name: 'Valued Shopper',
          email: customerEmail || 'shopper@example.com'
        }
      });

      logAuditEvent(
        'FALLBACK_INITIATED',
        'MERCHANT_AGENT',
        'Abandoned Cart Re-engagement Dispatched',
        `Automated recovery campaign dispatched Razorpay Payment Link (${linkResult.short_url}) offering ₹${discountedAmount.toLocaleString('en-IN')} with 15-minute price lock.`,
        'RECOVERED',
        {
          amountInr: discountedAmount,
          recoveryAction: 'Razorpay Smart Payment Link Dispatched'
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Re-engagement campaign dispatched with Razorpay Smart Payment Link',
        paymentLink: linkResult.short_url,
        discountedAmount
      });
    }

    return NextResponse.json({ success: true, message: 'Campaign processed' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
