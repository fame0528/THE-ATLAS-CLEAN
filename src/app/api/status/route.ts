import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder: real gateway status from `/api/status`
  const status = {
    gateway: 'online',
    uptime: 'unknown',
    version: '0.0.1-clean',
    agentsOnline: 4,
    memoryIndex: 'not-run',
    queueDepth: 0,
  };
  return NextResponse.json(status);
}