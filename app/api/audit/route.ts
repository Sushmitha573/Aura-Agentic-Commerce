import { NextRequest, NextResponse } from 'next/server';
import { getAuditLog, clearAuditLog, calculateAuditMetrics, logAuditEvent } from '@/lib/audit-store';

export async function GET() {
  const logs = getAuditLog();
  const metrics = calculateAuditMetrics();
  return NextResponse.json({ logs, metrics });
}

export async function DELETE() {
  clearAuditLog();
  return NextResponse.json({ success: true, message: 'Audit ledger reset' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = logAuditEvent(
      body.eventType || 'BOUND_EVALUATION',
      body.actor || 'POLICY_GATE',
      body.title || 'Manual Audit Event',
      body.details || '',
      body.policyStatus || 'PASSED',
      body.metadata || {}
    );
    return NextResponse.json({ success: true, entry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
