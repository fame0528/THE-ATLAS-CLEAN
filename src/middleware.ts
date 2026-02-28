import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';

const ATLAS_TOKEN = process.env.ATLAS_TOKEN;

/**
 * Middleware: Protect API routes with token auth + rate limiting
 * - All /api/* routes require X-ATLAS-TOKEN header
 * - Rate limiting: 10 req/min for reads, 5 req/min for writes/actions
 * - Health check bypasses auth
 */
export function middleware(request: NextRequest) {
  // Skip non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Health check endpoint - no auth required
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  // Enforce token authentication
  const token = request.headers.get('x-atlas-token');
  if (!token || token !== ATLAS_TOKEN) {
    // Log failure
    logAction('auth_failure', token?.slice(0, 8) || 'unknown', {
      endpoint: request.nextUrl.pathname,
      method: request.method,
      result: 'fail',
      reason: 'Invalid or missing token',
    }).catch(() => {});

    return NextResponse.json(
      { error: 'Unauthorized — invalid or missing ATLAS_TOKEN' },
      { status: 401 }
    );
  }

  // Apply rate limiting for action/write endpoints
  const isActionEndpoint = ['POST','PUT','PATCH','DELETE'].includes(request.method);
  const maxPerMinute = isActionEndpoint ? 5 : 10;
  
  const allowed = checkRateLimit(token, maxPerMinute);
  if (!allowed) {
    // Log rate limit
    logAction('rate_limited', token?.slice(0, 8) || 'unknown', {
      endpoint: request.nextUrl.pathname,
      method: request.method,
      result: 'fail',
      reason: 'Rate limit exceeded',
    }).catch(() => {});

    return NextResponse.json(
      { error: `Rate limit exceeded — maximum ${maxPerMinute} requests per minute` },
      { status: 429 }
    );
  }

  // Log success (async, fire-and-forget)
  logAction('access', token?.slice(0, 8) || 'unknown', {
    endpoint: request.nextUrl.pathname,
    method: request.method,
    result: 'success',
  }).catch(() => {});

  return NextResponse.next();
}

// Apply to all API routes + dashboard routes
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/agents/:path*',
    '/queue/:path*',
    '/memories/:path*',
  ],
};
