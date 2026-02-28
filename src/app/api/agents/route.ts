import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import type { Agent } from '@/types/agent';

// GET /api/agents
// Returns list of all agents with their status
// Protected by middleware (requires X-ATLAS-TOKEN)
export async function GET() {
  try {
    const db = getDB();
    const agents = db.getAgents() as Agent[];

    // Transform to API format
    const result = agents.map(agent => ({
      id: agent.id,
      role: agent.role,
      state: agent.state,
      lastSeen: agent.last_message_at || agent.updated_at || null,
      workspace: agent.workspace_path,
      created: agent.created_at || agent.updated_at,
    }));

    return NextResponse.json({ agents: result });
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
