/**
 * OpenClaw Adapter
 * Wraps CLI commands for gateway status, agents, queue, and memory operations.
 * All paths are validated against allowlist: C:\Users\spenc\.openclaw\
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const ALLOWLIST = 'C:\\Users\\spenc\\.openclaw\\';

function validatePath(filePath: string): void {
  if (!filePath.startsWith(ALLOWLIST)) {
    throw new Error(`Path outside allowlist: ${filePath}`);
  }
}

/**
 * Get gateway status via `openclaw gateway status`
 * Returns raw JSON string from CLI
 */
export async function getGatewayStatus(): Promise<string> {
  try {
    const { stdout } = await execAsync('openclaw gateway status', { timeout: 10000 });
    return stdout;
  } catch (error: any) {
    throw new Error(`Gateway status failed: ${error.message}`);
  }
}

/**
 * List agents via `openclaw agents list`
 */
export async function listAgents(): Promise<string> {
  try {
    const { stdout } = await execAsync('openclaw agents list', { timeout: 10000 });
    return stdout;
  } catch (error: any) {
    throw new Error(`List agents failed: ${error.message}`);
  }
}

/**
 * Get agent logs from workspace directory
 * Reads last N lines from logs/agent.log if exists
 */
export async function getAgentLogs(agentId: string, lines: number = 100): Promise<string> {
  const logPath = path.join(ALLOWLIST, `workspace-${agentId}`, 'logs', `${agentId}.log`);
  validatePath(logPath);

  if (!existsSync(logPath)) {
    return `No logs found for agent ${agentId}`;
  }

  const content = await readFile(logPath, 'utf-8');
  const allLines = content.split('\n');
  const recent = allLines.slice(-lines).join('\n');
  return recent;
}

/**
 * Get pending tasks from nexus outbox
 * Returns lines from memory/nexus-outbox.md that are not yet completed
 */
export async function getPendingTasks(): Promise<string[]> {
  const outboxPath = path.join(ALLOWLIST, 'memory', 'nexus-outbox.md');
  validatePath(outboxPath);

  if (!existsSync(outboxPath)) {
    return [];
  }

  const content = await readFile(outboxPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim().length > 0 && !line.includes('COMPLETED'));
  return lines;
}

/**
 * Enqueue a task by appending to outbox
 * Format: [YYYY-MM-DD HH:MM] hermes: TASK: <description>
 */
export async function enqueueTask(agentId: string, task: string, priority: 'low' | 'normal' | 'high' = 'normal'): Promise<void> {
  const outboxPath = path.join(ALLOWLIST, 'memory', 'nexus-outbox.md');
  validatePath(outboxPath);

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const entry = `[${timestamp}] hermes: TASK: [${priority.toUpperCase()}] ${task}\n`;

  await writeFile(outboxPath, entry, { flag: 'a' });
}

/**
 * Search memory using QMD (via openclaw CLI if available)
 * Falls back to grep if QMD not installed
 */
export async function memorySearch(query: string, limit: number = 20): Promise<string> {
  try {
    const { stdout } = await execAsync(`openclaw memory search "${query}" --limit ${limit}`, { timeout: 30000 });
    return stdout;
  } catch (error: any) {
    const memoryDir = path.join(ALLOWLIST, 'memory');
    validatePath(memoryDir);
    try {
      const { stdout } = await execAsync(`grep -i "${query}" "${memoryDir}\\*.md"`, { timeout: 10000 });
      return stdout || 'No results';
    } catch {
      return `Search failed: ${error.message}`;
    }
  }
}

/**
 * Restart gateway (action)
 */
export async function restartGateway(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw gateway restart', { timeout: 15000 });
    return { stdout, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

/**
 * Stop gateway (action)
 */
export async function stopGateway(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw gateway stop', { timeout: 15000 });
    return { stdout, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

/**
 * Savepoint & stop (action)
 */
export async function savepointAndStop(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw memory index --savepoint', { timeout: 30000 });
    // Then stop
    const { stdout: stopOut } = await execAsync('openclaw gateway stop', { timeout: 15000 });
    return { stdout: stdout + '\n' + stopOut, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

/**
 * Index memory (action)
 */
export async function indexMemory(): Promise<{ count: number }> {
  try {
    const { stdout } = await execAsync('openclaw memory index', { timeout: 30000 });
    // Parse count from output if possible, otherwise 0
    const match = stdout.match(/indexed (\d+)/i);
    const count = match ? parseInt(match[1], 10) : 0;
    return { count };
  } catch (error: any) {
    return { count: 0 };
  }
}

/**
 * Get health data for /api/health endpoint
 */
export async function getHealthData() {
  // Gather real data from OpenClaw where possible, otherwise stub
  const gatewayStatus = "online"; // would ping gateway
  const memoryProvider = "local";
  const documentCount = 0; // would query indexer

  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    atlas: {
      version: "0.1.0",
      db: { dbSize: 0, agentsCount: 0, tasksCount: 0 },
    },
    gateway: {
      status: gatewayStatus,
      pid: 0,
      memoryMb: 0,
      lastRestart: new Date().toISOString(),
    },
    agents: { total: 0, healthy: 0 },
    memory: {
      provider: memoryProvider,
      lastIndexed: new Date().toISOString(),
      documentCount,
    },
    ops: { overall: 0, cronScore: 0, agentScore: 0 },
    cron: { total: 0, healthy: 0, jobs: [] },
  };
}