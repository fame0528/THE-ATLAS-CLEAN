'use client';

import { useState } from 'react';

interface Result { file: string; line: number; snippet: string; score: number; }

export default function MemoriesPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setError(null);
    try {
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(q)}`, { headers: { 'X-ATLAS-TOKEN': token || '' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data.results || []); setCount(data.count || 0);
    } catch (err: any) { setError(err.message); setResults([]); setCount(0); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Memory Search</h1>
      <p style={{ color: 'var(--muted-foreground)' }}>Search MEMORY.md and daily notes</p>
      <form onSubmit={e => { e.preventDefault(); search(query); }} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 px-3 py-2 rounded"
          style={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border)`, color: 'var(--foreground)' }}
        />
        <button type="submit" disabled={loading || !query.trim()} className="px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded disabled:opacity-50">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && results.length === 0 && query && !error && <div className="text-gray-500 italic">No results.</div>}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{count} results</p>
          {results.map((r,i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-4 text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-mono text-cyan-400">{r.file}</span>
                <span>line {r.line}</span>
                <span>score: {r.score}</span>
              </div>
              <pre className="text-sm whitespace-pre-wrap font-mono" style={{ color: 'var(--foreground)' }}>{r.snippet}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
