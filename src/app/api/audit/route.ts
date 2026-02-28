import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { readFile, appendFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Audit log stored in JSONL format (one JSON object per line)
const AUDIT_LOG_PATH = join(process.cwd(), 'audit.log');

/**
 * POST /api/audit
 * Write audit log entry
 * Requires X-ATLAS-TOKEN auth
 * Body: { action, details?, agentId?, outcome: 'success'|'failure', error? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, details = {}, agentId, outcome, error } = body;

    if (!action || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: action, outcome' },
        { status: 400 }
      );
    }

    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
      agentId,
      outcome,
      error: error ?? undefined,
    };

    // Append to audit log (JSONL)
    await appendFile(AUDIT_LOG_PATH, JSON.stringify(entry) + '\n');

    return NextResponse.json({ status: 'ok', entry }, { status: 200 });
  } catch (err) {
    console.error('Audit log write failed:', err);
    return NextResponse.json(
      { error: 'Audit log write failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/audit
 * Read recent audit entries
 * Requires X-ATLAS-TOKEN auth
 * Query: ?limit=100&offset=0
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '100', 10);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);

    if (!existsSync(AUDIT_LOG_PATH)) {
      return NextResponse.json({ entries: [] }, { status: 200 });
    }

    const content = await readFile(AUDIT_LOG_PATH, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    const entries = lines
      .slice(offset, offset + limit)
      .map(line => JSON.parse(line));

    return NextResponse.json(
      { entries, total: lines.length, offset, limit },
      { status: 200 }
    );
  } catch (err) {
    console.error('Audit log read failed:', err);
    return NextResponse.json(
      { error: 'Audit log read failed' },
      { status: 500 }
    );
  }
}
