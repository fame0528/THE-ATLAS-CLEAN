/**
 * MemoryHealth — displays memory system health metrics
 *
 * Shows: index status, last indexed, total docs, provider, compression, QMD latency.
 */

'use client'

import React from 'react'
import { MemoryHealth as MemoryHealthType } from '@/types/telemetry'

interface MemoryHealthProps {
  data: MemoryHealthType
}

function formatLastIndexed(date: Date | null): string {
  if (!date) return 'Never'
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffM = Math.floor(diffMs / 60000)
  if (diffM < 60) return `${diffM}m ago`
  const diffH = Math.floor(diffM / 60)
  return `${diffH}h ago`
}

const statusStyles = {
  healthy: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20',
  degraded: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20',
  offline: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20',
  unknown: 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700/20',
}

export default function MemoryHealth({ data }: MemoryHealthProps) {
  const {
    provider,
    indexStatus,
    lastIndexTime,
    totalDocuments,
    compressionRatio,
    qmdLatencyMs,
  } = data

  return (
    <div
      className={`
        rounded-lg border-2 p-6
        ${statusStyles[indexStatus]}
      `.trim()}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        Memory Health
      </h3>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Provider</span>
          <span className="text-sm font-mono font-semibold uppercase">{provider}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Index Status</span>
          <span
            className={`
              inline-flex px-2 py-1 text-xs font-semibold rounded-full
              ${indexStatus === 'healthy' ? 'bg-green-200 text-green-800' : ''}
              ${indexStatus === 'degraded' ? 'bg-yellow-200 text-yellow-800' : ''}
              ${indexStatus === 'offline' ? 'bg-red-200 text-red-800' : ''}
              ${indexStatus === 'unknown' ? 'bg-gray-200 text-gray-800' : ''}
            `.trim()}
          >
            {indexStatus}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Last Indexed</span>
          <span className="text-sm font-medium">{formatLastIndexed(lastIndexTime)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Total Docs</span>
          <span className="text-sm font-mono font-semibold">{totalDocuments.toLocaleString()}</span>
        </div>

        {compressionRatio !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Compression</span>
            <span className="text-sm font-medium">{(compressionRatio * 100).toFixed(0)}%</span>
          </div>
        )}

        {qmdLatencyMs !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">QMD Latency</span>
            <span className="text-sm font-medium">{qmdLatencyMs}ms</span>
          </div>
        )}
      </div>
    </div>
  )
}
