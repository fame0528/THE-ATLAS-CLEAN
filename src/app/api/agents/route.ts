import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { AgentInfo, AgentState } from '@/types/telemetry'

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-atlas-token')
  const expected = process.env.ATLAS_TOKEN
  if (expected && token !== expected) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const db = getDB()
    const agents = db.getAgents()

    const agentInfos: AgentInfo[] = agents.map(a => ({
      id: a.id,
      role: a.role,
      workspacePath: a.workspace_path,
      lastHeartbeat: a.last_message_at ? new Date(a.last_message_at) : null,
      state: a.state as AgentState,
      uptime: 0,
    }))

    return NextResponse.json({ success: true, data: agentInfos })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}
