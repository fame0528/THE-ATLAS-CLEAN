// OpenClaw Gateway Adapter
// Connects ATLAS to running OpenClaw gateway
// Owner: Hermes (Integration Agent)

const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_URL ?? 'http://localhost:3001';

// Circuit breaker state
let circuitBreaker = {
  failures: 0,
  lastFailure: 0,
  open: false,
};

const FAILURE_THRESHOLD = 5;
const RECOVERY_TIME_MS = 30000; // 30s

/**
 * Execute request with circuit breaker and retry logic
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  // Check circuit breaker
  if (circuitBreaker.open) {
    const now = Date.now();
    if (now - circuitBreaker.lastFailure > RECOVERY_TIME_MS) {
      circuitBreaker.open = false;
      circuitBreaker.failures = 0;
    } else {
      return { error: 'Circuit breaker open - gateway unreachable' };
    }
  }

  // Retry logic
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${GATEWAY_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      // Success - reset circuit breaker
      circuitBreaker.failures = 0;
      const data = await res.json();
      return { data };
    } catch (err) {
      if (attempt === maxRetries) {
        circuitBreaker.failures++;
        circuitBreaker.lastFailure = Date.now();
        if (circuitBreaker.failures >= FAILURE_THRESHOLD) {
          circuitBreaker.open = true;
        }
        return { error: err instanceof Error ? err.message : String(err) };
      }
      await new Promise(r => setTimeout(r, 500 * attempt)); // backoff
    }
  }

  return { error: 'Unreachable' };
}

/**
 * Fetch gateway status
 * GET /api/status
 */
export async function getGatewayStatus() {
  return request<{ online: boolean; uptime?: number; version?: string }>('/api/status');
}

/**
 * Fetch list of agents
 * GET /api/agents
 */
export async function getAgents() {
  return request<Array<{
    id: string;
    role: string;
    workspace: string;
    status: string;
    lastMessageTime?: string;
  }>>('/api/agents');
}

/**
 * Fetch queue depth
 * GET /api/queue
 */
export async function getQueue() {
  return request<{ deliveryQueue: number; lastProcessedId?: string }>('/api/queue');
}

/**
 * Search memory
 * POST /api/memory/search
 */
export async function searchMemory(query: string) {
  return request<Array<{ file: string; lines: string; snippet: string }>>('/api/memory/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

/**
 * Trigger memory index
 * POST /api/memory/index
 */
export async function triggerMemoryIndex() {
  return request<{ status: string }>('/api/memory/index', { method: 'POST' });
}
