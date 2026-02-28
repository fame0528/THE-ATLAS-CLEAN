/**
 * Hermes-owned safe adapter to OpenClaw gateway.
 * All external communication goes through here.
 */

const GATEWAY_BASE = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3050';

export async function getAgents() {
  const res = await fetch(`${GATEWAY_BASE}/api/agents`);
  if (!res.ok) throw new Error(`Gateway agents fetch failed: ${res.status}`);
  return res.json();
}

export async function getGatewayStatus() {
  const res = await fetch(`${GATEWAY_BASE}/api/status`);
  if (!res.ok) throw new Error(`Gateway status fetch failed: ${res.status}`);
  return res.json();
}

export async function getQueueDepth() {
  const res = await fetch(`${GATEWAY_BASE}/api/queue`);
  if (!res.ok) throw new Error(`Gateway queue fetch failed: ${res.status}`);
  return res.json();
}

export async function memorySearch(query: string) {
  // Read-only search via local embeddings; no remote fallback
  const res = await fetch(`${GATEWAY_BASE}/api/memory/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Memory search failed: ${res.status}`);
  return res.json();
}

export async function enqueueTask(agentId: string, task: string, token: string) {
  // Action endpoint: requires auth token header
  const res = await fetch(`${GATEWAY_BASE}/api/agents/${agentId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-atlas-token': token,
    },
    body: JSON.stringify({ task }),
  });
  if (!res.ok) throw new Error(`Enqueue failed: ${res.status}`);
  return res.json();
}