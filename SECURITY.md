# Security Model — THE ATLAS (Clean)

## Scope

This document covers the security model, threat mitigations, and operational boundaries for the ATLAS mission control dashboard.

## Design Principles

1. **Local-first** — No external services required; all data stays on Spencer's machine.
2. **Zero secrets in repo** — All secrets in `.env.local` (gitignored). No hardcoded credentials.
3. **No runtime state in git** — DB files, logs, and generated artifacts are gitignored.
4. **Explicit API surface** — All endpoints documented and require authentication for sensitive operations.
5. **Least privilege** — Only Ares-approved actions can execute code, restart gateway, or touch filesystem.
6. **Strict allowlists** — Filesystem access limited to `C:\Users\spenc\.openclaw\` tree.
7. **Audit trail** — Every sensitive action logged with timestamp, user (token prefix), and result.

## Authentication

- Single static token `ATLAS_TOKEN` stored server-side in `.env.local`.
- Client must send `X-ATLAS-Token: <token>` for any write or action endpoint.
- Read-only endpoints currently public (may change if needed).
- Token validation performed in `src/lib/auth.ts` middleware.

## Sensitive Actions

All actions in `/api/actions/[type]` require:
- Valid token
- Action type present in `ALLOWED_ACTIONS` whitelist (hardcoded)
- Command execution via `execFile` (no shell) with fixed args

Currently allowed actions:
- `restart-gateway` → `pm2 restart openclaw-gateway`
- `savepoint-stop` → `C:\Path\To\Stop_OpenClaw_Savepoint.bat`
- `index-memory` → `npx openclaw memory index`

Any future action requires Ares approval and code change.

## Filesystem Access

No endpoint currently allows arbitrary file reads or writes. If later needed, all paths will be restricted to:
- `C:\Users\spenc\.openclaw\`
- `C:\Users\spenc\Documents\Projects\THE-ATLAS-CLEAN\data\`

Relative paths within these roots only.

## Rate Limiting

Not yet implemented. To be added per-endpoint to prevent abuse.

## Supply Chain

Dependencies locked to exact versions in `package.json`. Audit with `npm audit` before deployment.

## Deployment

- Run only on Spencer's local machine.
- Do not expose to public internet.
- If remote access needed, use SSH tunnel or Cloudflare Tunnel with strict auth.

## Incident Response

- Check `audit_logs` table for suspicious activity.
- Revoke token by changing `ATLAS_TOKEN` and restarting.
- Database file can be backed up; state can be replayed if needed.

---

Maintained by Hephaestus (Forge Partner). WAL is Law.
