import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { getHealthData } from '@/lib/openclaw'
import { SystemStatus, MemoryHealth } from '@/types/telemetry'

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
    const health = await getHealthData()
    const db = getDB()

    const gatewayOnline = health.gateway?.status === 'online'
    const gatewayVersion = health.atlas?.version

    const proxyOnline = gatewayOnline
    const connectedAgents = health.agents?.total || 0

    const memoryProvider: MemoryHealth['provider'] = (health.memory?.provider as MemoryHealth['provider']) || 'local';
    const indexStatus: MemoryHealth['indexStatus'] = health.memory?.documentCount > 0 ? 'healthy' : 'unknown'
    const lastIndexTime = health.memory?.lastIndexed ? new Date(health.memory.lastIndexed) : null
    const totalDocuments = health.memory?.documentCount || 0

    const tasks = db.getTasks(1000)
    const queued = tasks.filter(t => t.status === 'queued')
    const queue = {
      deliveryQueueCount: queued.length,
    }

    const cost = null

    const systemStatus: SystemStatus = {
      gateway: {
        online: gatewayOnline,
        uptimeSeconds: 0,
        version: gatewayVersion,
      },
      proxy: {
        online: proxyOnline,
        connectedAgents,
      },
      memory: {
        provider: memoryProvider,
        indexStatus,
        lastIndexTime,
        totalDocuments,
      },
      queue,
      cost,
    }

    return NextResponse.json({ success: true, data: systemStatus })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}
