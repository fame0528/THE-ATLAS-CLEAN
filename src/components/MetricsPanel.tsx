'use client';

import { useEffect, useState } from 'react';

interface StatusData {
  gateway: any;
  queue: { depth: number; running: number; stats: any };
  memory: { enabled: boolean; lastIndex: string; fileCount: number };
  timestamp: string;
}

export default function MetricsPanel() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/status', {
      headers: {
        'X-ATLAS-TOKEN': process.env.NEXT_PUBLIC_ATLAS_TOKEN || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setStatus(data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }
  if (!status) {
    return <p className="text-gray-400">Loading metrics...</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800 p-3 rounded">
        <p className="text-gray-500 text-xs uppercase">Gateway</p>
        <p className="text-lg font-semibold text-cyan-300">
          {status.gateway.status || 'unknown'}
        </p>
        <p className="text-xs text-gray-500">
          Last: {new Date(status.timestamp).toLocaleTimeString()}
        </p>
      </div>

      <div className="bg-gray-800 p-3 rounded">
        <p className="text-gray-500 text-xs uppercase">Queue Depth</p>
        <p className="text-lg font-semibold text-cyan-300">{status.queue.depth}</p>
        <p className="text-xs text-gray-500">{status.queue.running} running</p>
      </div>

      <div className="bg-gray-800 p-3 rounded">
        <p className="text-gray-500 text-xs uppercase">Memory Index</p>
        <p className="text-lg font-semibold text-cyan-300">
          {status.memory.enabled ? '✓ Enabled' : '✗ Disabled'}
        </p>
        <p className="text-xs text-gray-500">{status.memory.fileCount} files</p>
      </div>

      <div className="bg-gray-800 p-3 rounded">
        <p className="text-gray-500 text-xs uppercase">Completed Tasks</p>
        <p className="text-lg font-semibold text-cyan-300">
          {status.queue.stats.totalCompleted || 0}
        </p>
        <p className="text-xs text-gray-500">
          {status.queue.stats.totalFailed || 0} failed
        </p>
      </div>
    </div>
  );
}
