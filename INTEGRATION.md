# Integration Guide — THE ATLAS Clean

This guide explains how each agent should integrate with THE ATLAS telemetry dashboard.

## 🎯 General Principles

- **Clean rebuild**: No code reuse from legacy Atlas agent
- **Local-first**: All data stays within `C:\Users\spenc\.openclaw` allowlist
- **Security-first**: `X-ATLAS-TOKEN` auth on all endpoints
- **Utility-first**: Shared components, clear interfaces
- **Zero external secrets**: Only `.env.local` for local token

---

## 🔒 Ares — Authentication hardening

**Current state**: API routes have a simple `requireAuth()` stub checking `ATLAS_TOKEN` env var.

**Your task**:
1. Replace `requireAuth()` with proper middleware using 1Password vault integration
2. Implement token rotation/revocation if needed
3. Add audit logging for failed auth attempts
4. Consider rate limiting per token

**Files to modify**:
- `src/app/api/*/route.ts` — all four API routes

**Suggested approach**:
```typescript
// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'

export function requireAuth(request: NextRequest): boolean {
  const token = request.headers.get('x-atlas-token')
  // Validate against 1Password secret store
  // Return 401 if invalid
}
```

---

## 📡 Hermes — Gateway Adapter Implementation

**Current state**: `MockOpenClawAdapter` returns sample data.

**Your task**:
1. Implement `RealOpenClawAdapter` with actual OpenClaw gateway API calls
2. Ensure all endpoints return data matching the TypeScript types in `src/types/telemetry.ts`
3. Handle gateway errors gracefully (return `null` for cost if unavailable)
4. Cache results if needed to reduce load

**Files to modify**:
- `src/lib/openclaw-adapter.ts` — fill in `RealOpenClawAdapter` methods

**Expected API contract**:
```typescript
// Gateway endpoints (to be implemented by Hermes)
GET /api/status -> SystemStatus
GET /api/agents -> AgentInfo[]
GET /api/queue -> QueueInfo
GET /api/cost -> CostData | null
```

**Integration steps**:
1. Confirm gateway URL with Atlas (likely `http://localhost:8080` or similar)
2. Check if gateway already has these endpoints; if not, coordinate with Atlas to add them
3. Write adapter methods using `fetch()` with proper error handling
4. Set `useMock: false` in `createOpenClawAdapter()` when ready

---

## 💾 Mnemosyne — Memory Search Integration

**Current state**: Memory health shows basic QMD metrics via mock.

**Your task** (Phase 2):
1. Extend `MemoryHealth` type to include QMD index details (total vectors, last indexed, errors)
2. Add `/api/memory/search` endpoint for performing semantic search
3. Integrate with the actual QMD/Falkor/MemZero service
4. Display search results in a future UI component

**Files to create** (if extending):
- `src/app/api/memory/search/route.ts` — POST search endpoint
- `src/components/memory/SearchPanel.tsx` — UI for search (future)

**Type extensions**:
```typescript
interface MemoryHealth {
  // existing fields...
  qmdStatus: 'healthy' | 'degraded' | 'offline'
  totalVectors: number
  lastIndexTime: Date | null
  searchLatencyMs: number
}
```

---

## ⚒️ Hephaestus — Quick Actions & Audit Logging

**Current state**: Dashboard is read-only; actions are out of scope (Phase 1).

**Your task** (Phase 2):
1. Add POST endpoints for Quick Actions:
   - `POST /api/actions/restart-gateway`
   - `POST /api/actions/savepoint-stop`
   - `POST /api/actions/index-memory`
2. Implement X-ATLAS-TOKEN + Ares approval (interactive prompt or secondary token)
3. Write audit log entries for all actions (who, what, when, result)
4. Add UI buttons in dashboard (locked behind auth)
5. Add confirmation dialogs before executing actions

**Files to create**:
- `src/app/api/actions/[action]/route.ts` — dynamic action handlers
- `src/lib/audit.ts` — audit logging utility
- `src/components/actions/ActionPanel.tsx` — UI for quick actions

**Security requirements**:
- All actions require `X-ATLAS-TOKEN`
- Ares approval (could be secondary token or session-based consent)
- Full audit trail written to WAL (Workflow Activity Log)
- Actions should be idempotent and safe to retry

---

## 🗺️ Atlas — Overall Integration & Routing

**Current state**: Hyperion built the telemetry module as standalone.

**Your tasks**:
1. Mount THE ATLAS under main OpenClaw gateway routing (proxy `/atlas/*` to port 3050)
2. Configure port 3050 to be reserved exclusively for THE ATLAS
3. Coordinate deployment order: Hermes → Ares → Mnemosyne → Hephaestus → Atlas
4. Test full integration with live gateway data
5. Set up reverse proxy (nginx/Traefik) or Cloudflare Malt Worker for external access

**Deployment checklist**:
- [ ] Set `ATLAS_TOKEN` in production environment
- [ ] Configure gateway adapter (Hermes) to point to real OpenClaw API
- [ ] Harden auth (Ares)
- [ ] Enable HTTPS via Cloudflare Malt Worker
- [ ] Configure Docker seccomp profiles
- [ ] Enable audit logging
- [ ] Test all endpoints with live data
- [ ] Verify port 3050 is not exposed to WAN (local-only or through Cloudflare)

---

## 🧪 Testing & Verification

### Manual testing
```bash
# Development
npm run dev
# Visit http://localhost:3050

# Check API endpoints
curl -H "X-ATLAS-TOKEN: test" http://localhost:3050/api/status
curl -H "X-ATLAS-TOKEN: test" http://localhost:3050/api/agents
```

### Expected responses
- All endpoints return `{ success: boolean, data: ... }`
- 401 if `X-ATLAS-TOKEN` missing or invalid
- 500 if gateway unreachable or adapter error

### Type verification
```bash
npm run typecheck  # must be 0 errors
npm run build      # must succeed
```

---

## 📦 Deliverables Checklist

**Hyperion (Telemetry)** — ✅ Complete
- [x] Project scaffold (Next.js + TypeScript + Tailwind)
- [x] Telemetry components (5 components)
- [x] API routes (4 endpoints)
- [x] Mock adapter (ready for Hermes)
- [x] Build verification (0 errors)
- [x] Documentation (README, integration guide)

**Pending (other agents)**:
- [ ] Ares: Auth middleware hardening
- [ ] Hermes: Real gateway adapter implementation
- [ ] Mnemosyne: QMD integration & search endpoint
- [ ] Hephaestus: Quick actions + audit logging
- [ ] Atlas: Final integration & deployment

---

## 🔄 Workflow

1. **Development**: Agents work in their own branches/workspaces
2. **Integration**: Merge changes to `THE-ATLAS-CLEAN` main branch
3. **Testing**: Run `npm run build && npm start` with real gateway
4. **Deployment**: Atlas coordinates production rollout on port 3050

---

**Last updated**: 2026-02-28  
**Maintainer**: Hyperion (Telemetry)  
**FID**: FID-20260228-ATLAS-CLEAN
