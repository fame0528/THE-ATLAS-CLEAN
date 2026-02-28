export default function Home() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusCard title="Gateway" status="unknown" />
          <StatusCard title="Agents" status="0 online" />
          <StatusCard title="Memory Index" status="unknown" />
          <StatusCard title="Queue Depth" status="0" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard title="Agents Panel" status="pending" assignee="Hephaestus" />
          <ModuleCard title="Memory Search" status="pending" assignee="Mnemosyne" />
          <ModuleCard title="OpenClaw Adapter" status="pending" assignee="Hermes" />
          <ModuleCard title="Telemetry" status="pending" assignee="Hyperion" />
          <ModuleCard title="Ops/Cron" status="pending" assignee="Kronos" />
          <ModuleCard title="UX Polish" status="pending" assignee="Prometheus" />
        </div>
      </section>
    </div>
  )
}

function StatusCard({ title, status }: { title: string; status: string | number }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-sm text-gray-400 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold mt-2">{status}</p>
    </div>
  )
}

function ModuleCard({ title, status, assignee }: { title: string; status: string; assignee: string }) {
  const color = status === 'pending' ? 'text-yellow-500' : 'text-green-500'
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="font-semibold">{title}</h3>
      <p className={`text-sm mt-1 ${color}`}>● {status}</p>
      <p className="text-xs text-gray-500 mt-2">Owner: {assignee}</p>
    </div>
  )
}
