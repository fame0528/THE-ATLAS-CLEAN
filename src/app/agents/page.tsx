"use client";

import { useEffect, useState } from "react";

interface Agent {
  id: string;
  role: string;
  state: string;
  last_message_at: string | null;
  workspace_path: string;
  created_at: string;
  updated_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load agents:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Agents</h1>

      <div className="bg-atlas-surface border border-atlas-border rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-atlas-border">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Role</th>
              <th className="p-3">State</th>
              <th className="p-3">Last Message</th>
              <th className="p-3">Workspace</th>
              <th className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-atlas-muted text-center">
                  Loading...
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-atlas-muted text-center">
                  No agents registered yet.
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.id} className="border-t border-atlas-border">
                  <td className="p-3 font-mono">{agent.id}</td>
                  <td className="p-3">{agent.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        agent.state === "idle"
                          ? "bg-green-900 text-green-300"
                          : agent.state === "running"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {agent.state}
                    </span>
                  </td>
                  <td className="p-3 text-atlas-muted">
                    {agent.last_message_at
                      ? new Date(agent.last_message_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-3 font-mono text-xs truncate max-w-xs">
                    {agent.workspace_path || "—"}
                  </td>
                  <td className="p-3 text-atlas-muted">
                    {new Date(agent.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
