import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { searchMemory } from '@/lib/openclaw/client';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query string required' },
        { status: 400 }
      );
    }

    const result = await searchMemory(query);

    if (result.error) {
      return NextResponse.json(
        { results: [], error: result.error },
        { status: 200 } // Don't fail - just show no results
      );
    }

    return NextResponse.json({ results: result.data ?? [] }, { status: 200 });
  } catch (err) {
    console.error('Memory search error:', err);
    return NextResponse.json(
      { error: 'Memory search failed', results: [] },
      { status: 500 }
    );
  }
}
