"use client";

import { useState } from "react";

interface Result {
  id: string;
  snippet: string;
  score: number;
}

export default function MemoriesPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.results || []);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Memories / Docs</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memory (keyword search only for now)..."
            className="flex-1 bg-atlas-surface border border-atlas-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-atlas-primary text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={r.id}
              className="bg-atlas-surface border border-atlas-border p-4 rounded"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-atlas-muted">
                  {r.id}
                </span>
                <span className="text-xs text-atlas-muted">
                  score: {r.score}
                </span>
              </div>
              <p className="text-sm">{r.snippet}</p>
              <div className="mt-2">
                <button className="text-xs text-atlas-primary hover:underline">
                  Open file (coming soon)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <p className="text-atlas-muted text-center py-8">
          No results found.
        </p>
      )}

      <div className="mt-8 text-atlas-muted text-sm">
        <p>
          <strong>Note:</strong> This is a local keyword search placeholder.
          Full integration with OpenClaw memory (Qdrant + embeddings) coming
          in next phase via Mnemosyne.
        </p>
      </div>
    </div>
  );
}
