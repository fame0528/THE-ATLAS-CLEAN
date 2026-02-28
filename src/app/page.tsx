export default function Home() {
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">THE ATLAS — Clean Mission Control</h1>
        <p className="text-gray-400 mt-2">Local-first swarm dashboard (MVP scaffold)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* System Status */}
        <section className="bg-gray-800 p-4 rounded border border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">System Status</h2>
          <div className="space-y-2 text-sm">
            <p>Gateway: <span className="text-yellow-400">Unknown</span></p>
            <p>Agents Online: <span className="text-green-400">0</span></p>
            <p>Memory Index: <span className="text-gray-400">Not checked</span></p>
            <p>Queue Depth: <span className="text-gray-400">0</span></p>
          </div>
        </section>

        {/* Agents Panel */}
        <section className="bg-gray-800 p-4 rounded border border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">Agents</h2>
          <p className="text-gray-400 text-sm">Agent list will populate here</p>
        </section>

        {/* Tasks/Queue */}
        <section className="bg-gray-800 p-4 rounded border border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">Queue</h2>
          <p className="text-gray-400 text-sm">Queued tasks appear here</p>
        </section>

        {/* Memories */}
        <section className="bg-gray-800 p-4 rounded border border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">Memories</h2>
          <p className="text-gray-400 text-sm">Search interface coming soon</p>
        </section>
      </div>

      <footer className="mt-8 text-gray-500 text-sm">
        Built with Next.js + TypeScript + Tailwind. Zero external state.
      </footer>
    </div>
  );
}