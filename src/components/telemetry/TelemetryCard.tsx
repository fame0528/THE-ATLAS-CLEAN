/**
 * TelemetryCard — Reusable metric display component
 *
 * Shows a single metric with optional trend and status color.
 * Designed for clean, compact display in a grid dashboard.
 */

'use client'

import React from 'react'

export interface TelemetryCardProps {
  /** Card title (e.g., "Gateway Uptime") */
  title: string
  /** Main value to display */
  value: number | string
  /** Unit label (e.g., "ms", "s", "USD") */
  unit?: string
  /** Trend: up/down/neutral with optional percentage */
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label?: string // e.g., "vs last hour"
  }
  /** Status color for border/accent */
  status?: 'healthy' | 'warning' | 'critical' | 'neutral'
  /** Optional subtitle below value */
  subtitle?: string
  /** Additional CSS classes */
  className?: string
}

const statusColors = {
  healthy: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  critical: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  neutral: 'border-gray-300 bg-white dark:bg-gray-800',
}

const trendStyles = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-500',
}

export default function TelemetryCard({
  title,
  value,
  unit,
  trend,
  status = 'neutral',
  subtitle,
  className = '',
}: TelemetryCardProps) {
  return (
    <div
      className={`
        rounded-lg border-l-4 p-4 shadow-sm transition-colors
        ${statusColors[status]}
        ${className}
      `.trim()}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
      {trend && (
        <div className={`mt-2 text-sm font-medium ${trendStyles[trend.direction]}`}>
          {trend.direction === 'up' && '↑'}
          {trend.direction === 'down' && '↓'}
          {trend.direction === 'neutral' && '→'}
          {' '}{trend.value}{trend.label || ''}
        </div>
      )}
    </div>
  )
}
