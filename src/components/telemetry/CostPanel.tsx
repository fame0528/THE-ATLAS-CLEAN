/**
 * CostPanel — displays cost tracking data with budget progress
 *
 * Shows: daily spend, daily budget, monthly spend, provider breakdown, forecast.
 * Uses simple progress bars for budget visualization.
 */

'use client'

import React from 'react'
import { CostData } from '@/types/telemetry'

interface CostPanelProps {
  data: CostData | null // null if tracking not available
}

export default function CostPanel({ data }: CostPanelProps) {
  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          Cost Tracking
        </h3>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
          Cost data not available yet.
        </p>
      </div>
    )
  }

  const {
    dailySpendUSD,
    dailyBudgetUSD,
    monthlySpendUSD,
    monthlyBudgetUSD,
    providerBreakdown,
    forecastMonthlyUSD,
  } = data

  const dailyPercent = Math.min((dailySpendUSD / dailyBudgetUSD) * 100, 100)
  const monthlyPercent = Math.min((monthlySpendUSD / monthlyBudgetUSD) * 100, 100)

  const getProgressColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500'
    if (percent > 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-4">
        Cost Tracking
      </h3>

      <div className="space-y-6">
        {/* Daily */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Daily</span>
            <span className="text-base font-semibold">${dailySpendUSD.toFixed(2)} / ${dailyBudgetUSD}</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(dailyPercent)} transition-all duration-500`}
              style={{ width: `${dailyPercent}%` }}
            />
          </div>
        </div>

        {/* Monthly */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Monthly</span>
            <span className="text-base font-semibold">
              ${monthlySpendUSD.toFixed(2)} / ${monthlyBudgetUSD}
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(monthlyPercent)} transition-all duration-500`}
              style={{ width: `${monthlyPercent}%` }}
            />
          </div>
        </div>

        {/* Forecast */}
        {forecastMonthlyUSD !== undefined && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Forecast</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${forecastMonthlyUSD.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Provider Breakdown */}
        {providerBreakdown.length > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
              Providers
            </h4>
            <div className="space-y-2">
              {providerBreakdown.map((provider) => (
                <div key={provider.provider} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{provider.provider}</span>
                  <span className="text-gray-900 dark:text-white font-mono">
                    ${provider.spendUSD.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
