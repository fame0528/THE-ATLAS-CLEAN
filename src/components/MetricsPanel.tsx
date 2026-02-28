"use client";

import { useEffect, useState } from "react";
import ChartWidget from "./ChartWidget";

export default function MetricsPanel() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Health fetch failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-atlas-muted">Loading system metrics…</div>;
  }

  if (!health) {
    return <div className="text-red-400">Failed to load health data</div>;
  }

  const opsScore = health.ops?.overall ?? 0;
  const agentsHealthy = health.agents?.healthy ?? 0;
  const agentsTotal = health.agents?.total ?? 0;
  const cronHealthy = health.cron?.healthy ?? 0;
  const cronTotal = health.cron?.total ?? 0;
  const memoryCount = health.memory?.documentCount ?? 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Health Score */}
      <div className="bg-atlas-surface border border-atlas-border p-4 rounded">
        <h3 className="text-sm text-atlas-muted uppercase tracking-wide mb-2">Overall Health</h3>
        <div className="flex items-center gap-4">
          <div className={`text-4xl font-bold ${getScoreColor(opsScore)}`}>
            {opsScore}
            <span className="text-lg text-atlas-muted">/100</span>
          </div>
          <ChartWidget data={[opsScore, Math.max(0, opsScore - 5), opsScore, opsScore + 3, opsScore - 2]} height={60} />
        </div>
        <p className="text-xs text-atlas-muted mt-2">
          Agents: {agentsHealthy}/{agentsTotal} · Cron: {cronHealthy}/{cronTotal}
        </p>
      </div>

      {/* Memory */}
      <div className="bg-atlas-surface border border-atlas-border p-4 rounded">
        <h3 className="text-sm text-atlas-muted uppercase tracking-wide mb-2">Memory Index</h3>
        <div className="text-3xl font-bold text-atlas-primary">{memoryCount}</div>
        <p className="text-xs text-atlas-muted mt-2">
          Provider: {health.memory?.provider ?? "local"}<br />
          Last indexed: {health.memory?.lastIndexed ? new Date(health.memory.lastIndexed).toLocaleTimeString() : "—"}
        </p>
      </div>

      {/* Gateway */}
      <div className="bg-atlas-surface border border-atlas-border p-4 rounded">
        <h3 className="text-sm text-atlas-muted uppercase tracking-wide mb-2">Gateway</h3>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${health.gateway?.status === "online" ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xl font-bold">{health.gateway?.status ?? "unknown"}</span>
        </div>
        <p className="text-xs text-atlas-muted mt-2">
          PID: {health.gateway?.pid ?? "—"} · {health.gateway?.memoryMb ?? "—"} MB<br />
          Last restart: {health.gateway?.lastRestart ? new Date(health.gateway.lastRestart).toLocaleString() : "—"}
        </p>
      </div>
    </div>
  );
}