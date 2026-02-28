# FID: THE-ATLAS-MVP-COMPLETION

## Overview
Complete the THE ATLAS clean rebuild MVP by implementing remaining agent contributions (Hermes, Mnemosyne, Ares, Hyperion, Kronos, Prometheus, Epimetheus), integrating with OpenClaw gateway, and achieving working deployment at localhost:3050.

## Acceptance Criteria

✅ **All acceptance criteria MUST be met for completion:**

1. **Hermes Adapter Complete**
   - `/api/health` returns real gateway status (pm2 status, gateway PID, uptime)
   - `/api/agents` returns live agent list from OpenClaw registry/workspace scanning
   - `/api/tasks` returns live task queue from OpenClaw delivery system
   - Task state updates flow bidirectionally (Hermes polls OpenClaw and updates DB)

2. **Mnemosyne Memory Integration**
   - `/api/memory/search` calls real `memory_search` via OpenClaw CLI/gateway
   - Uses local embeddings only (no remote fallback)
   - "Index now" action endpoint implemented and working
   - Search results show file paths + snippets properly

3. **Ares Security Hardening**
   - Rate limiting on all API routes (10 req/min default)
   - Command path validation (ALLOWED_ACTIONS paths exist on disk)
   - Filesystem access allowlist enforcement (C:\Users\spenc\.openclaw\ only)
   - Token length/format validation

4. **Hyperion Telemetry**
   - Dashboard shows real-time metrics: gateway uptime, agent heartbeat intervals, queue depth trends
   - Simple charts (CSS-based or lightweight SVG) for last 24h activity
   - Cost panel if OpenClaw exposes spend data

5. **Kronos Ops Indicators**
   - Cron status: "Running" / "Stale" indicator per cron job
   - Heartbeat health: agent last seen < threshold

6. **Prometheus UX Polish**
   - Loading states for all data fetches
   - Error boundaries on pages
   - Empty states with helpful messages
   - Responsive design (mobile-friendly)

7. **Epimetheus Documentation**
   - API.md complete (all endpoints documented)
   - README updated with setup instructions
   - SECURITY.md reviewed and complete

8. **Integration & Testing**
   - All TypeScript errors fixed (`npx tsc --noEmit` passes)
   - Lint passes (`npm run lint`)
   - Build succeeds (`npm run build`)
   - Dashboard loads and shows real data (no placeholders)
   - All actions behind auth and audit log

9. **Deployment**
   - `.env.local` created with strong `ATLAS_TOKEN`
   - `npm install` completes without errors
   - `npm run dev` starts on port 3050
   - Dashboard accessible at http://localhost:3050

## Implementation Approach

1. **Pattern Discovery** - Examine existing code in THE ATLAS for patterns to follow
2. **Backend-Frontend Contracts** - Verify API shapes before implementing UI components
3. **Sequence**: Types → Utils → Models → API → Hooks → Components (per Flawless Protocol)
4. **Atomic Tasks**: Break into 10-15 tasks, execute one at a time
5. **TypeScript Verification** - Run after each task and at completion

## Dependencies

- OpenClaw gateway running (for Hermes to connect)
- MoonDev repo (for memory search integration)
- Existing THE ATLAS scaffold (commit c0eade8)

## Files to Modify/Create

**Backend:**
- `src/lib/adapters/hermes.ts` (new) - OpenClaw gateway adapter
- `src/lib/adapters/mnemosyne.ts` (new) - Memory search integration
- `src/lib/security/rate-limit.ts` (new) - Rate limiting middleware
- `src/lib/security/validate-paths.ts` (new) - Path allowlist validation
- `src/app/api/health/route.ts` (modify) - Hermes real status
- `src/app/api/agents/route.ts` (modify) - Hermes live agents
- `src/app/api/tasks/route.ts` (modify) - Hermes live tasks
- `src/app/api/memory/search/route.ts` (modify) - Mnemosyne real search
- `src/app/api/actions/[type]/route.ts` (modify) - Ares path validation

**Frontend:**
- `src/components/MetricsPanel.tsx` (modify) - Hyperion telemetry
- `src/components/AgentCard.tsx` (new) - Better agent display
- `src/components/TaskCard.tsx` (new) - Better task display
- `src/components/ChartWidget.tsx` (new) - Simple charts
- `src/components/LoadingSpinner.tsx` (new) - Shared loading component
- `src/hooks/useHealth.ts` (new) - SWR hook for health
- `src/hooks/useAgents.ts` (new) - SWR hook for agents
- `src/hooks/useTasks.ts` (new) - SWR hook for tasks

**Documentation:**
- `docs/IMPLEMENTATION_GUIDE_THE_ATLAS_MVP.md` (new)
- `docs/QA_RESULTS_THE_ATLAS_MVP.md` (new)
- `docs/COMPLETION_REPORT_THE_ATLAS_MVP.md` (auto-generated)

## Out of Scope

- Building worker factory (separate FID)
- Qdrant vector DB integration (beyond MVP)
- WebSocket real-time updates (polling sufficient for MVP)
- Multi-user auth (single-user token only)

## Success Metrics

- 0 TypeScript errors
- Build time < 60 seconds
- All pages load without errors
- Real data visible from OpenClaw
- All actions audited and secured

---

**FID Created:** THE-ATLAS-MVP-COMPLETION  
**Priority:** P0 (critical for swarm operations)  
**Complexity:** 4 (multiple agents, integrations)  
**Estimated LOC:** 2,500-3,500  
