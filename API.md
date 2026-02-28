# API Reference — THE ATLAS CLEAN

Base URL: `http://localhost:3050` (local)

All endpoints require header:

```
X-ATLAS-TOKEN: <token>
```

---

## Status

### `GET /api/status`

Returns gateway and agent summary.

**Response:**

```json
{
  "gateway": {
    "status": "running" | "stopped" | "error",
    "uptime": 12345,
    "version": "0.x.x",
    "lastHeartbeat": "2026-02-28T00:00:00Z"
  },
  "agents": [
    {
      "id": "hermes",
      "status": "active" | "idle" | "error",
      "lastSeen": "2026-02-28T00:00:00Z",
      "workspace": "C:\\...\\workspace-hermes"
    }
  ],
  "queue": {
    "pending": 3,
    "running": 1,
    "failed": 0
  }
}
```

---

## Agents

### `GET /api/agents`

List all agents with basic status.

**Response:** `AgentInfo[]`

### `GET /api/agents/[id]`

Get agent details and recent logs.

**Params:**
- `id` — agent label (e.g., `hermes`)

**Response:**

```json
{
  "id": "hermes",
  "status": "active",
  "workspace": "C:\\...\\workspace-hermes",
  "logs": [
    {
      "timestamp": "2026-02-28T00:00:00Z",
      "level": "info" | "error" | "warn",
      "message": "..."
    }
  ],
  "tasks": [] // recent tasks from WAL/queue
}
```

---

## Task Queue

### `GET /api/queue`

List tasks in the queue.

**Query:**
- `status?` — `pending` | `running` | `completed` | `failed`
- `limit?` — default 50

**Response:** `Task[]`

### `POST /api/queue`

Enqueue a task for an agent.

**Body:**

```json
{
  "agentId": "hermes",
  "task": "Run scan on agents",
  "priority": "low" | "normal" | "high",
  "metadata": {}
}
```

**Response:** `201 Created` + task object.

**Rate limit:** 10/min

---

## Memory Search

### `GET /api/memory/search`

Search OpenClaw memory via QMD.

**Query:**
- `q` — search query (required)
- `limit?` — default 20
- `startDate?` — ISO date
- `endDate?` — ISO date

**Response:**

```json
{
  "results": [
    {
      "file": "memory/2026-02-27.md",
      "snippet": "This is a snippet with <mark>highlighted</mark> terms",
      "score": 0.87,
      "timestamp": "2026-02-27T12:34:56Z"
    }
  ],
  "total": 42,
  "query": "q"
}
```

**Rate limit:** 30/min

---

## Gateway Control

All gateway endpoints require rate limit (5/min) and are logged to audit.

### `POST /api/gateway/restart`

Restart the OpenClaw gateway.

**Response:**

```json
{
  "result": "ok",
  "message": "Gateway restarting..."
}
```

### `POST /api/gateway/stop`

Stop the gateway gracefully.

**Response:**

```json
{
  "result": "ok",
  "message": "Gateway stopped"
}
```

### `POST /api/gateway/savepoint`

Trigger an immediate memory index savepoint (QMD flush).

**Response:**

```json
{
  "result": "ok",
  "message": "Savepoint queued"
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Invalid request body/query |
| 401 | Missing or invalid X-ATLAS-TOKEN |
| 403 | Token valid but operation forbidden |
| 429 | Rate limit exceeded |
| 500 | Internal error (check logs) |
| 503 | Gateway unavailable |

---

## Examples

### cURL

```bash
# Status
curl -H "X-ATLAS-TOKEN: YOUR_TOKEN" http://localhost:3050/api/status

# List agents
curl -H "X-ATLAS-TOKEN: YOUR_TOKEN" http://localhost:3050/api/agents

# Get agent logs
curl -H "X-ATLAS-TOKEN: YOUR_TOKEN" http://localhost:3050/api/agents/hermes

# Search memory
curl -H "X-ATLAS-TOKEN: YOUR_TOKEN" "http://localhost:3050/api/memory/search?q=health"

# Enqueue task
curl -X POST -H "X-ATLAS-TOKEN: YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"agentId":"hermes","task":"Run scan","priority":"high"}' \
  http://localhost:3050/api/queue

# Restart gateway
curl -X POST -H "X-ATLAS-TOKEN: YOUR_TOKEN" http://localhost:3050/api/gateway/restart

# Trigger memory index savepoint
curl -X POST -H "X-ATLAS-TOKEN: YOUR_TOKEN" http://localhost:3050/api/gateway/savepoint
```

---

## Authentication Details

Token is a 256-bit random string stored in `.env.local`:

```
ATLAS_TOKEN=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Server reads from `process.env.ATLAS_TOKEN`. No database lookup.

Client must include header on every request. No session cookies.

---

**Note:** This API runs locally only. Do not expose to public internet without additional auth (VPN recommended).
