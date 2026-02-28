// Real-time alerts hook
"use client";

import { useEffect } from "react";
import { useLiveHealth } from "./useLiveHealth";

export function useAlerts() {
  const { data } = useLiveHealth();

  useEffect(() => {
    if (!data) return;
    const wal = data.ops?.wal || {};
    const staleAgents = Object.entries(wal)
      .filter(([_, info]: any) => info.status === 'stale')
      .map(([agent]) => agent);

    if (staleAgents.length > 0) {
      // Could trigger toast/notification here
      console.warn(`Stale WAL detected for: ${staleAgents.join(', ')}`);
    }
  }, [data]);
}