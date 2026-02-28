/**
 * OpenClaw Gateway Adapter
 *
 * Provides typed functions to interact with OpenClaw gateway HTTP API.
 * All requests include X-ATLAS-TOKEN for authentication.
 */

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY || 'http://localhost:3333';
const ATLAS_TOKEN = process.env.ATLAS_TOKEN;

/**
 * Internal helper to make authenticated requests to gateway
 */
async function gatewayFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = `${GATEWAY_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(ATLAS_TOKEN && { 'X-ATLAS-TOKEN': ATLAS_TOKEN }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gateway ${res.status}: ${text}`);
  }

  return res.json();
}

/**
 * List all agents known to the gateway
 */
export async function listAgents() {
  return gatewayFetch('/agents');
}

/**
 * Get gateway status and health
 */
export async function getStatus() {
  return gatewayFetch('/status');
}

/**
 * Restart the OpenClaw gateway daemon
 */
export async function restartGateway() {
  return gatewayFetch('/gateway/restart', { method: 'POST' });
}

/**
 * Stop the gateway
 */
export async function stopGateway() {
  return gatewayFetch('/gateway/stop', { method: 'POST' });
}

/**
 * Create a savepoint (checkpoint) for recovery
 */
export async function createSavepoint(label?: string) {
  return gatewayFetch('/gateway/savepoint', {
    method: 'POST',
    body: JSON.stringify({ label: label || `atlas-${Date.now()}` }),
  });
}

/**
 * Enqueue a task for an agent
 */
export async function sendTask(agentId: string, payload: object) {
  return gatewayFetch('/queue', {
    method: 'POST',
    body: JSON.stringify({
      agent_id: agentId,
      payload,
    }),
  });
}

/**
 * Get current queue status
 */
export async function getQueue() {
  return gatewayFetch('/queue');
}

/**
 * Search memory using OpenClaw's memory_search endpoint
 */
export async function searchMemory(query: string, limit = 20) {
  return gatewayFetch('/memory/search?' + new URLSearchParams({
    q: query,
    limit: String(limit),
  }));
}

/**
 * Get recent audit logs from gateway
 */
export async function getAuditLogs(limit = 100) {
  return gatewayFetch(`/audit/logs?limit=${limit}`);
}
