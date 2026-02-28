import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appendFile } from 'fs/promises';
import { join } from 'path';

// In-memory queue simulation (persisted to file)
const QUEUE_FILE = join(process.cwd(), 'queue-state.json');

/**
 * POST /api/queue/enqueue
 * Enqueue a task template to a specific agent
 * Requires X-ATLAS-TOKEN auth + rate limited (actions)
 * Body: { agentId, taskType, payload }
 */
export async function POST(request: NextRequest) {
  try {
    const { agentId, taskType, payload } = await request.json();

    if (!agentId || !taskType) {
      return NextResponse.json(
        { error: 'Missing required fields: agentId, taskType' },
        { status: 400 }
      );
    }

    // Read current queue
    let queue = [];
    try {
      const existing = await (await import('fs')).promises.readFile(QUEUE_FILE, 'utf-8');
      queue = JSON.parse(existing);
    } catch {
      // File doesn't exist or invalid - start fresh
    }

    // Add task
    const task = {
      id: crypto.randomUUID(),
      agentId,
      type: taskType,
      payload,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    queue.push(task);

    // Persist queue
    await (await import('fs')).promises.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));

    // Audit
    await fetch('http://localhost:3050/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'queue_enqueue',
        agentId,
        details: { taskType, taskId: task.id },
        outcome: 'success',
      }),
    }).catch(() => {});

    return NextResponse.json({ status: 'ok', task }, { status: 200 });
  } catch (err) {
    console.error('Queue enqueue failed:', err);
    return NextResponse.json(
      { error: 'Queue enqueue failed' },
      { status: 500 }
    );
  }
}
