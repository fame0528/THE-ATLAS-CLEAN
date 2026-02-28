/**
 * QueueDepth — Large numeric display for delivery queue size
 *
 * Shows current queue count with optional trend and status color.
 * Status: critical if > 100, warning if > 20, healthy otherwise.
 */

'use client'

import React from 'react'
import { QueueInfo } from '@/types/telemetry'

interface QueueDepthProps {
  data: QueueInfo
}

function getQueueStatus(count: number): 'critical' | 'warning' | 'healthy' {
  if (count > 100) return 'critical'
  if (count > 20) return 'warning'
  return 'healthy'
}

export default function QueueDepth({ data }: QueueDepthProps) {
  const { deliveryQueueCount, estimatedWaitSeconds } = data
  const status = getQueueStatus(deliveryQueueCount)

  const statusStyles = {
    critical: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20',
    warning: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20',
    healthy: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20',
  }

  return (
    <div
      className={`
        rounded-lg border-2 p-6 text-center
        ${statusStyles[status]}
      `.trim()}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        Queue Depth
      </h3>
      <div className="mt-4">
        <span className="text-5xl font-bold">
          {deliveryQueueCount}
        </span>
      </div>
      {estimatedWaitSeconds !== undefined && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Est. wait: {estimatedWaitSeconds}s
        </p>
      )}
      {data.lastProcessedId && (
        <p className="mt-1 text-xs text-gray-400">
          Last: {data.lastProcessedId}
        </p>
      )}
    </div>
  )
}
