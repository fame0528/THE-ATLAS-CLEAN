import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.ATLAS_DB_PATH || join(process.cwd(), "data", "atlas.json");

export interface DBAgent {
  id: string;
  role: string;
  state: string;
  workspace_path: string;
  last_message_at?: string | null;
  updated_at: string;
  created_at: string;
}

export interface DBTask {
  id: string;
  agent_id: string;
  status: 'queued' | 'running' | 'completed' | 'error';
  payload: object;
  created_at: string;
  completed_at?: string | null;
  error?: string | null;
}

class AtlasDB {
  private data: {
    agents: Record<string, DBAgent>;
    tasks: Record<string, DBTask>;
    audit_logs: any[];
  };
  private dirty = false;

  constructor() {
    const dbDir = require("path").dirname(DB_PATH);
    if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
    if (existsSync(DB_PATH)) {
      try { this.data = JSON.parse(readFileSync(DB_PATH, "utf-8")); } catch { this.data = this.getDefault(); }
    } else { this.data = this.getDefault(); this.save(); }
  }

  private getDefault() {
    return { agents: {}, tasks: {}, audit_logs: [] };
  }

  private save() {
    if (this.dirty) {
      writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
      this.dirty = false;
    }
  }

  getAgents(): DBAgent[] {
    return Object.values(this.data.agents).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getAgent(id: string): DBAgent | null {
    return this.data.agents[id] || null;
  }

  upsertAgent(id: string, role: string, state: string, workspacePath: string, lastMessageAt?: string) {
    const now = new Date().toISOString();
    this.data.agents[id] = {
      id, role, state, workspace_path: workspacePath, last_message_at: lastMessageAt,
      created_at: this.data.agents[id]?.created_at || now,
      updated_at: now,
    };
    this.dirty = true; this.save();
  }

  createTask(agentId: string, payload: object): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    this.data.tasks[id] = { id, agent_id: agentId, status: "queued", payload, created_at: new Date().toISOString() };
    this.dirty = true; this.save();
    return id;
  }

  getTasks(limit = 50): DBTask[] {
    const tasks = Object.values(this.data.tasks).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return tasks.slice(0, limit);
  }

  updateTaskStatus(taskId: string, status: DBTask['status'], error?: string) {
    if (this.data.tasks[taskId]) {
      this.data.tasks[taskId].status = status;
      this.data.tasks[taskId].completed_at = new Date().toISOString();
      if (error) this.data.tasks[taskId].error = error;
      this.dirty = true; this.save();
    }
  }

  logAudit(params: { endpoint: string; method: string; user?: string; action: string; details?: object }) {
    this.data.audit_logs.push({
      timestamp: new Date().toISOString(),
      endpoint: params.endpoint,
      method: params.method,
      user: params.user?.slice(0,8) || "unknown",
      action: params.action,
      details: params.details || null,
    });
    this.dirty = true; this.save();
  }

  getAuditLogs(limit = 100): any[] {
    return this.data.audit_logs.slice(-limit).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  health() {
    return {
      dbSize: JSON.stringify(this.data).length,
      agentsCount: Object.keys(this.data.agents).length,
      tasksCount: Object.keys(this.data.tasks).length,
      auditLogsCount: this.data.audit_logs.length,
    };
  }
}

let dbInstance: AtlasDB | null = null;
export function getDB() { if (!dbInstance) dbInstance = new AtlasDB(); return dbInstance; }
