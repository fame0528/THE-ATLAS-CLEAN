"use client";

import { useEffect, useState } from "react";

interface BuildInfo {
  status: 'building' | 'ready' | 'error';
  commit: string;
  url?: string;
}

export default function BuildHealthWidget() {
  const [build, setBuild] = useState<BuildInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastBuild');
    if (saved) {
      try { setBuild(JSON.parse(saved)); } catch {}
    }
  }, []);

  if (!build) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded p-2 text-xs z-50">
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${build.status === 'ready' ? 'bg-green-500' : build.status === 'building' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
        <span>Build: {build.status}</span>
        <a href={build.url} target="_blank" rel="noopener" className="underline text-cyan-400">{build.commit.slice(0,8)}</a>
      </div>
    </div>
  );
}