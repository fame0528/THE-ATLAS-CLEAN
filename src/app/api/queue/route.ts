import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { QueueInfo } from '@/types/telemetry'

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
    const tasks = db.getTasks(1000)
    const queued = tasks.filter(t => t.status === 'queued')
    const lastCompleted = tasks.find(t => t.status === 'completed')

    const queue: QueueInfo = {
      deliveryQueueCount: queued.length,
      lastProcessedId: lastCompleted?.id,
    }

    return NextResponse.json({ success: true, data: queue })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch queue' },
      { status: 500 }
    )
  }
}
