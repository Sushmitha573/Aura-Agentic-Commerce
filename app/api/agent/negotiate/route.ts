import { NextRequest, NextResponse } from 'next/server';
import { processMerchantSalesIntelligence } from '@/lib/merchant-agent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message = '', cartSkus = [], proposedDiscount = 0, buyerBudget = 20000 } = body;

    const response = processMerchantSalesIntelligence(
      message,
      cartSkus,
      proposedDiscount,
      buyerBudget
    );

    return NextResponse.json({ success: true, ...response });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing sales intelligence' }, { status: 500 });
  }
}
