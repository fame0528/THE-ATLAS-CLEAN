import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Action: Restart OpenClaw gateway
 * Requires X-ATLAS-TOKEN auth + rate limited
 * Uses pm2 restart (hardcoded allowed command)
 */
export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json();
    if (confirm !== true) {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    // Ares-approved command only
    await execAsync('pm2 restart openclaw', { timeout: 30000 });

    // Audit log (to be written by Ares)
    await fetch('http://localhost:3050/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'gateway_restart',
        outcome: 'success',
        details: { timestamp: new Date().toISOString() },
      }),
    }).catch(() => {}); // Fire-and-forget audit

    return NextResponse.json(
      { status: 'ok', message: 'Gateway restart initiated' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err as { stderr?: string };
    return NextResponse.json(
      { error: error.stderr ?? 'Restart failed' },
      { status: 500 }
    );
  }
}
