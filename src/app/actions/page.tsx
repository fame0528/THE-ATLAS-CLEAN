"use client";

import { useState } from "react";

interface ActionResult {
  success: boolean;
  type: string;
  stdout?: string;
  stderr?: string;
  error?: string;
}

export default function ActionsPage() {
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const actions = [
    {
      type: "restart-gateway",
      label: "Restart OpenClaw Gateway",
      desc: "Restart the gateway service via pm2",
    },
    {
      type: "savepoint-stop",
      label: "Savepoint & Stop",
      desc: "Trigger savepoint then shut down OpenClaw gracefully",
    },
    {
      type: "index-memory",
      label: "Index Memory",
      desc: "Run OpenClaw memory indexer to update document store",
    },
  ];

  const execute = async (type: string) => {
    if (!confirm(`Are you sure you want to run "${type}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(type);
    setActionResult(null);

    try {
      const res = await fetch(`/api/actions/${type}`, { method: "POST" });
      const data = await res.json();
      setActionResult(data);
    } catch (err: any) {
      setActionResult({ success: false, type, error: err.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Quick Actions</h1>
      <p className="text-atlas-muted mb-6">
        Sensitive operations behind authentication and confirmation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <div
            key={action.type}
            className="bg-atlas-surface border border-atlas-border p-4 rounded"
          >
            <h3 className="font-bold mb-1">{action.label}</h3>
            <p className="text-sm text-atlas-muted mb-4">{action.desc}</p>
            <button
              onClick={() => execute(action.type)}
              disabled={loading === action.type}
              className="px-3 py-1.5 bg-atlas-primary text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading === action.type ? "Running…" : "Execute"}
            </button>
          </div>
        ))}
      </div>

      {actionResult && (
        <div className="mt-6 bg-atlas-surface border border-atlas-border rounded p-4">
          <h2 className="font-bold mb-2">Result</h2>
          <pre className="text-xs whitespace-pre-wrap bg-black/30 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(actionResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 text-atlas-muted text-sm">
        <p>
          <strong>Security:</strong> All actions require the{" "}
          <code className="bg-black/30 px-1 rounded">X-ATLAS-TOKEN</code> header
          and are fully audited. Unauthorized requests return 401.
        </p>
      </div>
    </div>
  );
}
