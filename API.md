# THE ATLAS API Reference

## Base URL

```
http://localhost:3050
```

All endpoints require the header:

```
X-ATLAS-TOKEN: <your-token>
```

## Rate Limits

- Read operations (GET): 10 requests per minute per token
- Write operations (POST/PUT/DELETE): 5 requests per minute per token

## Data Formats

All JSON responses follow this envelope for errors:

```json
{
  "error": "Error message",
  "details": "Optional details"
}
```

Success responses are endpoint-specific.

---

## Endpoints

### GET /api/agents

Returns list of all agents with their current status.

**Response:**

```json
{
  "agents": [
    {
      "id": "researchor-1",
      "role": "researcher",
      "state": "idle",
      "lastSeen": "2026-02-27T23:30:00.000Z",
      "workspace": "C:\\...\\workspace-mercury\\agents\\researchor-1",
      "created": "2026-02-26T12:00:00.000Z"
    }
  ]
}
```

---

### GET /api/memory/search?q={query}

Searches across `MEMORY.md` and all `memory/YYYY-MM-DD.md` files. Returns up to 20 ranked results.

**Query Parameters:**
- `q` (required) — search string

**Response:**

```json
{
  "query": "openclaw",
  "count": 3,
  "results": [
    {
      "file": "MEMORY.md",
      "line": 124,
      "snippet": "...deployment uses the OpenClaw gateway on port 3050...",
      "score": 12
    }
  ]
}
```

---

### GET /api/metrics

Returns aggregated telemetry from local DB and gateway.

**Response:**

```json
{
  "db": {
    "sizeBytes": 15360,
    "agents": 2,
    "tasks": 15,
    "auditLogs": 124
  },
  "gateway": {
    "recentAuditCount": 42
  },
  "timestamp": "2026-02-27T23:41:00.000Z"
}
```

---

### GET /api/tasks

Returns recent tasks from local DB (most recent 50).

**Response:**

```json
{
  "tasks": [
    {
      "id": "task_1740721260000_abc123",
      "agent_id": "researchor-1",
      "status": "queued",
      "payload": { "command": "search", "topic": "token economics" },
      "created_at": "2026-02-27T23:41:00.000Z",
      "completed_at": null,
      "error": null
    }
  ]
}
```

---

### POST /api/tasks

Enqueue a new task for an agent.

**Request Body:**

```json
{
  "agent_id": "researchor-1",
  "payload": {
    "command": "restart",
    "target": "gateway"
  }
}
```

**Response:**

```json
{
  "taskId": "task_1740721260000_abc123",
  "status": "queued"
}
```

---

### GET /api/health

Health check endpoint. No authentication required.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-27T23:41:00.000Z",
  "uptime": 3600
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad request (missing/invalid parameters) |
| 401 | Unauthorized (missing/invalid token) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Gateway/service unavailable |

---

## OpenClaw Adapter Internals

The adapter (`src/lib/openclaw-adapter.ts`) wraps the gateway HTTP API:

| Gateway Endpoint | Method | Adapter Function |
|------------------|--------|------------------|
| `/agents` | GET | `listAgents()` |
| `/status` | GET | `getStatus()` |
| `/gateway/restart` | POST | `restartGateway()` |
| `/gateway/stop` | POST | `stopGateway()` |
| `/gateway/savepoint` | POST | `createSavepoint(label?)` |
| `/queue` | GET | `getQueue()` |
| `/queue` | POST | `sendTask(agentId, payload)` |
| `/memory/search` | GET | `searchMemory(query, limit)` |
| `/audit/logs` | GET | `getAuditLogs(limit)` |

Adapter errors are thrown as exceptions; callers should catch and handle.

---

**Last updated:** 2026-02-27
