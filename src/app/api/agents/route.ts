import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder: Hephaestus will implement real gateway integration
  const agents = [
    { id: 'epimetheus', role: 'Archivist', lastSeen: new Date().toISOString(), state: 'idle' },
    { id: 'atlas', role: 'Orchestrator', lastSeen: new Date().toISOString(), state: 'running' },
    { id: 'hephaestus', role: 'Builder', lastSeen: new Date().toISOString(), state: 'idle' },
    { id: 'ares', role: 'Security', lastSeen: new Date().toISOString(), state: 'idle' },
    // ... other agents
  ];
  return NextResponse.json(agents);
}