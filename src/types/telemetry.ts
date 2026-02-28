/**
 * Telemetry module type definitions for THE ATLAS dashboard
 */

/** Agent runtime state */
export type AgentState = 'idle' | 'running' | 'error' | 'offline'

/** Summary information about an agent */
export interface AgentInfo {
  id: string
  role: string
  workspacePath: string
  lastHeartbeat: Date | null
  state: AgentState
  uptime?: number // seconds, if available
}

/** Queue depth information */
export interface QueueInfo {
  deliveryQueueCount: number
  lastProcessedId?: string
  estimatedWaitSeconds?: number
}

/** Memory system health */
export interface MemoryHealth {
  provider: 'local' | 'qdrant' | 'falkor' | 'memzero'
  indexStatus: 'healthy' | 'degraded' | 'offline' | 'unknown'
  lastIndexTime: Date | null
  totalDocuments: number
  compressionRatio?: number // R-Memory efficiency
  qmdLatencyMs?: number
}

/** Cost tracking data */
export interface CostData {
  dailySpendUSD: number
  dailyBudgetUSD: number
  monthlySpendUSD: number
  monthlyBudgetUSD: number
  providerBreakdown: {
    provider: string
    spendUSD: number
    tokensUsed: number
  }[]
  forecastMonthlyUSD?: number
}

/** Overall system status */
export interface SystemStatus {
  gateway: {
    online: boolean
    uptimeSeconds: number
    version?: string
  }
  proxy: {
    online: boolean
    connectedAgents: number
  }
  memory: MemoryHealth
  queue: QueueInfo
  cost: CostData | null // null if not available
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/** Telemetry card value with optional trend */
export interface TelemetryMetric {
  title: string
  value: number | string
  unit?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  status?: 'healthy' | 'warning' | 'critical' | 'neutral'
  subtitle?: string
}
