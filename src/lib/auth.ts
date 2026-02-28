import { NextRequest, NextResponse } from 'next/server'

const ATLAS_TOKEN = process.env.ATLAS_TOKEN

export function verifyToken(token: string | null | undefined): boolean {
  if (!token || !ATLAS_TOKEN) return false
  return token === ATLAS_TOKEN
}

export function getAuthErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Unauthorized', message: 'Invalid or missing X-ATLAS-TOKEN' },
    { status: 401 }
  )
}
