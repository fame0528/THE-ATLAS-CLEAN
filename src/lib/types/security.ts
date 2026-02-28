export interface AuditLogEntry {
  timestamp: string
  method: string
  endpoint: string
  tokenHash: string
  ip: string
  result: 'success' | 'fail'
  reason?: string
}

export interface RateLimitEntry {
  tokenHash: string
  ip: string
  count: number
  resetTime: number // epoch seconds
}

export interface RateLimitConfig {
  maxRequests: number
  windowSeconds: number
}
