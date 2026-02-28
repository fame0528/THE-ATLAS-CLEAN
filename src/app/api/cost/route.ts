import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-atlas-token')
  const expected = process.env.ATLAS_TOKEN
  if (expected && token !== expected) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Cost tracking not implemented yet
  return NextResponse.json({ success: true, data: null })
}
