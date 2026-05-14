'use client'

import { cn } from '@/lib/utils'

export type BadgeStatus = 'success' | 'pending' | 'failed' | 'warning' | 'active' | 'inactive'

interface StatusBadgeProps {
  status: BadgeStatus
  label: string
  className?: string
}

const statusStyles: Record<BadgeStatus, { bg: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: '✓',
  },
  pending: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-300',
    icon: '⏳',
  },
  failed: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    text: 'text-red-700 dark:text-red-300',
    icon: '✕',
  },
  warning: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    text: 'text-orange-700 dark:text-orange-300',
    icon: '!',
  },
  active: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-700 dark:text-blue-300',
    icon: '●',
  },
  inactive: {
    bg: 'bg-gray-50 dark:bg-gray-950/20',
    text: 'text-gray-700 dark:text-gray-300',
    icon: '○',
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        style.bg,
        style.text,
        className
      )}
    >
      <span className="text-xs">{style.icon}</span>
      {label}
    </span>
  )
}