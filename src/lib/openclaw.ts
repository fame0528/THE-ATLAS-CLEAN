/**
 * OpenClaw Adapter
 * Wraps CLI commands for gateway status, agents, queue, memory, and cron.
 * All paths validated against allowlist: C:\Users\spenc\.openclaw\
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync, stat } from 'fs';
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
 * Returns raw JSON string
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
 * List agents via `openclaw agents list --json`
 * Returns raw JSON string
 */
export async function listAgents(): Promise<string> {
  try {
    const { stdout } = await execAsync('openclaw agents list --json', { timeout: 10000 });
    return stdout;
  } catch (error: any) {
    console.warn('listAgents fallback:', error.message);
    return '[]';
  }
}

/**
 * Get agent logs
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
 * Enqueue a task
 */
export async function enqueueTask(agentId: string, task: string, priority: 'low' | 'normal' | 'high' = 'normal'): Promise<void> {
  const outboxPath = path.join(ALLOWLIST, 'memory', 'nexus-outbox.md');
  validatePath(outboxPath);

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const entry = `[${timestamp}] hermes: TASK: [${priority.toUpperCase()}] ${task}\n`;

  await writeFile(outboxPath, entry, { flag: 'a' });
}

/**
 * Search memory
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
 * Actions
 */
export async function restartGateway(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw gateway restart', { timeout: 15000 });
    return { stdout, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

export async function stopGateway(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw gateway stop', { timeout: 15000 });
    return { stdout, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

/**
 * Create a savepoint (memory index) only
 */
export async function savepoint(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw memory index --savepoint', { timeout: 30000 });
    return { stdout, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

/**
 * Create a savepoint and then stop the gateway
 */
export async function savepointAndStop(): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout } = await execAsync('openclaw memory index --savepoint', { timeout: 30000 });
    const { stdout: stopOut } = await execAsync('openclaw gateway stop', { timeout: 15000 });
    return { stdout: stdout + '\n' + stopOut, stderr: '' };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}

/**
 * Trigger memory indexing (without savepoint)
 */
export async function indexMemory(): Promise<{ count: number }> {
  try {
    const { stdout } = await execAsync('openclaw memory index', { timeout: 30000 });
    const match = stdout.match(/indexed (\d+)/i);
    const count = match ? parseInt(match[1], 10) : 0;
    return { count };
  } catch (error: any) {
    return { count: 0 };
  }
}

/**
 * Write uniform heartbeat
 */
export async function writeHeartbeat(agentId: string): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const line = `[${timestamp}] ${agentId}: HEARTBEAT status=green\n`;

  const workspacePath = path.join(ALLOWLIST, `workspace-${agentId}`, 'SESSION-STATE.md');
  const agentPath = path.join(ALLOWLIST, `agents`, agentId, 'agent', 'SESSION-STATE.md');
  const dailyDir = path.join(ALLOWLIST, `workspace-${agentId}`, 'memory');
  const dailyFile = path.join(dailyDir, `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}.md`);

  try {
    if (!existsSync(dailyDir)) await mkdir(dailyDir, { recursive: true });
    if (!existsSync(dailyFile)) await writeFile(dailyFile, `# Daily Note — ${now.toDateString()}\n\n`, 'utf8');
  } catch (err: any) {
    errors.push(`daily note creation failed: ${err.message}`);
  }

  try {
    validatePath(workspacePath);
    await writeFile(workspacePath, line, { flag: 'a' });
  } catch (err: any) {
    errors.push(`workspace SESSION-STATE.md write failed: ${err.message}`);
  }

  try {
    validatePath(agentPath);
    await writeFile(agentPath, line, { flag: 'a' });
  } catch (err: any) {
    errors.push(`agent SESSION-STATE.md write failed: ${err.message}`);
  }

  return { success: errors.length === 0, errors };
}

/**
 * Get cron jobs from canonical store
 */
export async function listCronJobs(): Promise<any[]> {
  const storePath = path.join(ALLOWLIST, '.openclaw', 'cron', 'jobs.json');
  try {
    if (!existsSync(storePath)) return [];
    const content = await readFile(storePath, 'utf8');
    const parsed = JSON.parse(content);
    return parsed.jobs || [];
  } catch (error: any) {
    console.warn('listCronJobs error:', error.message);
    return [];
  }
}

/**
 * Get comprehensive health data with real metrics
 */
export async function getHealthData() {
  const nowTs = Date.now();
  const results: any = {
    status: "ok",
    timestamp: new Date().toISOString(),
    atlas: { version: "0.1.0", db: { dbSize: 0, agentsCount: 0, tasksCount: 0 } },
    gateway: { status: "offline", pid: null, memoryMb: null, lastRestart: null },
    agents: { total: 0, healthy: 0 },
    memory: { provider: "local", lastIndexed: null, documentCount: 0 },
    ops: { overall: 0, cronScore: 0, agentScore: 0, wal: {} },
    cron: { total: 0, healthy: 0, jobs: [] },
  };

  // Gateway
  try {
    const gw = await getGatewayStatus();
    results.gateway = {
      status: gw.status || 'online',
      pid: gw.pid || null,
      memoryMb: gw.memoryMb || null,
      lastRestart: gw.lastRestart || null,
    };
  } catch (e) {
    results.gateway.status = 'offline';
  }

  // Agents
  try {
    const agents = await listAgents();
    const total = agents.length;
    const healthy = agents.filter((a: any) => a.state === 'idle' || a.state === 'running').length;
    results.agents = { total, healthy };
    results.atlas.db.agentsCount = total;
  } catch (e) {}

  // Memory document count (approximate)
  try {
    const memoryDir = path.join(ALLOWLIST, 'memory');
    if (existsSync(memoryDir)) {
      const files = await readdir(memoryDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      results.memory.documentCount = mdFiles.length;
      results.atlas.db.dbSize = mdFiles.length;
    }
  } catch (e) {}

  // WAL health for kronos and atlas
  const walAgents = ['kronos', 'atlas'];
  for (const agent of walAgents) {
    const walPath = path.join(ALLOWLIST, `workspace-${agent}`, 'SESSION-STATE.md');
    try {
      if (existsSync(walPath)) {
        const content = await readFile(walPath, 'utf8');
        const lines = content.split('\n').filter(l => l.trim());
        const lastLine = lines[lines.length - 1] || '';
        const match = lastLine.match(/\[(.*?)\]/);
        let ageMin = null;
        if (match) {
          const parsed = Date.parse(match[1]);
          if (!isNaN(parsed)) {
            ageMin = (nowTs - parsed) / 60000;
          }
        }
        results.ops.wal[agent] = { lastLine, ageMin, status: (ageMin !== null && ageMin < 15) ? 'fresh' : 'stale' };
      } else {
        results.ops.wal[agent] = { status: 'missing' };
      }
    } catch (err: any) {
      results.ops.wal[agent] = { status: 'error', error: err.message };
    }
  }

  // Cron jobs health
  try {
    const jobs = await listCronJobs();
    const totalJobs = jobs.length;
    const enabledJobs = jobs.filter((j: any) => j.enabled).length;
    results.cron = { total: totalJobs, healthy: enabledJobs, jobs: jobs.slice(0, 10) };
  } catch (e) {}

  // Weighted scoring (out of 100)
  let score = 0;
  score += (results.gateway.status === 'online') ? 30 : 0;
  if (results.agents.total > 0) score += Math.round((results.agents.healthy / results.agents.total) * 25);
  score += (results.memory.documentCount > 0) ? 15 : 5;
  const walFresh = Object.values(results.ops.wal).filter((s: any) => s.status === 'fresh').length;
  score += walFresh * 10;
  score += (results.cron.healthy > 0) ? 10 : 0;

  results.ops.overall = Math.min(100, score);
  results.ops.cronScore = Math.round((results.cron.healthy / Math.max(1, results.cron.total)) * 100);
  results.ops.agentScore = results.agents.total > 0 ? Math.round((results.agents.healthy / results.agents.total) * 100) : 0;

  return results;
}
