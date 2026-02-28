import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = getDB();
    const health = db.health();
    return NextResponse.json({
      db: {
        sizeBytes: health.dbSize,
        agents: health.agentsCount,
        tasks: health.tasksCount,
        auditLogs: health.auditLogsCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
