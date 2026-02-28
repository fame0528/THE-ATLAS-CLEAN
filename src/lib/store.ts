import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = process.env.ATLAS_DATA_DIR || join(process.cwd(), 'data');

export interface Agent {
  id: string;
  role: string;
  lastSeen: number;
  state: 'idle' | 'running' | 'error' | 'offline';
  workspacePath: string;
  lastMessage?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  agentId: string;
  action: string;
  details: Record<string, any>;
  result: 'success' | 'failure';
  error?: string;
}

export class JsonStore {
  private agentsPath: string;
  private auditPath: string;

  constructor() {
    this.agentsPath = join(DATA_DIR, 'agents.json');
    this.auditPath = join(DATA_DIR, 'audit.json');
  }

  async ensureDir() {
    const dir = dirname(this.agentsPath);
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  }

  async load<T>(path: string, defaultValue: T): Promise<T> {
    try {
      const content = await readFile(path, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      return defaultValue;
    }
  }

  async save<T>(path: string, data: T): Promise<void> {
    await writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getAgents(): Promise<Agent[]> {
    await this.ensureDir();
    return this.load<Agent[]>(this.agentsPath, []);
  }

  async upsertAgent(agent: Agent): Promise<void> {
    const agents = await this.getAgents();
    const idx = agents.findIndex(a => a.id === agent.id);
    if (idx >= 0) agents[idx] = agent;
    else agents.push(agent);
    await this.save(this.agentsPath, agents);
  }

  async appendAudit(entry: AuditEntry): Promise<void> {
    await this.ensureDir();
    const audit = await this.load<AuditEntry[]>(this.auditPath, []);
    audit.push(entry);
    if (audit.length > 10000) audit.splice(0, audit.length - 10000);
    await this.save(this.auditPath, audit);
  }

  async getRecentAudit(limit: number = 100): Promise<AuditEntry[]> {
    await this.ensureDir();
    const audit = await this.load<AuditEntry[]>(this.auditPath, []);
    return audit.slice(-limit);
  }
}

let storeInstance: JsonStore | null = null;

export function getStore(): JsonStore {
  if (!storeInstance) storeInstance = new JsonStore();
  return storeInstance;
}