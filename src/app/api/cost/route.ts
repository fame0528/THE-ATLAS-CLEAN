import { NextRequest, NextResponse } from 'next/server'
import { createOpenClawAdapter } from '@/lib/openclaw-adapter'

function requireAuth(request: NextRequest): boolean {
  const token = request.headers.get('x-atlas-token')
  const expected = process.env.ATLAS_TOKEN
  return expected ? token === expected : true
}

export async function GET(request: NextRequest) {
  if (!requireAuth(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const adapter = createOpenClawAdapter({
      gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:8080',
      token: process.env.ATLAS_TOKEN || '',
    })

    const cost = await adapter.getCostData()
    return NextResponse.json({ success: true, data: cost })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
