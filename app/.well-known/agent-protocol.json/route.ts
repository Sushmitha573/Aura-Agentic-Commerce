import { NextRequest, NextResponse } from 'next/server';
import { generateUAPCatalog } from '@/lib/uap-protocol';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const protocolData = generateUAPCatalog(origin);
  
  return NextResponse.json(protocolData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'X-UAP-Version': '1.0',
      'X-AP2-Compatibility': 'true'
    }
  });
}
