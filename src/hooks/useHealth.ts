"use client";

import { useEffect, useState } from "react";

export default function useHealth(interval = 5000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const timer = setInterval(fetchHealth, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return { data, loading, error, refresh: fetchHealth };
}