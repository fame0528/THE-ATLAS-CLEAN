import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getAuthErrorResponse } from '@/lib/auth'
import { getAgentLogs } from '@/lib/openclaw'
import { Agent } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('X-ATLAS-TOKEN')
  if (!verifyToken(token)) return getAuthErrorResponse()

  const { id } = await params

  try {
    const logs = await getAgentLogs(id, 50)
    // Mock agent details; in future, parse from `listAgents` + logs
    const agent: Agent = {
      id,
      status: 'active',
      lastSeen: new Date().toISOString(),
      workspace: `C:\\Users\\spenc\\.openclaw\\workspace-${id}`,
    }

    return NextResponse.json({ ...agent, logs: logs.split('\n') })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get agent', message: error.message },
      { status: 500 }
    )
  }
}
