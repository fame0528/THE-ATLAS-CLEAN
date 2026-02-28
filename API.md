# API Reference — THE ATLAS

Base URL: `http://localhost:3050/api`

## Authentication

All write and action endpoints require header:

```
X-ATLAS-Token: <token>
```

Read-only endpoints are currently public.

## Endpoints

### Health

`GET /health`

Returns basic system status.

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-02-27T23:45:00.000Z",
  "atlas": {
    "version": "0.1.0",
    "db": { "dbSize": 123, "agentsCount": 2, "tasksCount": 5 }
  },
  "gateway": { "status": "online" },
  "memory": { "provider": "local", "indexed": true }
}
```

### Agents

`GET /agents` — List all registered agents.

Response:

```json
{
  "agents": [
    {
      "id": "hephaestus",
      "role": "Forge",
      "state": "idle",
      "last_message_at": "2026-02-27T23:30:00Z",
      "workspace_path": "C:\\Users\\spenc\\.openclaw\\workspace-hephaestus",
      "created_at": "2026-02-27T22:00:00Z",
      "updated_at": "2026-02-27T23:30:00Z"
    }
  ]
}
```

`POST /agents` — Register or update an agent (auth required)

Body:

```json
{
  "id": "string",
  "role": "string",
  "state": "idle" | "running" | "error",
  "workspace_path": "string (optional)",
  "last_message_at": "ISO 8601 (optional)"
}
```

Response: `{ "success": true, "id": "string" }`

### Tasks

`GET /tasks?agent_id=<string>&limit=50` — List recent tasks

Response:

```json
{
  "tasks": [
    {
      "id": "task_xxx",
      "agent_id": "hephaestus",
      "status": "queued" | "running" | "completed" | "failed",
      "payload": "{}",
      "created_at": "2026-02-27T23:40:00Z",
      "completed_at": "2026-02-27T23:41:00Z",
      "error": null
    }
  ]
}
```

`POST /tasks` — Create a new task (auth required)

Body:

```json
{
  "agent_id": "string",
  "payload": { "type": "command", "command": "..." }
}
```

Response: `{ "success": true, "taskId": "string" }`

### Audit Logs

`GET /audit/logs?limit=100` (auth required)

Returns audit trail of sensitive actions.

Response:

```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2026-02-27T23:45:00Z",
      "endpoint": "/api/actions/restart-gateway",
      "method": "POST",
      "user": "a1b2c3…",
      "action": "action_exec",
      "details": "{ \"type\": \"restart-gateway\", ... }"
    }
  ]
}
```

### Memory Search

`GET /memory/search?q=<string>` — Keyword search over indexed documents (placeholder)

Response:

```json
{
  "query": "example",
  "results": [
    {
      "id": "doc_123",
      "snippet": "…",
      "score": 3
    }
  ]
}
```

`POST /memory/search` — Add a document (future: will require auth)

Body: `{ "content": "string" }`

### Actions (Sensitive)

All require `X-ATLAS-Token`.

`POST /api/actions/restart-gateway` — pm2 restart openclaw-gateway

`POST /api/actions/savepoint-stop` — run savepoint then stop

`POST /api/actions/index-memory` — run memory indexer

Response on success:

```json
{
  "success": true,
  "type": "restart-gateway",
  "stdout": "…",
  "stderr": ""
}
```

---

Full spec may evolve. See source in `/src/app/api/*`. WAL is Law.
