import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.ATLAS_DB_PATH || join(process.cwd(), "data", "atlas.json");

// Agent record as stored in DB
export interface DBAgent {
  id: string;
  role: string;
  state: string;
  workspace_path: string;
  last_message_at?: string | null;
  updated_at: string;
  created_at: string;
}

// Task record as stored in DB
export interface DBTask {
  id: string;
  agent_id: string;
  status: 'queued' | 'running' | 'completed' | 'error';
  payload: object;
  created_at: string;
  completed_at?: string | null;
  error?: string | null;
}

// Audit log entry
export interface DBAudit {
  timestamp: string;
  endpoint: string;
  method: string;
  user: string;
  action: string;
  details: object | null;
}

// Memory index meta
export interface DBMemoryMeta {
  id: number;
  last_indexed: string | null;
  provider: string;
  document_count: number;
}

/**
 * Simple JSON-based database for MVP
 * Structure: { agents: {}, tasks: {}, audit_logs: [], memory_index_meta: {} }
 */
class AtlasDB {
  private data: {
    agents: Record<string, DBAgent>;
    tasks: Record<string, DBTask>;
    audit_logs: DBAudit[];
    memory_index_meta: DBMemoryMeta;
  };
  private dirty = false;

  constructor() {
    // Ensure data directory exists
    const dbDir = require("path").dirname(DB_PATH);
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    // Load existing or initialize
    if (existsSync(DB_PATH)) {
      try {
        this.data = JSON.parse(readFileSync(DB_PATH, "utf-8"));
      } catch {
        this.data = this.getDefaultData();
      }
    } else {
      this.data = this.getDefaultData();
      this.save();
    }
  }

  private getDefaultData() {
    return {
      agents: {},
      tasks: {},
      audit_logs: [],
      memory_index_meta: {
        id: 1,
        last_indexed: null,
        provider: "local",
        document_count: 0,
      } as DBMemoryMeta,
    };
  }

  private save() {
    if (this.dirty) {
      writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
      this.dirty = false;
    }
  }

  // Agent operations
  getAgents(): DBAgent[] {
    return Object.values(this.data.agents).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getAgent(id: string): DBAgent | null {
    return this.data.agents[id] || null;
  }

  upsertAgent(
    id: string,
    role: string,
    state: string,
    workspacePath: string,
    lastMessageAt?: string
  ) {
    const now = new Date().toISOString();
    this.data.agents[id] = {
      id,
      role,
      state,
      workspace_path: workspacePath,
      last_message_at: lastMessageAt,
      created_at: this.data.agents[id]?.created_at || now,
      updated_at: now,
    };
    this.dirty = true;
    this.save();
  }

  // Task operations
  createTask(agentId: string, payload: object): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    this.data.tasks[id] = {
      id,
      agent_id: agentId,
      status: "queued",
      payload,
      created_at: new Date().toISOString(),
      completed_at: null,
      error: null,
    };
    this.dirty = true;
    this.save();
    return id;
  }

  getTasks(limit = 50): DBTask[] {
    const tasks = Object.values(this.data.tasks).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return tasks.slice(0, limit);
  }

  updateTaskStatus(taskId: string, status: string, error?: string) {
    if (this.data.tasks[taskId]) {
      this.data.tasks[taskId].status = status as DBTask['status'];
      this.data.tasks[taskId].completed_at = new Date().toISOString();
      if (error) this.data.tasks[taskId].error = error;
      this.dirty = true;
      this.save();
    }
  }

  // Audit operations
  logAudit(params: {
    endpoint: string;
    method: string;
    user?: string;
    action: string;
    details?: object;
  }) {
    const entry: DBAudit = {
      timestamp: new Date().toISOString(),
      endpoint: params.endpoint,
      method: params.method,
      user: params.user?.slice(0, 8) || "unknown",
      action: params.action,
      details: params.details || null,
    };
    this.data.audit_logs.push(entry);
    this.dirty = true;
    this.save();
  }

  getAuditLogs(limit = 100): DBAudit[] {
    return this.data.audit_logs
      .slice(-limit)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Memory meta operations
  updateMemoryIndex(lastIndexed: string, count: number) {
    this.data.memory_index_meta.last_indexed = lastIndexed;
    this.data.memory_index_meta.document_count = count;
    this.dirty = true;
    this.save();
  }

  getMemoryIndexMeta(): DBMemoryMeta {
    return this.data.memory_index_meta;
  }

  /** Health check summary */
  health() {
    const agents = this.getAgents();
    const tasks = this.getTasks(100);
    const activeAgents = agents.filter(a => a.state === 'running' || a.state === 'idle').length;
    const queuedTasks = tasks.filter(t => t.status === 'queued').length;
    const runningTasks = tasks.filter(t => t.status === 'running').length;
    return {
      agents: { total: agents.length, active: activeAgents },
      tasks: { total: tasks.length, queued: queuedTasks, running: runningTasks },
      memory: this.getMemoryIndexMeta(),
      uptime: process.uptime ? process.uptime() : null,
    };
  }
}

// Singleton instance
let dbInstance: AtlasDB | null = null;

export function getDB(): AtlasDB {
  if (!dbInstance) {
    dbInstance = new AtlasDB();
  }
  return dbInstance;
}
