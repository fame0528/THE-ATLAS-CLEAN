# THE ATLAS — Clean Rebuild

> Local-first control panel for the NEXUS swarm. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Agent Dashboard**: Real-time status of all agents (Atlas, Ares, Athena, Epimetheus, Hephaestus, Hermes, Hyperion, Kronos, Mnemosyne, Prometheus, Mercury)
- **Cost Monitoring**: Daily spend per provider with soft ($20) and hard ($50) caps
- **Memory Search**: Semantic search across agent workspaces (QMD integration planned)
- **Unified WAL**: Automatic heartbeat writes to both workspace and registry SESSION-STATE.md every 10 minutes
- **Theme Toggle**: Slate black/cyan color scheme with dark mode default

## Quick Start

```bash
cd "C:\Users\spenc\Documents\Projects\THE-ATLAS-CLEAN"
npm install
npm run dev   # port 3050
```

**Production build**:
```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local`:

```bash
ATLAS_API_TOKEN=your_strong_random_token_here
ATLAS_ALLOWED_ROOT=C:\Users\spenc\.openclaw
OPENCLAW_GATEWAY=http://localhost:3333
```

## Project Structure

```
src/
  app/              # Next.js App Router
    api/            # API routes (cost, status, memory/search)
    dashboard/      # Main dashboard page
    layout.tsx      # Root layout with ThemeProvider
  components/       # Reusable UI components
    AgentsPanel.tsx
    CostPanel.tsx
    MemorySearch.tsx
    MetricsPanel.tsx
    QuickActions.tsx
    ThemeProvider.tsx
  hooks/            # Custom React hooks
  lib/              # OpenClaw adapter, telemetry
  types/            # TypeScript interfaces
```

## Architecture

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
- **State Management**: SWR for data fetching, React Context for theme
- **Integration**: OpenClaw gateway for agent orchestration
- **Security**: Filesystem allowlist, X-ATLAS-TOKEN auth, local-only by default

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## Metrics Targets (Perfection Loop)

- TypeScript errors: 0
- Build success: yes
- Test coverage: >90% (planned)
- Lighthouse: >90 (planned)
- Security headers: A+ (planned)
- Accessibility: WCAG AA (planned)

## WAL is Law

All agent state transitions are logged to SESSION-STATE.md with timestamps. Daily notes maintained per agent.

## Status

- ✅ Cost Monitoring Panel implemented
- ✅ Uniform heartbeat across 11 agents
- ✅ Slate/cyan dark-mode UI with toggle
- 🔄 Build and type-check in progress

---

*"Security is the floor of the empire. We build it together."* — Ares
