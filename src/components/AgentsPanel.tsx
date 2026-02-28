'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  category: string;
  defaultPriority: string;
  icon: string;
  status: {
    lastHeartbeat?: string;
    currentStep?: string;
    progress: number;
  };
}

export default function AgentsPanel() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents', {
      headers: {
        'X-ATLAS-TOKEN': process.env.NEXT_PUBLIC_ATLAS_TOKEN || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load agents:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading agents...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="pb-2">Agent</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Last Heartbeat</th>
          </tr>
        </thead>
        <tbody>
          {agents.map(agent => (
            <tr key={agent.id} className="border-b border-gray-800 last:border-0">
              <td className="py-3">
                <span className="mr-2">{agent.icon}</span>
                <span className="font-medium">{agent.name}</span>
                <span className="text-gray-500 text-xs ml-2">({agent.id})</span>
              </td>
              <td className="py-3 text-gray-300">{agent.role}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  agent.status.lastHeartbeat
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {agent.status.lastHeartbeat ? 'alive' : 'offline'}
                </span>
              </td>
              <td className="py-3 text-gray-400 text-xs">
                {agent.status.lastHeartbeat
                  ? new Date(agent.status.lastHeartbeat).toLocaleString()
                  : 'never'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
