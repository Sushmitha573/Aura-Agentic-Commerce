import { NextRequest, NextResponse } from 'next/server';
import { runAutonomousBuyerSimulation } from '@/lib/buyer-agent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, constraints } = body;

    const result = runAutonomousBuyerSimulation(goal, constraints);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Simulation failed' }, { status: 500 });
  }
}
