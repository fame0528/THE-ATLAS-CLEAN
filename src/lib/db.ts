import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.ATLAS_DB_PATH || join(process.cwd(), "data", "atlas.json");

/**
 * Simple JSON-based database for MVP
 * Structure: { agents: {}, tasks: {}, audit_logs: [], memory_index_meta: {} }
 */
class AtlasDB {
  private data: any;
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
      },
    };
  }

  private save() {
    if (this.dirty) {
      writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
      this.dirty = false;
    }
  }

  // Agent operations
  getAgents() {
    return Object.values(this.data.agents).sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getAgent(id: string) {
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
  createTask(agentId: string, payload: object) {
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

  getTasks(limit = 50) {
    const tasks = Object.values(this.data.tasks).sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return tasks.slice(0, limit);
  }

  updateTaskStatus(taskId: string, status: string, error?: string) {
    if (this.data.tasks[taskId]) {
      this.data.tasks[taskId].status = status;
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
    this.data.audit_logs.push({
      timestamp: new Date().toISOString(),
      endpoint: params.endpoint,
      method: params.method,
      user: params.user?.slice(0, 8) || "unknown",
      action: params.action,
      details: params.details || null,
    });
    this.dirty = true;
    this.save();
  }

  getAuditLogs(limit = 100) {
    return this.data.audit_logs
      .slice(-limit)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Memory meta operations
  updateMemoryIndex(lastIndexed: string, count: number) {
    this.data.memory_index_meta.last_indexed = lastIndexed;
    this.data.memory_index_meta.document_count = count;
    this.dirty = true;
    this.save();
  }

  getMemoryIndexMeta() {
    return this.data.memory_index_meta;
  }

  // Health check
  health() {
    return {
      dbSize: JSON.stringify(this.data).length,
      agentsCount: Object.keys(this.data.agents).length,
      tasksCount: Object.keys(this.data.tasks).length,
      auditLogsCount: this.data.audit_logs.length,
    };
  }

  close() {
    this.save();
  }
}

let dbInstance: AtlasDB | null = null;

export function getDB() {
  if (!dbInstance) {
    dbInstance = new AtlasDB();
  }
  return dbInstance;
}
