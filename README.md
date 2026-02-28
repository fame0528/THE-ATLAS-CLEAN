# THE ATLAS (Clean Rebuild)

Local-first mission control dashboard for the OpenClaw swarm. Built with Next.js 15, TypeScript, Tailwind, and SQLite.

## Features

- Real-time agent status and heartbeat monitoring
- Task queue visualization and enqueue
- Memory search (OpenClaw integration)
- Quick actions behind authentication (restart gateway, savepoint-stop, index memory)
- Full audit logging for all sensitive operations
- Clean, dark UI optimized for long monitoring sessions
- Live telemetry charts (system health, queue depth)
- Error boundaries and loading states throughout
- Rate limiting and path validation (Ares security)

## Quickstart

```bash
# Install dependencies
npm install

# Copy env template
cp .env.local.example .env.local
# Edit .env.local and set a strong ATLAS_TOKEN

# Run dev server
npm run dev
```

Open http://localhost:3050

## Build

```bash
npm run build
npm start
```

## Architecture

- Next.js App Router (React 19)
- SQLite via better-sqlite3 for structured data
- Tailwind CSS v4 for styling
- Auth via static token in `X-ATLAS-Token` header
- All writes require token; reads are public for now

## Data

- Database stored in `./data/atlas.db` (gitignored)
- No runtime state in git
- Audit logs retained indefinitely
- Memory index metadata tracked in DB

## Security

See SECURITY.md.

## API

See API.md.

## Agent Contributions

This MVP includes contributions from multiple agents:

- **Hermes** — OpenClaw gateway adapter (health, agents, tasks)
- **Mnemosyne** — Memory search integration
- **Ares** — Security hardening (rate limiting, path validation)
- **Kronos** — Ops indicators (cron status, agent health, system score)
- **Hyperion** — Telemetry dashboard (MetricsPanel, ChartWidget)
- **Prometheus** — UX polish (loading, error boundaries)
- **Epimetheus** — Documentation

## Status

MVP in progress. Expected completion: 2026-02-28.

**Current progress:** 9/15 tasks complete (~2500 LOC).

## Development

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

TypeScript strict mode enforced. Zero errors allowed.

## Deployment

Built for localhost (3050) only. For remote access, set up reverse proxy with TLS and restrict by IP.

Never expose `ATLAS_TOKEN` in client logs or browser console.

## License

Private — Not for redistribution.

---

**Built with ECHO v1.3.4 Flawless Protocol** 🔨