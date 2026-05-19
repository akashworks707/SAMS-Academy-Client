'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Plus, BookOpen, Users, UserCheck, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/cards/stat-card'
import { DataTable } from '@/components/table/data-table'
import { dummyClasses } from '@/lib/dummy-data'
import type { Class } from '@/types'

const Breadcrumb = ({ items }: { items: Array<{ label: string; href?: string }> }) => {
  return (
    <nav className="flex items-center gap-2 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <a
            href={item.href}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            {item.label}
          </a>
          {index < items.length - 1 && (
            <span className="text-slate-400 dark:text-slate-600">&gt;</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default function ClassesManagement() {
  const t = useTranslations()

  const stats = [
    {
      title: t('total_classes'),
      value: 56,
      icon: <BookOpen className="w-6 h-6" />,
      trend: 8.3,
      trendDirection: 'up' as const,
      color: 'blue' as const,
      description: 'সক্রিয় ক্লাস',
    },
    {
      title: 'সক্রিয় শিক্ষা মডিউল',
      value: 48,
      icon: <Layers className="w-6 h-6" />,
      trend: 5.7,
      trendDirection: 'up' as const,
      color: 'green' as const,
      description: 'শিক্ষা মডিউল',
    },
    {
      title: 'মোট ভর্তিকৃত ছাত্র',
      value: 1245,
      icon: <Users className="w-6 h-6" />,
      trend: 12.5,
      trendDirection: 'up' as const,
      color: 'purple' as const,
      description: 'সকল ক্লাসে',
    },
    {
      title: 'গড় ক্লাস সাইজ',
      value: 25,
      icon: <UserCheck className="w-6 h-6" />,
      trend: 3.2,
      trendDirection: 'up' as const,
      color: 'orange' as const,
      description: 'ছাত্র প্রতি ক্লাসে',
    },
  ]

  const columns = [
    {
      key: 'code' as const,
      label: 'ক্লাস কোড',
      width: 'w-20',
    },
    {
      key: 'name' as const,
      label: 'ক্লাসের নাম',
    },
    {
      key: 'classTeacher' as const,
      label: 'ক্লাস শিক্ষক',
    },
    {
      key: 'totalStudents' as const,
      label: 'মোট ছাত্র',
      render: (value: number) => (
        <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
      ),
    },
    {
      key: 'grade' as const,
      label: 'গ্রেড',
    },
    {
      key: 'status' as const,
      label: 'অবস্থা',
      render: (value: string) => (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
          {value === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
        </span>
      ),
    },
  ]

  const handleView = (row: Class) => {
    console.log('View:', row)
  }

  const handleEdit = (row: Class) => {
    console.log('Edit:', row)
  }

  const handleDelete = (row: Class) => {
    console.log('Delete:', row)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'ড্যাশবোর্ড', href: '/dashboard' },
          { label: 'ক্লাস' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('classes')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            সকল ক্লাস এবং শিক্ষা মডিউল পরিচালনা করুন
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('add_new_class')}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            trendDirection={card.trendDirection}
            color={card.color}
            description={card.description}
          />
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={dummyClasses}
        pageSize={10}
        title="সকল ক্লাস"
        searchable={true}
        searchKey="name"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
