/**
 * THE ATLAS Dashboard — Client component with polling
 *
 * Contains all the client-side logic and UI.
 */

'use client'

import { useEffect, useState } from 'react'
import { SystemStatus, AgentInfo, QueueInfo, CostData, AgentState } from '@/types/telemetry'
import TelemetryCard from '@/components/telemetry/TelemetryCard'
import AgentList from '@/components/telemetry/AgentList'
import QueueDepth from '@/components/telemetry/QueueDepth'
import MemoryHealth from '@/components/telemetry/MemoryHealth'
import CostPanel from '@/components/telemetry/CostPanel'

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [agents, setAgents] = useState<AgentInfo[]>([])
  const [queue, setQueue] = useState<QueueInfo | null>(null)
  const [cost, setCost] = useState<CostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      const [statusRes, agentsRes, queueRes, costRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/agents'),
        fetch('/api/queue'),
        fetch('/api/cost'),
      ])

      if (!statusRes.ok || !agentsRes.ok || !queueRes.ok) {
        throw new Error('One or more API calls failed')
      }

      const statusData = await statusRes.json()
      const agentsData = await agentsRes.json()
      const queueData = await queueRes.json()
      const costData = costRes.ok ? await costRes.json() : { success: true, data: null }

      if (!statusData.success || !agentsData.success || !queueData.success) {
        throw new Error('API returned error')
      }

      setSystemStatus(statusData.data)
      setAgents(agentsData.data)
      setQueue(queueData.data)
      setCost(costData.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading telemetry...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">
          <p className="font-semibold">Error loading telemetry</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchAll}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Derived metrics for cards
  const gateway = systemStatus?.gateway
  const proxy = systemStatus?.proxy
  const memory = systemStatus?.memory
  const queueDepth = queue

  // Count agents by state
  const agentsByState: Record<AgentState, number> = {
    idle: 0,
    running: 0,
    error: 0,
    offline: 0,
  }
  agents.forEach((a) => {
    agentsByState[a.state]++
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          THE ATLAS
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          OpenClaw Swarm Telemetry Dashboard
        </p>
      </header>

      {/* Quick Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TelemetryCard
          title="Gateway"
          value={gateway?.online ? 'Online' : 'Offline'}
          status={gateway?.online ? 'healthy' : 'critical'}
          subtitle={gateway?.version ? `v${gateway.version}` : undefined}
        />
        <TelemetryCard
          title="Connected Agents"
          value={proxy?.connectedAgents || 0}
          unit="agents"
          status={proxy?.connectedAgents === 11 ? 'healthy' : 'warning'}
        />
        <TelemetryCard
          title="Active Agents"
          value={agentsByState.running}
          unit="now"
          status={agentsByState.running > 0 ? 'healthy' : 'neutral'}
        />
        <TelemetryCard
          title="Idle Agents"
          value={agentsByState.idle}
          unit="ready"
          status="neutral"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <QueueDepth data={queueDepth || { deliveryQueueCount: 0 }} />
        {memory && <MemoryHealth data={memory} />}
        <CostPanel data={cost} />
      </div>

      {/* Agent Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Swarm Agents
        </h2>
        <AgentList agents={agents} />
      </div>
    </div>
  )
}
