'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: string;
  agent_id: string;
  status: string;
  payload: object;
  created_at: string;
  completed_at?: string | null;
  error?: string | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAgentId, setNewAgentId] = useState('');
  const [newPayload, setNewPayload] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{type:'success'|'error', text: string} | null>(null);

  const fetchTasks = async () => {
    try {
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch('/api/tasks', { headers: { 'X-ATLAS-TOKEN': token || '' } });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err: any) { console.error('Failed to load tasks:', err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); const interval = setInterval(fetchTasks, 10000); return () => clearInterval(interval); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setMsg(null);
    try {
      const payload = JSON.parse(newPayload);
      const token = process.env.NEXT_PUBLIC_ATLAS_TOKEN;
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'X-ATLAS-TOKEN': token || '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: newAgentId, payload }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMsg({ type: 'success', text: `Task ${data.taskId} queued` });
      setNewAgentId(''); setNewPayload('{}');
      fetchTasks();
    } catch (err: any) { setMsg({ type: 'error', text: err.message }); } finally { setSubmitting(false); }
  };

  if (loading) return <div style={{ color: 'var(--muted-foreground)' }}>Loading tasks...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Task Queue</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-1 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded text-sm">
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>
      {msg && <div className={`p-3 rounded ${msg.type==='success'?'bg-green-900 text-green-300':'bg-red-900 text-red-300'}`}>{msg.text}</div>}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3">
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Agent ID</label>
            <input
              type="text"
              value={newAgentId}
              onChange={e => setNewAgentId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded"
              style={{ backgroundColor: 'var(--muted)', border: `1px solid var(--border)`, color: 'var(--foreground)' }}
              placeholder="agent-id"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Payload (JSON)</label>
            <textarea
              value={newPayload}
              onChange={e => setNewPayload(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded font-mono text-sm"
              style={{ backgroundColor: 'var(--muted)', border: `1px solid var(--border)`, color: 'var(--foreground)' }}
              placeholder='{"command":"..."}'
            />
          </div>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded disabled:opacity-50">
            {submitting ? 'Enqueueing...' : 'Enqueue Task'}
          </button>
        </form>
      )}
      <div className="card overflow-auto">
        <table className="w-full text-sm text-left">
          <thead style={{ backgroundColor: 'var(--muted)' }}>
            <tr>
              <th className="p-3" style={{ color: 'var(--muted-foreground)' }}>Task ID</th>
              <th className="p-3" style={{ color: 'var(--muted-foreground)' }}>Agent</th>
              <th className="p-3" style={{ color: 'var(--muted-foreground)' }}>Status</th>
              <th className="p-3" style={{ color: 'var(--muted-foreground)' }}>Created</th>
              <th className="p-3" style={{ color: 'var(--muted-foreground)' }}>Completed</th>
              <th className="p-3" style={{ color: 'var(--muted-foreground)' }}>Error</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--foreground)' }}>
            {tasks.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center" style={{ color: 'var(--muted-foreground)' }}>No tasks yet</td></tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3 font-mono text-xs">{task.id.slice(0,12)}…</td>
                  <td className="p-3">{task.agent_id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      task.status === 'queued' ? 'bg-yellow-900 text-yellow-300' :
                      task.status === 'running' ? 'bg-blue-900 text-blue-300' :
                      task.status === 'completed' ? 'bg-green-900 text-green-300' :
                      'bg-red-900 text-red-300'
                    }`}>{task.status}</span>
                  </td>
                  <td className="p-3">{new Date(task.created_at).toLocaleString()}</td>
                  <td className="p-3">{task.completed_at ? new Date(task.completed_at).toLocaleString() : '—'}</td>
                  <td className="p-3 text-red-400 max-w-xs truncate" title={task.error||''}>{task.error ? '✗ '+task.error.slice(0,40)+(task.error.length>40?'…':'') : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Tasks are forwarded to the OpenClaw gateway for execution.</p>
    </div>
  );
}
