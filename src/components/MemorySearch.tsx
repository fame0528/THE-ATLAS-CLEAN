'use client';

import { useState } from 'react';

interface SearchResult {
  file: string;
  snippet: string;
}

export default function MemorySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(q)}&limit=10`, {
        headers: {
          'X-ATLAS-TOKEN': process.env.NEXT_PUBLIC_ATLAS_TOKEN || '',
        },
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search memory..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 disabled:bg-gray-700 text-white rounded"
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.length === 0 && !searching && (
          <p className="text-gray-500 text-sm">No results yet.</p>
        )}
        {results.map((r, i) => (
          <div key={i} className="p-3 bg-gray-800 rounded border border-gray-700">
            <code className="text-xs text-cyan-400">{r.file}</code>
            <p className="mt-1 text-sm text-gray-300 italic">...{r.snippet}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
