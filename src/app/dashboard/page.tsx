'use client';

import { useEffect, useState } from 'react';
import type { SystemMetrics, Agent } from '@/types';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ file: string; lines: string; snippet: string }>>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/status?bootstrap=true');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results ?? []);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading ATLAS...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-red-600">Failed to load system metrics</div>;
  }

  const onlineAgents = metrics.agents.filter((a: Agent) => a.status === 'idle' || a.status === 'running').length;
  const totalAgents = metrics.agents.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Swarm Dashboard</h1>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          title="Gateway"
          value={metrics.gateway.online ? 'Online' : 'Offline'}
          color={metrics.gateway.online ? 'green' : 'red'}
        />
        <StatusCard
          title="Agents"
          value={`${onlineAgents}/${totalAgents}`}
          color={onlineAgents === totalAgents ? 'green' : 'yellow'}
        />
        <StatusCard
          title="Queue Depth"
          value={metrics.queueDepth.deliveryQueue.toString()}
          color="blue"
        />
        <StatusCard
          title="Memory"
          value={metrics.memoryHealth.indexStatus}
          color={metrics.memoryHealth.indexStatus === 'ok' ? 'green' : 'yellow'}
        />
      </div>

      {/* Cost Panel */}
      {metrics.cost && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cost Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Daily Spend</span>
              <div className="text-2xl font-bold">${metrics.cost.dailySpend?.toFixed(2) ?? '0.00'}</div>
            </div>
            <div>
              <span className="text-gray-500">Monthly Spend</span>
              <div className="text-2xl font-bold">${metrics.cost.monthlySpend?.toFixed(2) ?? '0.00'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Agents Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Agents</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Last Message</th>
              <th className="text-left p-2">Workspace</th>
            </tr>
          </thead>
          <tbody>
            {metrics.agents.map((agent: Agent) => (
              <tr key={agent.id} className="border-b">
                <td className="p-2 font-mono text-sm">{agent.id}</td>
                <td className="p-2">{agent.role}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white text-xs ${
                    agent.status === 'idle' || agent.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="p-2 text-sm">
                  {agent.lastMessageTime ? new Date(agent.lastMessageTime).toLocaleString() : 'Never'}
                </td>
                <td className="p-2 text-sm font-mono truncate max-w-xs">{agent.workspacePath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={() => executeAction('/api/gateway/restart', 'Restart Gateway')}>
            Restart Gateway
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
                  onClick={() => executeAction('/api/gateway/savepoint', 'Savepoint & Stop')}>
            Savepoint & Stop
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => executeAction('/api/memory/index', 'Index Memory Now')}>
            Index Memory
          </button>
        </div>
      </div>

      {/* Memory Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Memory Search</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory (semantic)..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button type="submit" disabled={searching || !searchQuery.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
        {searchResults.length > 0 && (
          <ul className="space-y-2">
            {searchResults.map((r, i) => (
              <li key={i} className="border-b pb-2">
                <div className="font-mono text-sm text-gray-500">{r.file} (lines {r.lines})</div>
                <div className="text-sm">{r.snippet}</div>
              </li>
            ))}
          </ul>
        )}
        {searchResults.length === 0 && searchQuery && !searching && (
          <div className="text-gray-500">No results found</div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ title, value, color }: { title: string; value: string; color: 'green' | 'red' | 'yellow' | 'blue' }) {
  const colors = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };
  return (
    <div className={`p-4 rounded-lg ${colors[color]}`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

async function executeAction(endpoint: string, label: string) {
  if (!confirm(`Confirm action: ${label}?`)) return;

  const token = prompt('Enter ATLAS token:');
  if (!token) return;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'X-ATLAS-TOKEN': token },
  });

  if (res.ok) {
    alert(`${label} initiated successfully.`);
    // Refresh metrics after delay
    setTimeout(() => window.location.reload(), 2000);
  } else {
    const err = await res.json();
    alert(`Error: ${err.error ?? 'Unknown'}`);
  }
}
