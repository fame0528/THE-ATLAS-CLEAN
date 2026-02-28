"use client";

import useLiveHealth from "@/hooks/useLiveHealth";
import ChartWidget from "./ChartWidget";
import ScoreDetail from "./ScoreDetail";

export default function MetricsPanel() {
  const { data, error, live } = useLiveHealth();
  const [showDetail, setShowDetail] = useState(false);

  if (!data && !error) {
    return <div className="text-atlas-muted">Loading…</div>;
  }

  if (error) {
    return <div className="text-red-400">Health check failed</div>;
  }

  const opsScore = data.ops?.overall ?? 0;
  const agentsHealthy = data.agents?.healthy ?? 0;
  const agentsTotal = data.agents?.total ?? 0;
  const memoryCount = data.memory?.documentCount ?? 0;
  const gatewayStatus = data.gateway?.status ?? 'unknown';

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-300";
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const chartData = [opsScore, Math.max(0, opsScore - 5), opsScore, Math.min(100, opsScore + 3), opsScore];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score */}
        <div className="bg-atlas-surface border border-atlas-border p-4 rounded relative">
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-full ${live ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs text-gray-400">{live ? 'LIVE' : 'POLL'}</span>
          </div>
          <h3 className="text-sm text-atlas-muted uppercase tracking-wide mb-2">Overall Health</h3>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(opsScore)}`}>
              {opsScore}
              <span className="text-lg text-gray-500">/100</span>
            </div>
            <ChartWidget data={chartData} height={60} />
          </div>
          <p className="text-xs text-atlas-muted mt-2">
            Agents: {agentsHealthy}/{agentsTotal}
          </p>
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="mt-2 text-xs underline text-atlas-primary"
          >
            {showDetail ? 'Hide' : 'Show'} score details
          </button>
        </div>

        {/* Memory */}
        <div className="bg-atlas-surface border border-atlas-border p-4 rounded">
          <h3 className="text-sm text-atlas-muted uppercase tracking-wide mb-2">Memory Index</h3>
          <div className="text-3xl font-bold text-atlas-primary">{memoryCount}</div>
          <p className="text-xs text-atlas-muted mt-2">
            Provider: {data.memory?.provider ?? "local"}<br />
            Last indexed: {data.memory?.lastIndexed ? new Date(data.memory.lastIndexed).toLocaleTimeString() : "—"}
          </p>
        </div>

        {/* Gateway */}
        <div className="bg-atlas-surface border border-atlas-border p-4 rounded">
          <h3 className="text-sm text-atlas-muted uppercase tracking-wide mb-2">Gateway</h3>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${gatewayStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xl font-bold">{gatewayStatus}</span>
          </div>
          <p className="text-xs text-atlas-muted mt-2">
            PID: {data.gateway?.pid ?? "—"} · {data.gateway?.memoryMb ?? "—"} MB<br />
            Last restart: {data.gateway?.lastRestart ? new Date(data.gateway.lastRestart).toLocaleString() : "—"}
          </p>
        </div>
      </div>

      {showDetail && (
        <ScoreDetail
          score={opsScore}
          breakdown={{
            gateway: data.gateway?.status === 'online' ? 30 : 0,
            agents: data.agents.total > 0 ? Math.round((data.agents.healthy / data.agents.total) * 25) : 0,
            memory: data.memory.documentCount > 0 ? 15 : 5,
            wal: data.ops?.wal ? (Object.values(data.ops.wal).filter((s: any) => s.status === 'fresh').length * 10) : 0,
            cron: data.cron?.healthy > 0 ? 10 : 0,
          }}
        />
      )}
    </div>
  );
}