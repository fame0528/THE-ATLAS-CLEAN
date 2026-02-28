// Core types for ATLAS dashboard
// All interfaces used across the application

export interface Agent {
  id: string;
  role: string;
  workspacePath: string;
  status: 'idle' | 'running' | 'error';
  lastMessageTime: Date | null;
  memoryHealth?: MemoryHealth;
}

export interface MemoryHealth {
  indexStatus: 'ok' | 'stale' | 'error';
  lastIndexTime: Date | null;
  provider: 'local' | 'remote';
  indexSize?: number;
}

export interface Task {
  id: string;
  agentId: string;
  type: 'inbox' | 'processing' | 'completed' | 'failed';
  payload: Record<string, unknown>;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface QueueDepth {
  deliveryQueue: number;
  lastProcessedId?: string;
}

export interface GatewayStatus {
  online: boolean;
  uptime?: number;
  version?: string;
  lastHeartbeat: Date | null;
}

export interface CostMetrics {
  dailySpend?: number;
  monthlySpend?: number;
  tokenUsage: {
    total: number;
    prompt: number;
    completion: number;
  };
  agentBreakdown?: Record<string, number>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  agentId?: string;
  action: string;
  details: Record<string, unknown>;
  outcome: 'success' | 'failure';
  error?: string;
}

export interface SystemMetrics {
  gateway: GatewayStatus;
  agents: Agent[];
  queueDepth: QueueDepth;
  memoryHealth: MemoryHealth;
  cost?: CostMetrics;
  lastUpdated: Date;
}

export interface OpenClawAdapterResponse<T = unknown> {
  data?: T;
  error?: string;
  status: 'ok' | 'error';
}
