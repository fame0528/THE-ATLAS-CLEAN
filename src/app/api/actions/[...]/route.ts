import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { restartGateway, savepointAndStop, indexMemory, stopGateway } from "@/lib/openclaw";
import { logAction } from "@/lib/audit";

function getUserId(token: string | null): string {
  return token?.slice(0, 8) || 'anonymous';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const token = request.headers.get("X-ATLAS-TOKEN");
  if (!verifyToken(token)) {
    // Audit failure
    await logAction('unauthorized_action', getUserId(token), { endpoint: '/api/actions/*' }, 'error', 'Invalid token')
      .catch(() => {});
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserId(token);
  const { action } = await params;
  const type = action[0] as 'restart-gateway' | 'savepoint-stop' | 'index-memory' | 'stop-gateway';

  try {
    let result: any;

    switch (type) {
      case "restart-gateway": {
        result = await restartGateway();
        await logAction('restart-gateway', userId, { endpoint: '/api/actions/restart-gateway' }, 'success');
        break;
      }
      case "savepoint-stop": {
        result = await savepointAndStop();
        await logAction('savepoint-stop', userId, { endpoint: '/api/actions/savepoint-stop' }, 'success');
        break;
      }
      case "index-memory": {
        result = await indexMemory();
        await logAction('index-memory', userId, { endpoint: '/api/actions/index-memory', count: result.count }, 'success');
        break;
      }
      case "stop-gateway": {
        result = await stopGateway();
        await logAction('stop-gateway', userId, { endpoint: '/api/actions/stop-gateway' }, 'success');
        break;
      }
      default:
        await logAction('unknown_action', userId, { endpoint: '/api/actions/*', attempted: type }, 'error', 'Unknown action');
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, type, ...result });
  } catch (error: any) {
    const errMsg = error.message || String(error);
    await logAction(type, userId, { endpoint: `/api/actions/${type}` }, 'error', errMsg).catch(() => {});
    return NextResponse.json(
      { error: "Action failed", message: errMsg },
      { status: 500 }
    );
  }
}