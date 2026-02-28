import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Resolve paths relative to workspace-mercury
const WORKSPACE_ROOT = join(process.cwd(), '..', '..', 'workspace-mercury');
const MEMORY_DIR = join(WORKSPACE_ROOT, 'memory');
const ROOT_MEMORY = join(WORKSPACE_ROOT, 'MEMORY.md');

/**
 * Simple text search across memory files
 * - Searches all .md files in memory/ directory
 * - Also searches root MEMORY.md
 * - Returns up to 20 matches with filename and snippet
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json(
      { error: 'Missing query parameter: q' },
      { status: 400 }
    );
  }

  const results: Array<{
    file: string;
    line: number;
    snippet: string;
    score: number;
  }> = [];

  const lowerQuery = query.toLowerCase();

  try {
    // Helper to search a single file
    const searchFile = async (filePath: string, baseName: string) => {
      if (!existsSync(filePath)) return;
      
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(lowerQuery)) {
          const count = (line.match(new RegExp(lowerQuery, 'gi')) || []).length;
          const score = count + (line.toLowerCase() === lowerQuery ? 10 : 0);
          
          const pos = line.toLowerCase().indexOf(lowerQuery);
          const start = Math.max(0, pos - 40);
          const end = Math.min(line.length, pos + lowerQuery.length + 40);
          const snippet = (start > 0 ? '...' : '') + line.slice(start, end) + (end < line.length ? '...' : '');
          
          results.push({
            file: baseName,
            line: index + 1,
            snippet,
            score,
          });
        }
      });
    };

    // Search root MEMORY.md
    await searchFile(ROOT_MEMORY, 'MEMORY.md');

    // Search all memory/*.md files
    if (existsSync(MEMORY_DIR)) {
      const files = await readdir(MEMORY_DIR);
      for (const file of files) {
        if (file.endsWith('.md')) {
          await searchFile(join(MEMORY_DIR, file), file);
        }
      }
    }

    // Sort by score descending, take top 20
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, 20);

    return NextResponse.json({
      query,
      count: topResults.length,
      results: topResults,
    });

  } catch (error) {
    console.error('Memory search failed:', error);
    return NextResponse.json(
      { error: 'Search failed', details: String(error) },
      { status: 500 }
    );
  }
}
