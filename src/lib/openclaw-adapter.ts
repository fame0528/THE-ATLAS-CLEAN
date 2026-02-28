/**
 * OpenClaw Adapter — Higher-level service layer
 * Combines low-level CLI adapter with local DB for task management
 */

import { listAgents, enqueueTask, getPendingTasks } from './openclaw';
import { getDB } from './db';

/**
 * Send a task to the OpenClaw gateway (fire-and-forget)
 * Also creates local task record if needed (but route already does)
 */
export async function sendTask(agentId: string, payload: any): Promise<void> {
  // The low-level enqueueTask expects (agentId, task string, priority)
  // We need to serialize payload as task string. Use JSON.
  const taskString = JSON.stringify(payload);
  await enqueueTask(agentId, taskString, 'normal');
}

/**
 * Get current queue from outbox (pending tasks not yet assigned)
 * Returns array of { agentId, task, priority } from parsing outbox
 */
export async function getQueue() {
  const rawLines = await getPendingTasks();
  // Parse lines like: [timestamp] agent: TASK: [PRIORITY] {json?}
  const tasks = rawLines.map((line, idx) => {
    // Simple parse: after "TASK: [" we have priority then space then rest is task JSON
    const match = line.match(/TASK:\s+\[([A-Z]+)\]\s+(.*)/s);
    if (match) {
      const priority = match[1].toLowerCase() as 'low' | 'normal' | 'high';
      const taskStr = match[2];
      try {
        const task = JSON.parse(taskStr);
        return {
          id: `task-${idx}`,
          agentId: line.split(']')[0].split('[')[1]?.trim() || 'unknown',
          task,
          priority,
          status: 'pending' as const,
          createdAt: line.substring(1, 20), // extract timestamp part
        };
      } catch {
        // not JSON, treat as plain text
        return {
          id: `task-${idx}`,
          agentId: 'unknown',
          task: { text: taskStr },
          priority,
          status: 'pending' as const,
          createdAt: line.substring(1, 20),
        };
      }
    }
    return {
      id: `task-${idx}`,
      agentId: 'unknown',
      task: { text: line },
      priority: 'normal' as const,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
  });
  return tasks;
}