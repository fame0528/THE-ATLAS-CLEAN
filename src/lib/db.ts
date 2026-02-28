import Database from "better-sqlite3";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.ATLAS_DB_PATH || join(process.cwd(), "data", "atlas.db");

export class AtlasDB {
  private db: Database.Database;

  constructor() {
    // Ensure data directory exists
    const dbDir = require("path").dirname(DB_PATH);
    if (!existsSync(dbDir)) {
      require("fs").mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(DB_PATH);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.initialize();
  }

  private initialize() {
    // Agents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        state TEXT NOT NULL DEFAULT 'idle',
        last_message_at TEXT,
        workspace_path TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Tasks table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued',
        payload TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT,
        error TEXT,
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
      );
    `);

    // Audit logs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT DEFAULT (datetime('now')),
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        user TEXT,
        action TEXT NOT NULL,
        details TEXT
      );
    `);

    // Memory index metadata
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memory_index_meta (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        last_indexed TEXT,
        provider TEXT DEFAULT 'local',
        document_count INTEGER DEFAULT 0
      );
    `);

    // Insert default meta row if not exists
    const meta = this.db.prepare("SELECT * FROM memory_index_meta WHERE id = 1").get();
    if (!meta) {
      this.db
        .prepare("INSERT INTO memory_index_meta (id) VALUES (1)")
        .run();
    }
  }

  // Agent operations
  getAgents() {
    return this.db.prepare("SELECT * FROM agents ORDER BY created_at DESC").all();
  }

  getAgent(id: string) {
    return this.db.prepare("SELECT * FROM agents WHERE id = ?").get(id);
  }

  upsertAgent(
    id: string,
    role: string,
    state: string,
    workspacePath: string,
    lastMessageAt?: string
  ) {
    const stmt = this.db.prepare(`
      INSERT INTO agents (id, role, state, workspace_path, last_message_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        role = excluded.role,
        state = excluded.state,
        workspace_path = excluded.workspace_path,
        last_message_at = excluded.last_message_at,
        updated_at = datetime('now')
    `);
    stmt.run(id, role, state, workspacePath, lastMessageAt);
  }

  // Task operations
  createTask(agentId: string, payload: object) {
    const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    this.db
      .prepare("INSERT INTO tasks (id, agent_id, status, payload) VALUES (?, ?, ?, ?)")
      .run(id, agentId, "queued", JSON.stringify(payload));
    return id;
  }

  getTasks(limit = 50) {
    return this.db
      .prepare("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?")
      .all(limit);
  }

  updateTaskStatus(taskId: string, status: string, error?: string) {
    const stmt = this.db.prepare(`
      UPDATE tasks SET status = ?, completed_at = datetime('now'), error = ?
      WHERE id = ?
    `);
    stmt.run(status, error || null, taskId);
  }

  // Audit operations
  logAudit(params: {
    endpoint: string;
    method: string;
    user?: string;
    action: string;
    details?: object;
  }) {
    this.db
      .prepare(
        "INSERT INTO audit_logs (endpoint, method, user, action, details) VALUES (?, ?, ?, ?, ?)"
      )
      .run(
        params.endpoint,
        params.method,
        params.user || null,
        params.action,
        params.details ? JSON.stringify(params.details) : null
      );
  }

  getAuditLogs(limit = 100) {
    return this.db
      .prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?")
      .all(limit);
  }

  // Memory meta operations
  updateMemoryIndex(lastIndexed: string, count: number) {
    this.db
      .prepare(
        "UPDATE memory_index_meta SET last_indexed = ?, document_count = ? WHERE id = 1"
      )
      .run(lastIndexed, count);
  }

  getMemoryIndexMeta() {
    return this.db.prepare("SELECT * FROM memory_index_meta WHERE id = 1").get();
  }

  // Health check
  health() {
    return {
      dbSize: this.db.totalChanges,
      agentsCount: this.db.prepare("SELECT COUNT(*) as c FROM agents").get().c,
      tasksCount: this.db.prepare("SELECT COUNT(*) as c FROM tasks").get().c,
    };
  }

  close() {
    this.db.close();
  }
}

let dbInstance: AtlasDB | null = null;

export function getDB() {
  if (!dbInstance) {
    dbInstance = new AtlasDB();
  }
  return dbInstance;
}
