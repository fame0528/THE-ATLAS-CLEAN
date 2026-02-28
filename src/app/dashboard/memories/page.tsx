'use client';

import { useState } from 'react';

interface SearchResult {
  file: string;
  line: number;
  snippet: string;
  score: number;
}

export default function MemorySearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (q: string) => {
    if (!q.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(q)}`, {
        headers: {
          'X-ATLAS-TOKEN': token || '',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results || []);
      setCount(data.count || 0);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.message);
      setResults([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Memory Search</h1>
      <p className="text-gray-400">
        Search across MEMORY.md and daily notes in workspace-mercury/memory/
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="text-red-500">
          Error: {error}
        </div>
      )}

      {!loading && results.length === 0 && query && !error && (
        <div className="text-gray-500 italic">No results found.</div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{count} result{count !== 1 ? 's' : ''} found</p>
          {results.map((r, idx) => (
            <div key={`${r.file}:${r.line}`} className="bg-gray-800 rounded p-4 border border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                <span className="font-mono text-blue-400">{r.file}</span>
                <span>line {r.line}</span>
                <span className="text-gray-600">score: {r.score}</span>
              </div>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{r.snippet}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
