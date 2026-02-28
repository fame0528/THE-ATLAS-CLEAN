'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  db: { sizeBytes: number; agents: number; tasks: number; auditLogs: number };
  gateway: { recentAuditCount: number | null };
  timestamp: string;
}

export default function TelemetryPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch('/api/metrics', {
        headers: {
          'X-ATLAS-TOKEN': token || '',
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-gray-400">Loading telemetry...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!metrics) return <div className="text-gray-500">No data</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Telemetry</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="DB Size" value={`${(metrics.db.sizeBytes / 1024).toFixed(1)} KB`} />
        <MetricCard label="Registered Agents" value={metrics.db.agents} />
        <MetricCard label="Tasks in DB" value={metrics.db.tasks} />
        <MetricCard label="Audit Log Entries" value={metrics.db.auditLogs} />
        <MetricCard label="Gateway Recent Audits" value={metrics.gateway.recentAuditCount ?? 'N/A'} />
        <MetricCard label="Last Updated" value={new Date(metrics.timestamp).toLocaleTimeString()} />
      </div>

      <div className="text-sm text-gray-500">
        <p>Metrics refresh every 10 seconds.</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 rounded p-4 border border-gray-700">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
