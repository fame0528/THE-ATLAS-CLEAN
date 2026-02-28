"use client";

import { useEffect, useState, useMemo } from "react";
import useLiveHealth from "@/hooks/useLiveHealth";
import { getHealthHistory } from "@/lib/metrics-db";
import ChartWidget from "./ChartWidget";

export default function HistoricalChart() {
  const { data: live } = useLiveHealth();
  const [history, setHistory] = useState<{ timestamp: number; score: number }[]>([]);

  useEffect(() => {
    getHealthHistory(100).then(snapshots => {
      const points = snapshots.map(s => ({
        timestamp: s.timestamp,
        score: s.data.ops?.overall || 0,
      }));
      setHistory(points);
    });
  }, []);

  const allPoints = useMemo(() => {
    const pts = [...history];
    if (live) {
      pts.push({ timestamp: Date.now(), score: live.ops?.overall || 0 });
    }
    return pts;
  }, [history, live]);

  if (allPoints.length === 0) {
    return <div className="text-gray-500 text-sm">No historical data yet.</div>;
  }

  const displayData = allPoints.slice(-50).map(p => p.score);
  const latest = allPoints[allPoints.length - 1]?.score || 0;

  return (
    <div className="bg-atlas-surface border border-atlas-border rounded p-4">
      <h4 className="text-sm font-semibold mb-2">Health Trend (last 50 samples)</h4>
      <div className="h-32 w-full">
        <ChartWidget data={displayData} height={128} />
      </div>
      <p className="text-xs text-atlas-muted mt-2">Latest: {latest}/100</p>
    </div>
  );
}