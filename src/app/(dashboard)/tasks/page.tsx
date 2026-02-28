"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  agent_id: string;
  status: "queued" | "running" | "completed" | "failed";
  payload: string;
  created_at: string;
  completed_at: string | null;
  error: string | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks?limit=50")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load tasks:", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "bg-yellow-900 text-yellow-300";
      case "running":
        return "bg-blue-900 text-blue-300";
      case "completed":
        return "bg-green-900 text-green-300";
      case "failed":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Task Queue</h1>

      <div className="bg-atlas-surface border border-atlas-border rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-atlas-border">
            <tr>
              <th className="p-3">Task ID</th>
              <th className="p-3">Agent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payload (preview)</th>
              <th className="p-3">Created</th>
              <th className="p-3">Completed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-atlas-muted text-center">
                  Loading...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-atlas-muted text-center">
                  No tasks in queue.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-t border-atlas-border">
                  <td className="p-3 font-mono">{task.id.slice(0, 12)}…</td>
                  <td className="p-3">{task.agent_id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs max-w-md truncate">
                    {(() => {
                      try {
                        const parsed = JSON.parse(task.payload);
                        return JSON.stringify(parsed).slice(0, 100) + "...";
                      } catch {
                        return task.payload.slice(0, 100) + "...";
                      }
                    })()}
                  </td>
                  <td className="p-3 text-atlas-muted">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-atlas-muted">
                    {task.completed_at
                      ? new Date(task.completed_at).toLocaleString()
                      : "—"}
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
