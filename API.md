# API Documentation — THE ATLAS (Clean Rebuild)

## Overview

All `/api/*` endpoints require authentication via `X-ATLAS-TOKEN` header.  
Token must match `ATLAS_API_TOKEN` from `.env.local`.

---

## Endpoints

### `GET /api/agents`

Returns list of all agent profiles with real-time status.

**Response**:
```json
{
  "agents": [
    {
      "id": "researcher",
      "name": "Researcher",
      "role": "Research Specialist",
      "description": "Gathers information...",
      "category": "technical",
      "defaultPriority": "HIGH",
      "icon": "🔬",
      "status": {
        "lastHeartbeat": "2026-02-28T22:00:00.000Z",
        "currentStep": "processing_news",
        "progress": 45
      }
    }
  ]
}
```

### `POST /api/actions/restart`

Restarts the OpenClaw gateway.  
**Requires**: Ares approval (see `SECURITY.md`)  
**Ares-Approved**: ✅

**Request**:
```bash
curl -H "X-ATLAS-TOKEN: $ATLAS_API_TOKEN" -X POST http://localhost:3050/api/actions/restart
```

---

**Notes**:
- This endpoint is **locked** until Ares signs off.
- Only available in `THE-ATLAS-CLEAN`; removed in `THE-ATLAS`.

---

## Future Work

- Add cron status indicator (KRONOS)
- Advanced metrics charts (HYPERION)
- Notion export (EPIMETHEUS)

---

**WAL is Law. Clean rebuild only.**
