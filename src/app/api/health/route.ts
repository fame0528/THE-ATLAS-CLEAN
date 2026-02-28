import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getAuthErrorResponse } from '@/lib/auth'
import { getGatewayStatus, listAgents, indexMemory } from '@/lib/openclaw'

export async function GET(request: NextRequest) {
  const token = request.headers.get('X-ATLAS-TOKEN')
  if (!verifyToken(token)) return getAuthErrorResponse()

  try {
    const [gatewayRaw, agentsRaw] = await Promise.all([
      getGatewayStatus(),
      listAgents(),
    ])

    let gatewayData: any = {}
    try { gatewayData = JSON.parse(gatewayRaw) } catch { gatewayData = { status: 'unknown' } }

    let agentsList: any[] = []
    try { agentsList = JSON.parse(agentsRaw) } catch { agentsList = [] }

    const healthyCount = agentsList.filter((a: any) => a.status === 'active' || a.state === 'idle' || a.state === 'running').length

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      gateway: {
        status: gatewayData.status,
        uptime: gatewayData.uptime || 0,
        version: gatewayData.version || 'unknown',
      },
      agents: {
        total: agentsList.length,
        healthy: healthyCount,
      },
      memory: {
        provider: 'local',
        lastIndexed: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('X-ATLAS-TOKEN')
  if (!verifyToken(token)) return getAuthErrorResponse()

  try {
    const result = await indexMemory()
    return NextResponse.json({
      result: 'ok',
      indexed: result.count,
      message: 'Memory index triggered',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Index failed', message: error.message },
      { status: 500 }
    )
  }
}
