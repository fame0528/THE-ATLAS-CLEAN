/**
 * AgentList — Table component showing all swarm agents
 *
 * Displays: ID, Role, State, Last Heartbeat, Uptime
 * Color-coded state badges with relative time formatting.
 */

'use client'

import React from 'react'
import { AgentInfo, AgentState } from '@/types/telemetry'

const stateStyles: Record<AgentState, string> = {
  idle: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  running: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200',
  offline: 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400',
}

interface AgentListProps {
  agents: AgentInfo[]
}

function formatUptime(seconds?: number): string {
  if (!seconds) return '-'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never'
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffM = Math.floor(diffMs / 60000)
  if (diffM < 1) return 'Just now'
  if (diffM < 60) return `${diffM}m ago`
  const diffH = Math.floor(diffM / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
}

export default function AgentList({ agents }: AgentListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              State
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Heartbeat
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uptime
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {agent.id}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {agent.role}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${stateStyles[agent.state]}
                  `.trim()}
                >
                  {agent.state}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeTime(agent.lastHeartbeat)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatUptime(agent.uptime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
