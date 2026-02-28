export default function Home() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">THE ATLAS <span className="text-lg font-normal text-gray-400">Clean Rebuild</span></h1>
        <p className="text-gray-400">Swarm Control Panel — Local-First Dashboard</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard title="Gateway" status="unknown" />
          <StatusCard title="Agents" status="0 online" />
          <StatusCard title="Memory Index" status="idle" />
          <StatusCard title="Queue Depth" status="0" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard title="Agents Panel" status="implemented" assignee="Hephaestus" href="/dashboard/agents" />
          <ModuleCard title="Memory Search" status="implemented" assignee="Mnemosyne" href="/dashboard/memories" />
          <ModuleCard title="OpenClaw Adapter" status="implemented" assignee="Hermes" />
          <ModuleCard title="Telemetry" status="implemented" assignee="Hyperion" href="/dashboard/telemetry" />
          <ModuleCard title="Ops/Cron" status="pending" assignee="Kronos" />
          <ModuleCard title="Task Queue" status="implemented" assignee="Kronos" href="/dashboard/tasks" />
          <ModuleCard title="UX Polish" status="pending" assignee="Prometheus" />
        </div>
      </section>

      <footer className="pt-4 border-t border-gray-700 text-sm text-gray-500">
        <p>Built with Next.js + TypeScript + Tailwind | Local-first</p>
      </footer>
    </div>
  );
}

function StatusCard({ title, status }: { title: string; status: string | number }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold mt-2">{status}</p>
    </div>
  );
}

function ModuleCard({ title, status, assignee, href }: { title: string; status: string; assignee: string; href?: string }) {
  const statusColors: Record<string, string> = {
    pending: 'text-yellow-500',
    implemented: 'text-green-500',
    error: 'text-red-500',
  };
  const color = statusColors[status] || 'text-gray-500';
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border ${href ? 'border-gray-700 hover:border-blue-500 transition-colors cursor-pointer' : 'border-gray-700'}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className={`text-sm mt-1 ${color}`}>● {status}</p>
      <p className="text-xs text-gray-500 mt-2">Owner: {assignee}</p>
      {href && (
        <div className="mt-3">
          <a href={href} className="text-blue-400 hover:underline text-sm">
            Open →
          </a>
        </div>
      )}
    </div>
  );
}
