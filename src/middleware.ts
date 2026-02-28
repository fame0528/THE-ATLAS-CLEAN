import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TOKEN = process.env.ATLAS_API_TOKEN;

/**
 * Middleware: Require X-ATLAS-TOKEN header for all /api/* routes
 * Static assets and public pages are excluded by Next.js middleware config
 */
export function middleware(request: NextRequest) {
  const token = request.headers.get('x-atlas-token');

  // Allow if no token required (e.g., static files, dev tools)
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Require token for all API routes
  if (!token || token !== ALLOWED_TOKEN) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

// Apply to all API routes
export const config = {
  matcher: '/api/:path*',
};
