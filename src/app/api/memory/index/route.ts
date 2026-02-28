import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { triggerMemoryIndex } from '@/lib/openclaw/client';

export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json();
    if (confirm !== true) {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    const result = await triggerMemoryIndex();

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Audit log
    await fetch('http://localhost:3050/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'memory_index',
        outcome: 'success',
        details: { timestamp: new Date().toISOString() },
      }),
    }).catch(() => {});

    return NextResponse.json(
      { status: 'ok', message: 'Memory index started' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err as { stderr?: string };
    return NextResponse.json(
      { error: error.stderr ?? 'Memory index failed' },
      { status: 500 }
    );
  }
}
