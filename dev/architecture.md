# Architecture Decisions — THE ATLAS CLEAN

**Project**: Telemetry Dashboard for OpenClaw Swarm  
**Agent**: Hyperion  
**Last updated**: 2026-02-28

---

## ADR-001: Technology Stack Selection

### Decision
Use **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS** for the frontend.

### Rationale
- Next.js provides server components, API routes, and built-in optimization
- TypeScript ensures type safety across the codebase
- Tailwind enables rapid UI development without heavy component library
- All align with OpenClaw's modern stack preferences

### Alternatives Considered
- React + Vite: No server-side rendering or API routes out-of-box
- HeroUI component library: Added bloat; custom Tailwind lighter for telemetry
- **Rejected**: External state management (Redux/Zustand) — unnecessary for simple polling

---

## ADR-002: Data Fetching Strategy

### Decision
Client-side polling with `fetch()` every 10 seconds from `Dashboard` component.

### Rationale
- Real-time requirements low (10s cadence sufficient for telemetry)
- Simple to implement, no WebSocket complexity
- API routes server-rendered on demand, no caching needed yet
- Avoids SWR/stale-while-revalidate complexity for MVP

### Alternatives Considered
- Server-Sent Events (SSE): Overkill for 4 endpoints
- WebSockets: Adds infrastructure complexity
- **Future**: Consider SSE or WebSockets if sub-second updates required

---

## ADR-003: Gateway Communication Abstraction

### Decision
Define `IOpenClawAdapter` interface with `MockOpenClawAdapter` (dev) and `RealOpenClawAdapter` (prod).

### Rationale
- Enables parallel development (Hermes can implement real adapter later)
- Isolates gateway integration to single module
- Easy to swap implementations via factory
- Mock data realistic enough for UI/UX validation

### Alternatives Considered
- Direct `fetch()` calls in each component: Tightly couples UI to gateway, harder to test
- **Rejected**: No abstraction layer would require all components rewritten when real data arrives

---

## ADR-004: Component Architecture

### Decision
Utility-first composition: `TelemetryCard` reused across 4 metric cards; `Dashboard` composes specific components.

### Rationale
- Minimizes code duplication (DRY)
- Consistent styling across all cards
- Easy to add new metrics (just use `TelemetryCard`)
- Follows ECHO's utility-first requirement

### Alternatives Considered
- Separate component for each metric card: More code, inconsistent styling
- **Rejected**: Duplicate display logic would violate DRY

---

## ADR-005: Authentication Stub

### Decision
Simple header comparison: `x-atlas-token === process.env.ATLAS_TOKEN`.

### Rationale
- Fast to implement
- Meets baseline requirement (token required)
- Ares will replace with hardened auth (1Password integration)
- Clear TODOs in code for Ares

### Alternatives Considered
- Full JWT middleware now: Too early, Ares owns security
- **Rejected**: Would duplicate effort when Ares implements proper auth

---

## ADR-006: ErrorBoundary Strategy

### Decision
No `ErrorBoundary` components; show simple error message with retry button in `Dashboard`.

### Rationale
- Only 4 API endpoints, failures rare in dev
- Simpler than per-component error boundaries
- User can retry entire dashboard if any fetch fails
- Future: Add granular error boundaries per component if needed

### Alternatives Considered
- `next/error` page: Overkill, loses dashboard context
- **Rejected**: Full error page would require reload, losing state

---

## ADR-007: Dark Mode Support

### Decision
Tailwind `dark:` variants throughout all components.

### Rationale
- OpenClaw agents operate in varied environments (light/dark)
- Tailwind makes dark mode trivial (`dark:bg-gray-900`)
- System default via `@media (prefers-color-scheme: dark)`
- No toggle needed — follows user OS preference

### Alternatives Considered
- Manual theme toggle: Adds UI complexity, not needed
- **Rejected**: Auto dark mode sufficient for MVP

---

**Total ADRs**: 7  
**Status**: All implemented as decided

---

*Architecture evolves with each feature. Update this document when adding new ADRs.*
