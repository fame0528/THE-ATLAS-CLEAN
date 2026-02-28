import { NextResponse } from 'next/server';
import { getStatus as getGatewayStatus, listAgents } from '@/lib/openclaw-adapter';

// GET /api/status
// Returns gateway status + agent count
// Protected by middleware
export async function GET() {
  try {
    const [gateway, agents] = await Promise.all([
      getGatewayStatus(),
      listAgents(),
    ]);

    return NextResponse.json({
      gateway: {
        status: gateway.status || 'unknown',
        uptime: gateway.uptime,
        version: gateway.version,
      },
      agents: {
        total: Array.isArray(agents) ? agents.length : 0,
        byRole: groupAgentsByRole(agents),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Status check failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch gateway status',
        details: error.message,
      },
      { status: 503 }
    );
  }
}

function groupAgentsByRole(agents: any[]): Record<string, number> {
  const groups: Record<string, number> = {};
  for (const agent of agents) {
    const role = agent.role || 'unknown';
    groups[role] = (groups[role] || 0) + 1;
  }
  return groups;
}
