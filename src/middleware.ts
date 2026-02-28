import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { rateLimiter } from '@/lib/security/rate-limiter'
import { auditLogger } from '@/lib/security/audit'
import { verifyToken, getAuthErrorResponse } from '@/lib/auth'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex').substring(0, 16)
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const xri = request.headers.get('x-real-ip')
  if (xri) return xri
  return request.ip || 'unknown'
}

export async function middleware(request: NextRequest) {
  // Only protect /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.headers.get('X-ATLAS-TOKEN')
  if (!token || !verifyToken(token)) {
    // Audit failure
    await auditLogger.log({
      timestamp: new Date().toISOString(),
      method: request.method,
      endpoint: request.nextUrl.pathname,
      tokenHash: hashToken(token || ''),
      ip: getClientIp(request),
      result: 'fail',
      reason: 'Invalid or missing token',
    })
    return getAuthErrorResponse()
  }

  // Rate limiting for mutating methods
  const method = request.method
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const tokenHash = hashToken(token)
    const ip = getClientIp(request)
    if (rateLimiter.isLimited(tokenHash, ip)) {
      await auditLogger.log({
        timestamp: new Date().toISOString(),
        method,
        endpoint: request.nextUrl.pathname,
        tokenHash,
        ip,
        result: 'fail',
        reason: 'Rate limit exceeded',
      })
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      )
    }
  }

  // Audit success (best-effort async)
  const tokenHash = hashToken(token)
  const ip = getClientIp(request)
  auditLogger.log({
    timestamp: new Date().toISOString(),
    method,
    endpoint: request.nextUrl.pathname,
    tokenHash,
    ip,
    result: 'success',
  }).catch(() => {})

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
