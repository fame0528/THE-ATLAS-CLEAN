# THE ATLAS — Clean Rebuild

Local-first control panel for the 11-agent swarm. Built with Next.js, TypeScript, and Tailwind. Zero legacy code, zero external dependencies beyond local filesystem.

## Features

- **Agents Dashboard** — Real-time view of all agents, their status, and last activity
- **Task Queue** — Enqueue tasks for agents, track completion
- **Memory Search** — Search across MEMORY.md and daily notes (`memory/*.md`)
- **Telemetry** — System metrics, DB health, gateway status
- **OpenClaw Integration** — Adapter for communication with OpenClaw gateway
- **Security** — Token auth (`X-ATLAS-TOKEN`), rate limiting, audit logging
- **Local-first** — All data stored in `./data/` JSON files; no external DB required

## Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/fame0528/THE-ATLAS-CLEAN.git
   cd THE-ATLAS-CLEAN
   npm install
   ```

2. **Configure environment**
   Copy `.env.local.example` to `.env.local` and set:
   ```env
   ATLAS_TOKEN=your-secret-256-bit-token
   NEXT_PUBLIC_ATLAS_TOKEN=your-secret-256-bit-token  # same value, exposed to browser for API calls
   OPENCLAW_GATEWAY=http://localhost:3333  # optional, default
   ```

3. **Configure OpenClaw gateway**
   Ensure OpenClaw gateway is running with matching `ATLAS_TOKEN` in its config.

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3050](http://localhost:3050)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── agents/route.ts      # GET agents list
│   │   ├── memory/search/route.ts  # GET memory search
│   │   ├── metrics/route.ts     # GET telemetry metrics
│   │   └── tasks/route.ts       # GET/POST task queue
│   ├── dashboard/
│   │   ├── agents/page.tsx      # Agents UI
│   │   ├── memories/page.tsx    # Memory search UI
│   │   ├── telemetry/page.tsx   # Metrics UI
│   │   └── tasks/page.tsx       # Task queue UI
│   ├── layout.tsx
│   └── page.tsx                 # Homepage module overview
├── lib/
│   ├── audit.ts                 # File-based audit logger
│   ├── db.ts                    # JSON database wrapper
│   ├── openclaw-adapter.ts      # OpenClaw gateway client
│   └── rate-limit.ts            # In-memory sliding window rate limiter
├── middleware.ts                # Auth + rate limiting + audit
└── types/
    └── agent.ts                 # Agent type definitions
```

## API Reference

All API routes under `/api/*` require the header `X-ATLAS-TOKEN` (value from `.env.local`). Rate limits: 10 req/min for reads, 5 req/min for writes.

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents` | GET | List all agents with status |
| `/api/memory/search?q=query` | GET | Search memory files |
| `/api/metrics` | GET | System telemetry |
| `/api/tasks` | GET | List recent tasks |
| `/api/tasks` | POST | Create new task `{ agent_id, payload }` |

## Security

- **Authentication**: All API routes protected by `X-ATLAS-TOKEN`. Set in `.env.local` and match OpenClaw gateway config.
- **Rate Limiting**: Sliding window in-memory. Read endpoints: 10/min. Write endpoints: 5/min.
- **Audit Logging**: All API requests logged to `./data/audit/audit.log` (append-only JSON lines).
- **Path Allowlist**: File operations restricted to `C:\Users\spenc\.openclaw` (Windows) or appropriate host path.

## Data Storage

- **Local JSON DB**: `./data/atlas.json` stores agents, tasks, audit logs, memory index metadata.
- **Audit Logs**: `./data/audit/audit.log`
- **No external DB required** — fully local-first.

## OpenClaw Gateway Integration

The adapter (`src/lib/openclaw-adapter.ts`) speaks to the OpenClaw gateway on port 3333 (default). It supports:

- `GET /agents` — list agents
- `GET /status` — gateway health
- `POST /gateway/restart` — restart daemon
- `POST /gateway/stop` — stop daemon
- `POST /gateway/savepoint` — create checkpoint
- `POST /queue` — enqueue task
- `GET /queue` — get queue status
- `GET /memory/search` — memory search (forwarded)
- `GET /audit/logs` — fetch audit logs

## Agent Workflow

1. Agents (researchor, monitor, reporter, etc.) run in their own workspaces under `workspace-mercury/agents/`.
2. They register by creating a `SESSION-STATE.md` file. The adapter polls the gateway to discover them.
3. Tasks are enqueued via `/api/tasks` → forwarded to gateway → dispatched to agents.
4. Agents update their `SESSION-STATE.md` with progress; dashboard polls `/api/agents` to reflect status changes.

## Deployment

- **Port**: 3050 (configurable via `--port`)
- **Node**: v18+ recommended
- **Production**: Set `NODE_ENV=production`, run `npm run build` then `npm start`.
- **Reverse Proxy**: Nginx/Apache can proxy to port 3050.

## Development Notes

- **Zero code reuse**: This is a greenfield rebuild. No legacy files, no copy-paste from old project.
- **FLAWLESS protocol**: All changes must pass `npm run type-check` (TypeScript 0 errors) before committing.
- **GUARDIAN checkpoints**: File reading batch size 1–9999; never load full large files into memory.

## License

Private — for team use only.

---

**Built by Mercury (Atlas Team).** 💎
