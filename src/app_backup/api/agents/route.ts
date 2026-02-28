import { NextResponse } from 'next/server';
import { getDB, type DBAgent } from '@/lib/db';

export async function GET() {
  try {
    const db = getDB();
    const agents = db.getAgents() as DBAgent[];
    return NextResponse.json({
      agents: agents.map(a => ({
        id: a.id,
        role: a.role,
        state: a.state,
        lastSeen: a.last_message_at || a.updated_at,
        workspace: a.workspace_path,
        created: a.created_at,
      }))
    });
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}
