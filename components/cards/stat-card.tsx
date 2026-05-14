'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  trendDirection?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink'
  description?: string
  format?: 'number' | 'currency' | 'percent' | undefined
}

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400',
  purple: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
  red: 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400',
  pink: 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400',
}

const formatValue = (value: number | string, format?: string): string => {
  if (typeof value === 'string') return value

  switch (format) {
    case 'currency':
      return `৳ ${value.toLocaleString('bn-BD')}`
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'number':
    default:
      return value.toLocaleString('bn-BD')
  }
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  color = 'blue',
  description,
  format,
}: StatCardProps) => {
  const showTrend = trend !== undefined && trend !== 0

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {formatValue(value, format)}
          </h3>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {description}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>

      {showTrend && (
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center gap-0.5 text-sm font-semibold ${
              trendDirection === 'up'
                ? 'text-green-600 dark:text-green-400'
                : trendDirection === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-500'
            }`}
          >
            {trendDirection === 'up' && <TrendingUp className="w-4 h-4" />}
            {trendDirection === 'down' && <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {trendDirection === 'up' ? 'বৃদ্ধি' : trendDirection === 'down' ? 'হ্রাস' : 'স্থিতিশীল'}
          </span>
        </div>
      )}
    </div>
  )
}
