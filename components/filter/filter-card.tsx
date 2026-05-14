/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterField {
  id: string
  label: string
  type: 'text' | 'select' | 'date' | 'date-range'
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  value?: string | { from: string; to: string }
}

interface FilterCardProps {
  fields: FilterField[]
  onFilterChange: (filters: Record<string, any>) => void
  onReset?: () => void
  className?: string
  hideReset?: boolean
}

export function FilterCard({
  fields,
  onFilterChange,
  onReset,
  className,
  hideReset,
}: FilterCardProps) {
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  })

  const handleFilterChange = (fieldId: string, value: any) => {
    const newFilters = { ...filters, [fieldId]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDateRangeChange = (type: 'from' | 'to', value: string) => {
    const newRange = { ...dateRange, [type]: value }
    setDateRange(newRange)
    handleFilterChange('dateRange', newRange)
  }

  const handleReset = () => {
    setFilters({})
    setDateRange({ from: '', to: '' })
    onReset?.()
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== '' && v !== undefined
  )

  return (
    <Card className={cn('bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800', className)}>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </Label>

              {field.type === 'text' && (
                <Input
                  id={field.id}
                  type="text"
                  placeholder={field.placeholder}
                  value={filters[field.id] || ''}
                  onChange={(e) => handleFilterChange(field.id, e.target.value)}
                  className="h-10 text-sm"
                />
              )}

              {field.type === 'select' && (
                <Select
                  value={filters[field.id] || ''}
                  onValueChange={(value) => handleFilterChange(field.id, value)}
                >
                  <SelectTrigger id={field.id} className="h-10 text-sm">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === 'date' && (
                <Input
                  id={field.id}
                  type="date"
                  value={filters[field.id] || ''}
                  onChange={(e) => handleFilterChange(field.id, e.target.value)}
                  className="h-10 text-sm"
                />
              )}

              {field.type === 'date-range' && (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    placeholder="From"
                    value={dateRange.from}
                    onChange={(e) => handleDateRangeChange('from', e.target.value)}
                    className="h-10 text-sm"
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    value={dateRange.to}
                    onChange={(e) => handleDateRangeChange('to', e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {!hideReset && hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}