import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getAuditLogs as getGatewayAudit } from '@/lib/openclaw-adapter';

// GET /api/metrics
// Returns aggregated telemetry: DB stats + recent gateway audit events
export async function GET() {
  try {
    const db = getDB();
    const dbHealth = db.health();
    const auditLogs = db.getAuditLogs(50);

    // Optionally fetch gateway audit if adapter available
    let gatewayAuditCount = null;
    try {
      const gatewayAudit = await getGatewayAudit(10);
      gatewayAuditCount = Array.isArray(gatewayAudit) ? gatewayAudit.length : 0;
    } catch {
      // Gateway not reachable - ignore
    }

    return NextResponse.json({
      db: {
        sizeBytes: dbHealth.dbSize,
        agents: dbHealth.agentsCount,
        tasks: dbHealth.tasksCount,
        auditLogs: dbHealth.auditLogsCount,
      },
      gateway: {
        recentAuditCount: gatewayAuditCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Metrics collection failed:', error);
    return NextResponse.json(
      { error: 'Failed to collect metrics' },
      { status: 500 }
    );
  }
}
