export interface Agent {
  id: string;
  role: string;
  state: string;
  last_message_at: string | null;
  workspace_path: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  agent_id: string;
  status: "queued" | "running" | "completed" | "failed";
  payload: string;
  created_at: string;
  completed_at: string | null;
  error: string | null;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  atlas: { version: string; db: { dbSize: number; agentsCount: number; tasksCount: number } };
  gateway: { status: string; pid: number; memoryMb: number; lastRestart: string };
  agents: { total: number; healthy: number };
  memory: { provider: string; lastIndexed: string; documentCount: number };
  ops: { overall: number; cronScore: number; agentScore: number };
  cron: { total: number; healthy: number; jobs: Array<{ id: string; name: string; status: string }> };
}