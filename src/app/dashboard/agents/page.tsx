'use client';

import { useEffect, useState } from 'react';
import type { ApiAgent } from '@/types/agent';

export default function AgentsPage() {
  const [agents, setAgents] = useState<ApiAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch('/api/agents', {
        headers: {
          'X-ATLAS-TOKEN': token || '',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setAgents(data.agents || []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load agents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading agents...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading agents: {error}
        <button onClick={fetchAgents} className="ml-4 px-3 py-1 bg-blue-600 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Agents</h1>
      <p className="text-gray-400">
        Active agents in the swarm: {agents.length}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map(agent => (
          <div key={agent.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="font-semibold text-lg mb-2">{agent.id}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="text-blue-400">{agent.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">State:</span>
                <span className={`${agent.state === 'idle' ? 'text-green-500' : agent.state === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {agent.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last seen:</span>
                <span className="text-gray-300">
                  {agent.lastSeen ? new Date(agent.lastSeen).toLocaleString() : 'never'}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 truncate" title={agent.workspace}>
                  Workspace: {agent.workspace}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-gray-500 italic">
          No agents found. Agents appear when they register their presence.
        </div>
      )}
    </div>
  );
}
