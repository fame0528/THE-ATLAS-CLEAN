# API Documentation — THE ATLAS

All API endpoints require `X-ATLAS-TOKEN` header for authentication.

## Base URL

- Development: `http://localhost:3050`
- Production: `https://atlas.openclaw.ai` (or configured domain)

---

## Endpoints

### GET /api/status

Returns overall system status.

**Response**:
```json
{
  "success": true,
  "data": {
    "gateway": {
      "online": true,
      "uptimeSeconds": 86400,
      "version": "1.0.0"
    },
    "proxy": {
      "online": true,
      "connectedAgents": 11
    },
    "memory": {
      "provider": "local",
      "indexStatus": "healthy",
      "lastIndexTime": "2026-02-27T18:51:00.000Z",
      "totalDocuments": 1247,
      "compressionRatio": 0.78,
      "qmdLatencyMs": 45
    },
    "queue": {
      "deliveryQueueCount": 3,
      "lastProcessedId": "msg-2026-02-27-001",
      "estimatedWaitSeconds": 2
    },
    "cost": {
      "dailySpendUSD": 12.50,
      "dailyBudgetUSD": 50.00,
      "monthlySpendUSD": 275.00,
      "monthlyBudgetUSD": 500.00,
      "providerBreakdown": [
        {
          "provider": "claude",
          "spendUSD": 8.20,
          "tokensUsed": 125000
        }
      ],
      "forecastMonthlyUSD": 375.00
    }
  }
}
```

**Fields**:
- `gateway.online` — boolean, gateway reachable
- `gateway.uptimeSeconds` — number, seconds since last restart
- `gateway.version` — string, gateway version (optional)
- `proxy.online` — boolean, proxy layer online
- `proxy.connectedAgents` — number, agents currently connected
- `memory` — MemoryHealth object (see types)
- `queue` — QueueInfo object (see types)
- `cost` — CostData object or `null` if tracking disabled

---

### GET /api/agents

Returns list of all swarm agents with health information.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "hyperion",
      "role": "Telemetry",
      "workspacePath": "C:\\Users\\spenc\\.openclaw\\agents\\hyperion",
      "state": "running",
      "lastHeartbeat": "2026-02-27T18:50:00.000Z",
      "uptime": 86400
    }
  ]
}
```

**Agent states**:
- `idle` — agent idle, not processing
- `running` — actively processing tasks
- `error` — agent in error state
- `offline` — no recent heartbeat

---

### GET /api/queue

Returns delivery queue depth and processing statistics.

**Response**:
```json
{
  "success": true,
  "data": {
    "deliveryQueueCount": 3,
    "lastProcessedId": "msg-2026-02-27-001",
    "estimatedWaitSeconds": 2
  }
}
```

---

### GET /api/cost

Returns cost tracking data. May return `null` if cost tracking not enabled.

**Response**:
```json
{
  "success": true,
  "data": {
    "dailySpendUSD": 12.50,
    "dailyBudgetUSD": 50.00,
    "monthlySpendUSD": 275.00,
    "monthlyBudgetUSD": 500.00,
    "providerBreakdown": [
      {
        "provider": "claude",
        "spendUSD": 8.20,
        "tokensUsed": 125000
      },
      {
        "provider": "openai",
        "spendUSD": 4.30,
        "tokensUsed": 67000
      }
    ],
    "forecastMonthlyUSD": 375.00
  }
}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**Status codes**:
- `401` — Missing or invalid `X-ATLAS-TOKEN`
- `500` — Internal error (gateway unreachable, adapter failure)

---

## Types Reference

See `src/types/telemetry.ts` for complete TypeScript definitions.

### AgentInfo
```typescript
interface AgentInfo {
  id: string
  role: string
  workspacePath: string
  lastHeartbeat: Date | null
  state: 'idle' | 'running' | 'error' | 'offline'
  uptime?: number
}
```

### MemoryHealth
```typescript
interface MemoryHealth {
  provider: 'local' | 'qdrant' | 'falkor' | 'memzero'
  indexStatus: 'healthy' | 'degraded' | 'offline' | 'unknown'
  lastIndexTime: Date | null
  totalDocuments: number
  compressionRatio?: number
  qmdLatencyMs?: number
}
```

### QueueInfo
```typescript
interface QueueInfo {
  deliveryQueueCount: number
  lastProcessedId?: string
  estimatedWaitSeconds?: number
}
```

### CostData
```typescript
interface CostData {
  dailySpendUSD: number
  dailyBudgetUSD: number
  monthlySpendUSD: number
  monthlyBudgetUSD: number
  providerBreakdown: Array<{
    provider: string
    spendUSD: number
    tokensUsed: number
  }>
  forecastMonthlyUSD?: number
}
```

---

## Authentication

All requests must include header:
```
X-ATLAS-TOKEN: <your-token>
```

Token is set in `.env.local` as `ATLAS_TOKEN`. In production, use a strong random token (256-bit entropy recommended).

---

**Document version**: 1.0  
**Last updated**: 2026-02-28  
**Maintainer**: Hyperion
