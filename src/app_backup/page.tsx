import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          THE ATLAS <span className="text-lg font-normal" style={{ color: 'var(--muted-foreground)' }}></span>
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Swarm Control Panel — Local-First Dashboard</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard title="Gateway" status="unknown" />
          <StatusCard title="Agents" status="0 online" />
          <StatusCard title="Memory Index" status="idle" />
          <StatusCard title="Queue Depth" status="0" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard title="Agents Panel" status="implemented" assignee="Hephaestus" href="/dashboard/agents" />
          <ModuleCard title="Memory Search" status="implemented" assignee="Mnemosyne" href="/dashboard/memories" />
          <ModuleCard title="OpenClaw Adapter" status="implemented" assignee="Hermes" />
          <ModuleCard title="Telemetry" status="implemented" assignee="Hyperion" href="/dashboard/telemetry" />
          <ModuleCard title="Task Queue" status="implemented" assignee="Kronos" href="/dashboard/tasks" />
          <ModuleCard title="UX Polish" status="pending" assignee="Prometheus" />
        </div>
      </section>

      <footer className="pt-4 border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        <p className="text-sm">Built with Next.js + TypeScript + Tailwind | Local-first</p>
      </footer>
    </div>
  );
}

function StatusCard({ title, status }: { title: string; status: string | number }) {
  return (
    <div className="card" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}>
      <h3 className="text-sm uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{title}</h3>
      <p className="text-2xl font-bold mt-2" style={{ color: 'var(--foreground)' }}>{status}</p>
    </div>
  );
}

function ModuleCard({ title, status, assignee, href }: { title: string; status: string; assignee: string; href?: string }) {
  const colors: Record<string, string> = { pending: '#eab308', implemented: '#22c55e', error: '#ef4444' };
  const color = colors[status] || '#9ca3af';
  return (
    <div className={`card ${href ? 'hover:border-cyan-400 transition-colors cursor-pointer' : ''}`} style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}>
      <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
      <p className="text-sm mt-1" style={{ color }}>● {status}</p>
      <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>Owner: {assignee}</p>
      {href && <div className="mt-3"><Link href={href} className="text-cyan-400 hover:underline text-sm">Open →</Link></div>}
    </div>
  );
}
