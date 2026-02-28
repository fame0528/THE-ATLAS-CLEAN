# THE ATLAS — Clean Mission Control

Local-first, secure dashboard for the OpenClaw swarm. Rebuilt from scratch with zero code reuse.

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (styling)
- **Local state only** (no external DB)
- **SQLite or file-based JSON store** (optional, for audit logs)

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
ATLAS_TOKEN=your-secret-token-here
OPENCLAW_GATEWAY_URL=http://localhost:3050
```

3. Run dev server:
```bash
npm run dev
```
Open http://localhost:3050

## Principles
- Local-first: runs entirely on Spencer's machine
- Zero secrets in repo (use `.env.local`)
- No runtime state committed (no sqlite in git)
- All API routes require `X-ATLAS-TOKEN` header
- Filesystem access restricted to `.openclaw` subtree

## Agents & Responsibilities
- **Atlas** — owner/integrator, routing, layout, API docs
- **Ares** — security, auth, threat model, action approvals
- **Hephaestus** — UI components, core endpoints, DB layer
- **Mnemosyne** — memory_search integration, local embeddings only
- **Hermes** — OpenClaw adapter layer (safe gateway communication)
- **Hyperion** — telemetry metrics, dashboard cards
- **Kronos** — cron/heartbeat integration indicators
- **Prometheus** — UX polish, error boundaries
- **Epimetheus** — documentation, README, API.md

## Definition of Done
- `npm run lint` passes
- `npm run build` passes
- No secrets committed
- Dashboard shows real agents + gateway status + memory search
- All action routes require auth + confirm + audit log

---

WAL is Law. Clean rebuild only.