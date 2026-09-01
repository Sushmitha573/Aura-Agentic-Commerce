import { NextRequest, NextResponse } from 'next/server';
import { searchCatalog } from '@/lib/catalog-data';
import { generateUAPCatalog } from '@/lib/uap-protocol';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'uap';
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  if (format === 'uap') {
    const origin = req.nextUrl.origin;
    const uapCatalog = generateUAPCatalog(origin);
    return NextResponse.json(uapCatalog, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Agent-Protocol': 'NPCI_UAP/1.0',
        'X-Agent-Commerce': 'AP2/2026'
      }
    });
  }

  const items = searchCatalog(query, category);
  return NextResponse.json({ count: items.length, items });
}
