# THE ATLAS — Clean Rebuild
## Local-First Swarm Control Panel

**Port**: 3050  
**Stack**: Next.js 15 + TypeScript + Tailwind  
**Auth**: Single-user token (`X-ATLAS-TOKEN` header)  
**Data**: File-based JSON store (no SQLite until v2)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local and set ATLAS_API_TOKEN to a strong random string

# 3. Start development server
npm run dev

# 4. Open http://localhost:3050
```

---

## Security

- **Zero secrets in repo** — `.env.local` is gitignored
- **All API routes require** `X-ATLAS-TOKEN` header
- **Filesystem allowlist** — only `C:\Users\spenc\.openclaw\` allowed
- **No command execution** — read-only OpenClaw integration until Ares approves actions
- **No runtime state committed** — `.gitignore` excludes logs, DB files, temp data

See `SECURITY.md` for full threat model and incident response.

---

## Architecture

```
THE-ATLAS-CLEAN/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agents/route.ts      # List agents from subagent-profiles.json
│   │   │   ├── status/route.ts      # Gateway + system health
│   │   │   ├── memory/search/route.ts # Query OpenClaw QMD
│   │   │   └── actions/route.ts     # Protected: restart, savepoint, index
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Dashboard home
│   ├── components/
│   │   ├── AgentsPanel.tsx
│   │   ├── MemorySearch.tsx
│   │   ├── MetricsPanel.tsx
│   │   └── QuickActions.tsx
│   └── lib/
│       ├── openclaw-adapter.ts      # Safe OpenClaw integration
│       └── auth-middleware.ts       # X-ATLAS-TOKEN validation
├── data/                            # Local JSON store (gitignored)
├── logs/                            # Audit logs (gitignored)
├── SECURITY.md
├── API.md
└── README.md
```

---

## Agent Roles (MVP)

- **ATLAS** — Owner/Integrator (you)
- **ARES** — Security (me)
- **HEPHAESTUS** — Implementation
- **MNEMOSYNE** — Memory/Search
- **HERMES** — Integration
- **HYPERION** — Telemetry
- **KRONOS** — Ops
- **PROMETHEUS** — UX/Polish
- **EPIMETHEUS** — Docs

---

## Development Phases

**Phase 1** (MVP — this repo):
- Read-only dashboard: agents list, gateway status, memory search
- No actions yet (locked by Ares)

**Phase 2** (after Ares approval):
- Add protected actions: restart gateway, trigger savepoint, memory index
- Audit log for all actions
- Cost monitoring panel

**Phase 3** (mature):
- Cron status indicators
- Advanced metrics charts
- Notion export for reports

---

**WAL is Law. Clean rebuild only.**
