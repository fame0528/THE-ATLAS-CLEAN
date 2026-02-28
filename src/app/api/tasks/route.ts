import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { sendTask as gatewaySendTask, getQueue as gatewayGetQueue } from '@/lib/openclaw-adapter';
import { logAction } from '@/lib/audit';

// GET /api/tasks
// Returns recent tasks from local DB
export async function GET() {
  try {
    const db = getDB();
    const tasks = db.getTasks(50);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// POST /api/tasks
// Enqueue a new task for an agent
export async function POST(request: NextRequest) {
  const token = request.headers.get('X-ATLAS-TOKEN');
  const userId = token ? token.slice(0, 8) : 'anonymous';

  try {
    const body = await request.json();
    const { agent_id, payload } = body;

    if (!agent_id || typeof payload !== 'object') {
      return NextResponse.json(
        { error: 'Missing agent_id or invalid payload' },
        { status: 400 }
      );
    }

    const db = getDB();

    // 1. Create local tracking record
    const taskId = db.createTask(agent_id, payload);

    // 2. Forward to OpenClaw gateway (async, don't block)
    gatewaySendTask(agent_id, {
      ...payload,
      _local_task_id: taskId,
    }).catch((err: any) => {
      console.error('Gateway task submission failed:', err);
      // Mark task as errored in DB
      db.updateTaskStatus(taskId, 'error', err.message);
    });

    // Audit log (fire and forget)
    logAction('task_enqueued', userId, {
      endpoint: '/api/tasks',
      method: 'POST',
      taskId,
      agent_id,
    }, 'success').catch(err => console.error('Audit failed:', err));

    return NextResponse.json({ taskId, status: 'queued' });
  } catch (error: any) {
    // Audit log for failure
    logAction('task_enqueued', userId, {
      endpoint: '/api/tasks',
      method: 'POST',
    }, 'error', error.message).catch(() => {});

    console.error('Task creation failed:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}