import type { Metadata } from 'next';
import './globals.css';
import AgentsPanel from '@/components/AgentsPanel';
import MetricsPanel from '@/components/MetricsPanel';
import MemorySearch from '@/components/MemorySearch';

export const metadata: Metadata = {
  title: 'THE ATLAS — Swarm Control',
  description: 'Local-first control panel for the swarm',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">THE ATLAS</h1>
        <p className="text-gray-400">Local-First Swarm Control Panel</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Agents + Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Agents</h2>
            <AgentsPanel />
          </section>

          <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">System Metrics</h2>
            <MetricsPanel />
          </section>
        </div>

        {/* Right column: Memory Search + Actions */}
        <div className="space-y-6">
          <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Memory Search</h2>
            <MemorySearch />
          </section>

          <section className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Quick Actions</h2>
            <p className="text-gray-500 text-sm">Locked — Ares approval required</p>
            <button
              disabled
              className="mt-2 px-4 py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
            >
              Restart Gateway
            </button>
          </section>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>Port 3050 • Local-first • Zero secrets in repo</p>
      </footer>
    </div>
  );
}
