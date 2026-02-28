# SECURITY.md

## Threat Model

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| **Prompt injection** (malicious input manipulates agents) | Critical | Medium | All agent input sanitized; no external channels without review |
| **Credential leakage** (API keys in logs/UI) | Critical | Low | Secrets only in `.env.local`; UI never displays keys; logs filtered |
| **Command execution** (arbitrary shell commands) | Critical | Low | No `exec` from UI; hardcoded allowed commands only |
| **Path traversal** (reading arbitrary files) | High | Low | Filesystem allowlist restricted to `C:\Users\spenc\.openclaw\` |
| **XSS** (malicious agent output) | Medium | Medium | React safe by default; no `dangerouslySetInnerHTML` |
| **Replay attacks** (stolen auth token) | Medium | Low | Token static but localhost only; rotate monthly |
| **DoS** (resource exhaustion) | Medium | Low | Rate limiting on action routes; React.memo on heavy components |

---

## Security Controls

### 1. Authentication
- **Every API route** requires `X-ATLAS-TOKEN` header
- Token checked in `src/lib/auth-middleware.ts`
- No client-side token exposure — verified server-side only
- Token stored in `.env.local` as `ATLAS_API_TOKEN`

### 2. Authorization
- **Read-only routes** (agents, status, memory search): allowed for any valid token
- **Action routes** (restart, savepoint, index): require Ares approval (documented in code comments)
- Rate limiting: 10 requests/min per route (implemented per route)

### 3. Filesystem Access
- Allowlist: `C:\Users\spenc\.openclaw\` (configurable via `ATLAS_ALLOWED_ROOT`)
- No arbitrary file reads — only specific JSON files:
  - `subagent-profiles.json`
  - `memory/subagents/*.json`
  - `skills/subagent-system/task-queue.json`
  - `MEMORY.md` (browse mode only)
- All paths normalized and validated against allowlist

### 4. OpenClaw Integration
- **Adapter pattern** (`src/lib/openclaw-adapter.ts`) — no direct shellouts from components
- Read operations: parse JSON files directly
- Write/action operations: use OpenClaw CLI (`openclaw gateway restart`) **only** when Ares has approved the specific command
- No runtime `eval` or `child_process.exec` with user input

### 5. Data Storage
- **No SQLite in MVP** — use file-based JSON store (simpler, no binary files)
- All state stored in `data/` directory (gitignored)
- Audit log: `logs/audit.log` (gitignored, JSON lines)
- Never commit runtime data: `.gitignore` includes `data/`, `logs/`, `*.db`, `*-wal`, `*-shm`

### 6. Dependency Management
- Only official Next.js/React libraries
- No community OpenClaw skills (ADR-2026-006)
- Audit `package.json` before adding any dependency

---

## Incident Response

If any of these events occur:

1. **Unauthorized access** (token leaked, strange IPs)
   - Rotate `ATLAS_API_TOKEN` immediately
   - Check `logs/audit.log` for suspicious actions
   - If actions taken: run `openclaw security scan`

2. **Agent misbehavior** (rogue process, high cost)
   - `quota-enforcer` agent should catch — verify it's running
   - Manual: `openclaw agent stop <id>`
   - Review `memory/subagents/<id>.json` for last tasks

3. **Data corruption** (memory files malformed)
   - Restore from last WAL savepoint (`Stop_OpenClaw_Savepoint.bat`)
   - Rebuild memory index: `openclaw-doctor memory rebuild`

4. **Cost spike** (beyond $50/day)
   - `quota-enforcer` should have killed agents — check logs
   - Manually: `openclaw agent stop --all`
   - Disable API keys in `.env.local` until cause identified

---

## Deployment Checklist

- [ ] `.env.local` set with strong `ATLAS_API_TOKEN` (32+ random chars)
- [ ] `.gitignore` includes `data/`, `logs/`, `.env.local`
- [ ] No secrets in git history: `git secrets --scan`
- [ ] All API routes pass `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Dashboard loads at `http://localhost:3050` with real agent data
- [ ] Auth token required for all `/api/*` routes (test with `curl -H "X-ATLAS-TOKEN: wrong" http://localhost:3050/api/agents` → 401)
- [ ] Filesystem allowlist enforced (try `../` traversal → 403)
- [ ] Audit log created on first action (`logs/audit.log`)

---

## Ares Approval Matrix

| Endpoint | Risk Level | Approved? | Conditions |
|----------|------------|-----------|------------|
| `GET /api/agents` | Low | ✅ | Read-only from `subagent-profiles.json` |
| `GET /api/status` | Low | ✅ | Read gateway status via adapter |
| `GET /api/memory/search` | Low | ✅ | Calls OpenClaw `memory_search` (local only) |
| `POST /api/actions/restart` | Critical | ⚠️ | Requires confirm + Ares signature in code |
| `POST /api/actions/savepoint` | Critical | ⚠️ | Requires confirm + Ares signature in code |
| `POST /api/actions/index` | Medium | ⚠️ | Requires confirm + Ares signature in code |

**No action endpoint may be enabled without Ares code review and explicit `// ARES-APPROVED` comment.**

---

**WAL is Law. Security first, always.**
