import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';

const ATLAS_TOKEN = process.env.ATLAS_TOKEN;

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  const token = request.headers.get('x-atlas-token');
  if (!token || token !== ATLAS_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAction = ['POST','PUT','PATCH','DELETE'].includes(request.method);
  const limit = isAction ? 5 : 10;
  const allowed = await checkRateLimit(token, limit);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
