import { NextRequest, NextResponse } from 'next/server';
import { evaluateFinancialTransaction, DEFAULT_MERCHANT_POLICY } from '@/lib/policies';
import { logAuditEvent } from '@/lib/audit-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, requestedDiscountPercent = 0, buyerBudget = 25000 } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const evaluation = evaluateFinancialTransaction(
      items,
      requestedDiscountPercent,
      DEFAULT_MERCHANT_POLICY,
      buyerBudget
    );

    logAuditEvent(
      'PRICE_QUOTE',
      'POLICY_GATE',
      'Agent Price Quote Generated',
      `Generated quote for ${items.length} items. Total: ₹${evaluation.finalPayableInr.toLocaleString('en-IN')} (${evaluation.grossMarginPercent}% margin). Decision: ${evaluation.explanation.decision}`,
      evaluation.isMarginSafe ? 'PASSED' : 'WARNING',
      {
        amountInr: evaluation.finalPayableInr,
        marginPercent: evaluation.grossMarginPercent,
        discountPercent: evaluation.proposedDiscountPercent,
        buyerBudget
      }
    );

    return NextResponse.json({ success: true, quote: evaluation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
