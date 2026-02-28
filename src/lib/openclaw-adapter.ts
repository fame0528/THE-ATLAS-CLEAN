const GATEWAY_URL = process.env.OPENCLAW_GATEWAY || 'http://localhost:3333';
const ATLAS_TOKEN = process.env.ATLAS_TOKEN;

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

export async function listAgents() {
  return gatewayFetch('/agents');
}

export async function getStatus() {
  return gatewayFetch('/status');
}

export async function sendTask(agentId: string, payload: object) {
  return gatewayFetch('/queue', {
    method: 'POST',
    body: JSON.stringify({ agent_id: agentId, payload }),
  });
}

export async function getQueue() {
  return gatewayFetch('/queue');
}

export async function searchMemory(query: string, limit = 20) {
  return gatewayFetch('/memory/search?' + new URLSearchParams({ q: query, limit: String(limit) }));
}
