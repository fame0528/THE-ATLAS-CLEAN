# Security Policy — THE ATLAS CLEAN

## Threat Model

1. **Prompt Injection:** Attacker crafts input to extracted system commands
2. **Token Leakage:** ATLAS_TOKEN exposed via client-side code or logs
3. **Command Execution:** Unauthorized gateway/agent control
4. **Path Traversal:** Accessing files outside `C:\Users\spenc\.openclaw\`
5. **DoS:** Flooding endpoints, resource exhaustion

## Controls

### Authentication

All API routes require header:

```
X-ATLAS-TOKEN: <random-256-bit-string>
```

Token stored server-side only (Next.js environment). Never sent to client except as header from server actions.

### Authorization

- **Read endpoints** (`GET /api/*`): Token valid → allow
- **Write endpoints** (`POST /api/gateway/*`, `/api/queue`): Token valid + rate limit
- **Dangerous actions** (`/api/gateway/stop`, `/api/gateway/restart`): Token valid + rate limit + Ares approval required (future multi-sig)

### Rate Limiting

- Mutations: 10 req/min per token
- Search: 30 req/min per token
- Global: 100 req/min per IP

### Filesystem Allowlist

OpenClaw adapter restricted to:

```
C:\Users\spenc\.openclaw\
  ├── memory/
  ├── workspace-*/
  └── agents/
```

Any path outside this tree → reject with 403.

### Secrets

- `.env.local` ignored (git)
- No credentials in source
- `process.env.ATLAS_TOKEN` only server-side
- Token rotation procedure documented in runbooks

### Audit Logging

All actions logged to `logs/audit.log` (rotated daily, not committed):

```
[timestamp] method endpoint token=[hash] ip=[ip] result=[success|fail] reason=[?]
```

### Command Execution Safety

OpenClaw CLI invoked with:

```ts
exec(`openclaw ${cmd}`, {
  stdio: 'pipe',
  env: { OPENCLAWLOCK: '1' },
  timeout: 30000,
})
```

No shell interpolation. Args sanitized. No user-controlled strings in command.

### Dependency Security

- No `eval()` or `new Function()`
- No `child_process` with user input
- All third-party deps audited (`npm audit`)
- Minimal bundle size

## Incident Response

If token compromised:

1. Regenerate token (update `.env.local` + server reload)
2. Review `logs/audit.log` for unauthorized actions
3. Rotate gateway API keys if needed
4. Check WAL for unauthorized WAL entries

## Reporting

Security issues: privately notify Spencer before disclosure.

---

**Status:** Active as of 2026-02-28. Review quarterly.
