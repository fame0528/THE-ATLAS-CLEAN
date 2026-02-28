import { NextRequest, NextResponse } from 'next/server';
import { restartGateway, triggerSavepoint, runMemoryIndex } from '@/lib/openclaw-adapter';

/**
 * POST /api/actions
 * Protected: requires X-ATLAS-TOKEN (already enforced by middleware)
 *
 * Body: { action: "restart" | "savepoint" | "index" }
 *
 * All actions currently return "not implemented — Ares approval required"
 * until security review completes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action' },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case 'restart':
        result = restartGateway();
        break;
      case 'savepoint':
        result = triggerSavepoint();
        break;
      case 'index':
        result = runMemoryIndex();
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    // Log to audit (TODO: implement audit logger)
    console.log(`[AUDIT] Action: ${action} by: atlas (via API)`);

    return NextResponse.json({
      action,
      success: result.success,
      output: result.output,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Action failed', details: error.message },
      { status: 500 }
    );
  }
}
