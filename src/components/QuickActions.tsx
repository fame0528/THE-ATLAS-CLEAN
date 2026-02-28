'use client';

export default function QuickActions() {
  return (
    <div className="space-y-3">
      <p className="text-gray-500 text-sm mb-4">
        All destructive actions are locked pending Ares approval.
      </p>

      <button
        disabled
        className="w-full px-4 py-3 bg-red-900/50 border border-red-800 text-red-300 rounded hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
        title="Requires Ares approval and code modification"
      >
        🛑 Restart Gateway
      </button>

      <button
        disabled
        className="w-full px-4 py-3 bg-yellow-900/50 border border-yellow-800 text-yellow-300 rounded hover:bg-yellow-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
        title="Requires Ares approval and code modification"
      >
        ⚡ Trigger Savepoint & Stop
      </button>

      <button
        disabled
        className="w-full px-4 py-3 bg-cyan-900/50 border border-cyan-800 text-cyan-300 rounded hover:bg-cyan-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
        title="Requires Ares approval and code modification"
      >
        🔍 Run Memory Index
      </button>

      <p className="text-xs text-gray-600 pt-4">
        To enable: add <code className="bg-gray-800 px-1 rounded">// ARES-APPROVED</code> to action code in <code className="bg-gray-800 px-1 rounded">src/lib/openclaw-adapter.ts</code>
      </p>
    </div>
  );
}
