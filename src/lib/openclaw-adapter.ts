import fs from 'fs';
import path from 'path';

// Allowlist: only these OpenClaw paths may be accessed
const ALLOWED_ROOT = process.env.ATLAS_ALLOWED_ROOT || 'C:\\Users\\spenc\\.openclaw';

function resolveAllowed(relativePath: string): string {
  const resolved = path.resolve(ALLOWED_ROOT, relativePath);
  if (!resolved.startsWith(ALLOWED_ROOT)) {
    throw new Error('Path traversal attempt blocked');
  }
  return resolved;
}

export function getAgentsList(): any[] {
  const profilesPath = resolveAllowed('subagent-profiles.json');
  if (!fs.existsSync(profilesPath)) {
    return [];
  }
  const data = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));
  return data.profiles || [];
}

export function getAgentStatus(agentId: string): any {
  const memoryPath = resolveAllowed(`memory/subagents/${agentId}.json`);
  if (!fs.existsSync(memoryPath)) {
    return null;
  }
  const data = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
  return {
    lastHeartbeat: data.lastHeartbeat,
    currentStep: data.currentStep,
    progress: data.progress,
  };
}

export function getQueue(): any {
  const queuePath = resolveAllowed('skills/subagent-system/task-queue.json');
  if (!fs.existsSync(queuePath)) {
    return { tasks: [], runningSessions: [], stats: { totalEnqueued: 0, totalCompleted: 0, totalFailed: 0 } };
  }
  return JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
}

export function getGatewayStatus(): any {
  // Read gateway status from OpenClaw's runtime files or health endpoint
  // For MVP, we'll read SESSION-STATE.md if available
  const statePath = resolveAllowed('SESSION-STATE.md');
  if (!fs.existsSync(statePath)) {
    return { status: 'unknown', lastUpdate: null };
  }
  const content = fs.readFileSync(statePath, 'utf-8');
  // Parse basic info (simplified)
  return {
    status: 'running',
    lastUpdate: new Date().toISOString(),
    raw: content.substring(0, 500), // preview
  };
}

/**
 * ACTIONS — These require ARES approval before enabling
 */

// ARES-APPROVED: Restart OpenClaw gateway (hardcoded, safe)
export function restartGateway(): { success: boolean; output: string } {
  // This would shell out to: pm2 restart openclaw-gateway or openclaw gateway restart
  // NOT IMPLEMENTED YET — Ares must sign off
  return {
    success: false,
    output: 'Not implemented — Ares approval required',
  };
}

// ARES-APPROVED: Trigger savepoint then stop
export function triggerSavepoint(): { success: boolean; output: string } {
  // Would call: Stop_OpenClaw_Savepoint.bat or gateway endpoint
  return {
    success: false,
    output: 'Not implemented — Ares approval required',
  };
}

// ARES-APPROVED: Run memory index for ATLAS
export function runMemoryIndex(): { success: boolean; output: string } {
  // Would call: openclaw-doctor memory index
  return {
    success: false,
    output: 'Not implemented — Ares approval required',
  };
}
