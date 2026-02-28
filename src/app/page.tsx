import MetricsPanel from "@/components/MetricsPanel";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">THE ATLAS <span className="text-lg font-normal text-gray-400">Clean Rebuild</span></h1>
        <p className="text-gray-400">Swarm Control Panel — Local-First Dashboard</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
        <MetricsPanel />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link href="/dashboard/agents" className="bg-atlas-surface border border-atlas-border p-4 rounded hover:border-atlas-primary transition-colors">
            <h3 className="font-semibold">Agents</h3>
            <p className="text-sm text-atlas-muted">View swarm status</p>
          </Link>
          <Link href="/dashboard/tasks" className="bg-atlas-surface border border-atlas-border p-4 rounded hover:border-atlas-primary transition-colors">
            <h3 className="font-semibold">Tasks</h3>
            <p className="text-sm text-atlas-muted">Task queue</p>
          </Link>
          <Link href="/dashboard/memories" className="bg-atlas-surface border border-atlas-border p-4 rounded hover:border-atlas-primary transition-colors">
            <h3 className="font-semibold">Memories</h3>
            <p className="text-sm text-atlas-muted">Search docs</p>
          </Link>
          <Link href="/dashboard/actions" className="bg-atlas-surface border border-atlas-border p-4 rounded hover:border-atlas-primary transition-colors">
            <h3 className="font-semibold">Actions</h3>
            <p className="text-sm text-atlas-muted">System ops</p>
          </Link>
        </div>
      </section>

      <footer className="pt-4 border-t border-gray-700 text-sm text-gray-500">
        <p>Built with Next.js + TypeScript + Tailwind | Local-first | Agent Optimized</p>
      </footer>
    </div>
  );
}