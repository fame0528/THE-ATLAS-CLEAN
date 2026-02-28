'use client';

import { useEffect, useState } from 'react';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  agentId?: string;
  details: Record<string, unknown>;
  outcome: 'success' | 'failure';
  error?: string;
}

export function AuditLogViewer({ limit = 50 }: { limit?: number }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect() => {
    fetchAudit();
  }, []);

  async function fetchAudit() {
    try {
      const token = localStorage.getItem('atlas-token');
      const headers: Record<string, string> = {};
      if (token) headers['X-ATLAS-TOKEN'] = token;

      const res = await fetch(`/api/audit?limit=${limit}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch audit log:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-4">Loading audit log...</div>;
  }

  if (entries.length === 0) {
    return <div className="p-4 text-gray-500">No audit entries found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Time</th>
            <th className="text-left p-2">Action</th>
            <th className="text-left p-2">Agent</th>
            <th className="text-left p-2">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="p-2 text-gray-500">
                {new Date(entry.timestamp).toLocaleString()}
              </td>
              <td className="p-2 font-mono">{entry.action}</td>
              <td className="p-2">{entry.agentId || '-'}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-white text-xs ${
                  entry.outcome === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {entry.outcome}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
