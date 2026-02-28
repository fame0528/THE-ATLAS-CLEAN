'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: string;
  agent_id: string;
  status: string;
  payload: object;
  created_at: string;
  completed_at: string | null;
  error: string | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAgentId, setNewAgentId] = useState('');
  const [newPayload, setNewPayload] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  const fetchTasks = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch('/api/tasks', {
        headers: { 'X-ATLAS-TOKEN': token || '' },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err: any) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      let payload;
      try { payload = JSON.parse(newPayload); } catch { payload = {}; }
      
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'X-ATLAS-TOKEN': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agent_id: newAgentId, payload }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMsg({ type: 'success', text: `Task ${data.taskId} queued` });
      setNewAgentId('');
      setNewPayload('{}');
      fetchTasks(); // refresh
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading tasks...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Queue</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-1 bg-blue-600 rounded text-sm">
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded ${msg.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {msg.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-4 border border-gray-700 rounded space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Agent ID</label>
            <input
              type="text"
              value={newAgentId}
              onChange={e => setNewAgentId(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              placeholder="agent-id (e.g., hermes-1)"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Payload (JSON)</label>
            <textarea
              value={newPayload}
              onChange={e => setNewPayload(e.target.value)}
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm"
              placeholder='{"command": "restart", "target": "gateway"}'
            />
          </div>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:bg-gray-700">
            {submitting ? 'Enqueueing...' : 'Enqueue Task'}
          </button>
        </form>
      )}

      <div className="bg-gray-800 rounded border border-gray-700 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3">Task ID</th>
              <th className="p-3">Agent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Completed</th>
              <th className="p-3">Error</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-gray-500 text-center">No tasks yet</td></tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id} className="border-t border-gray-700">
                  <td className="p-3 font-mono text-xs">{task.id.slice(0, 12)}…</td>
                  <td className="p-3">{task.agent_id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      task.status === 'queued' ? 'bg-yellow-900 text-yellow-300' :
                      task.status === 'running' ? 'bg-blue-900 text-blue-300' :
                      task.status === 'completed' ? 'bg-green-900 text-green-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">{new Date(task.created_at).toLocaleString()}</td>
                  <td className="p-3 text-gray-400">
                    {task.completed_at ? new Date(task.completed_at).toLocaleString() : '—'}
                  </td>
                  <td className="p-3 text-red-400 max-w-xs truncate" title={task.error || ''}>
                    {task.error ? '✗ ' + task.error.slice(0, 40) + (task.error.length > 40 ? '…' : '') : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500">
        <p>Tasks are forwarded to the OpenClaw gateway for execution. Status updates come from agent heartbeats.</p>
      </div>
    </div>
  );
}
