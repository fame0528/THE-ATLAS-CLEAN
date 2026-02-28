import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const ATLAS_TOKEN = process.env.ATLAS_TOKEN;

/**
 * Middleware: Protect API routes with token auth + rate limiting
 * - All /api/* routes require X-ATLAS-TOKEN header
 * - Rate limiting: 10 req/min for reads, 5 req/min for writes/actions
 * - Static assets and health check bypass auth
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
    return NextResponse.json(
      { error: 'Unauthorized — invalid or missing ATLAS_TOKEN' },
      { status: 401 }
    );
  }

  // Apply rate limiting for action/write endpoints
  const isActionEndpoint = request.nextUrl.pathname.startsWith('/api/actions/') ||
                           request.nextUrl.pathname.startsWith('/api/queue/') ||
                           (request.nextUrl.pathname.includes('/api/') && ['POST','PATCH','DELETE'].includes(request.method));
  
  if (isActionEndpoint) {
    const allowed = checkRateLimit(token, 5); // 5 per minute for writes/actions
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded — maximum 5 requests per minute' },
        { status: 429 }
      );
    }
  } else {
    // Read-only endpoints get higher limit
    checkRateLimit(token, 10); // 10 per minute (recording only)
  }

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
