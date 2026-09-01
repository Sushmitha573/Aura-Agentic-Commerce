import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  return NextResponse.json({
    schema_version: 'v1',
    name_for_human: 'Aura Agentic Merchant & Razorpay Checkout',
    name_for_model: 'aura_agentic_commerce',
    description_for_human: 'Discover products, negotiate dynamic bundles, and complete bounded Razorpay test-mode purchases.',
    description_for_model: 'Plugin for autonomous AI buyers to query merchant inventory, request margin-gated volume quotes, and execute Razorpay test-mode transactions under NPCI UAP/AP2 protocols.',
    auth: { type: 'none' },
    api: { type: 'openapi', url: `${origin}/api/agent/catalog?format=uap` },
    logo_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=128&q=80',
    contact_email: 'support@aura-gear.internal',
    legal_info_url: `${origin}/legal`
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  });
}
