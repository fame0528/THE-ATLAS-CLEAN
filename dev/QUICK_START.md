# Quick Start — THE ATLAS CLEAN

**Feature**: Telemetry Dashboard (FID-20260228-ATLAS-CLEAN)  
**Agent**: Hyperion  
**Last worked**: 2026-02-28  
**Status**: ✅ Complete — Ready for team integration

---

## 🚀 Resume Immediately

```bash
# 1. Navigate to project
cd C:\Users\spenc\.openclaw\workspace-hyperion\THE-ATLAS-CLEAN

# 2. Install dependencies (if not done)
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and set ATLAS_TOKEN=your-secure-token

# 4. Start development server
npm run dev
# → Dashboard at http://localhost:3050

# 5. Test API endpoints
curl -H "X-ATLAS-TOKEN: your-token" http://localhost:3050/api/status
```

---

## 📦 Production Deployment

```bash
# Build
npm run build

# Start (production)
npm start
# → Runs on port 3050 by default

# Or with custom port
PORT=3051 npm start
```

**Remember**:
- Set `ATLAS_TOKEN` in production environment
- Configure reverse proxy (nginx/Traefik) or Cloudflare Malt Worker
- Enable HTTPS (Cloudflare)
- Set `OPENCLAW_GATEWAY_URL` if not localhost:8080

---

## 🔄 Key Files

| File | Purpose |
|------|---------|
| `src/lib/openclaw-adapter.ts` | Gateway integration (Hermes responsibility) |
| `src/app/api/*/route.ts` | API endpoints (require X-ATLAS-TOKEN) |
| `src/components/telemetry/Dashboard.tsx` | Main UI |
| `INTEGRATION.md` | Team handoff tasks |
| `docs/API.md` | API reference |

---

## 🐛 Known Issues

1. **Mock data only** — Hermes must implement `RealOpenClawAdapter` for live data
2. **Auth stub** — Ares must replace `requireAuth()` with 1Password integration
3. **No actions** — Phase 2: Hephaestus to add Quick Actions + audit logging
4. **No rate limiting** — Ares to add before production exposure

---

## 📞 Get Help

- **Documentation**: See `docs/` folder
- **Integration guide**: `INTEGRATION.md`
- **API reference**: `docs/API.md`
- **Completion report**: `docs/COMPLETION_REPORT_*.md`
- **QA results**: `docs/QA_RESULTS_*.md`

---

**Feature ID**: FID-20260228-ATLAS-CLEAN  
**Agent**: Hyperion  
**Ready for**: Hermes (adapter) → Ares (auth) → Mnemosyne (memory) → Hephaestus (actions) → Atlas (deploy)

> "Visibility is the light of the empire. We watch together."
