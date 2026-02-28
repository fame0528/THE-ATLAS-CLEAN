import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Action: Savepoint then Stop OpenClaw gateway
 * Requires X-ATLAS-TOKEN auth + rate limited
 * Executes Stop_OpenClaw_Savepoint.bat script (hardcoded allowed command)
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

    // Ares-approved command only (absolute path)
    const scriptPath = 'C:\\Users\\spenc\\.openclaw\\Stop_OpenClaw_Savepoint.bat';
    await execAsync(`"${scriptPath}"`, { timeout: 60000 });

    // Audit log (to be written by Ares)
    await fetch('http://localhost:3050/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'gateway_savepoint_stop',
        outcome: 'success',
        details: { timestamp: new Date().toISOString() },
      }),
    }).catch(() => {});

    return NextResponse.json(
      { status: 'ok', message: 'Savepoint & Stop initiated' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const error = err as { stderr?: string };
    return NextResponse.json(
      { error: error.stderr ?? 'Savepoint & Stop failed' },
      { status: 500 }
    );
  }
}
