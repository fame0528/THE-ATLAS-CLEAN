# THE ATLAS (Clean Rebuild)

Local-first mission control dashboard for the OpenClaw swarm. Built with Next.js 15, TypeScript, Tailwind, and SQLite.

## Features

- Real-time agent status and heartbeat monitoring
- Task queue visualization and enqueue
- Memory search (local embeddings placeholder)
- Quick actions behind authentication (restart gateway, savepoint-stop, index memory)
- Full audit logging for all sensitive operations
- Clean, dark UI optimized for long monitoring sessions

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
- All writes require token; reads are public for now (may change)

## Data

- Database stored in `./data/atlas.db` (gitignored)
- No runtime state in git
- Audit logs retained indefinitely
- Memory index metadata tracked in DB

## Security

See SECURITY.md.

## API

See API.md.
