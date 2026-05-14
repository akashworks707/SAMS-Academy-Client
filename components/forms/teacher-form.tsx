/* eslint-disable react-hooks/incompatible-library */
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { Teacher } from '@/types'

const teacherFormSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  email: z.string().email('সঠিক ইমেইল প্রবেশ করুন'),
  phone: z.string().min(10, 'সঠিক ফোন নম্বর প্রবেশ করুন'),
  specialization: z.string().min(2, 'বিশেষত্ব প্রবেশ করুন'),
  classes: z.array(z.string()).min(1, 'কমপক্ষে একটি ক্লাস নির্বাচন করুন'),
  status: z.enum(['active', 'inactive']),
})

type TeacherFormValues = z.infer<typeof teacherFormSchema>

interface TeacherFormProps {
  initialData?: Teacher
  onSubmit: (data: Omit<Teacher, 'id'>) => Promise<void>
  isLoading?: boolean
}

export const TeacherForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: TeacherFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          specialization: initialData.specialization,
          classes: initialData.classes,
          status: initialData.status,
        }
      : {
          name: '',
          email: '',
          phone: '',
          specialization: '',
          classes: [],
          status: 'active',
        },
  })

  const statusValue = watch('status')
  const classesValue = watch('classes') ?? []

  const handleFormSubmit = async (values: TeacherFormValues) => {
    await onSubmit({
      ...values,
      joinDate: initialData?.joinDate || new Date().toISOString().split('T')[0],
      avatar: initialData?.avatar,
    })
    reset()
  }

  const classList = ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম', 'একাদশ', 'দ্বাদশ']

  const toggleClass = (cls: string, checked: boolean) => {
    const current = classesValue
    const updated = checked
      ? [...current, cls]
      : current.filter((c) => c !== cls)
    setValue('classes', updated, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">শিক্ষকের নাম</Label>
          <Input id="name" placeholder="নাম প্রবেশ করুন" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">ইমেইল</Label>
          <Input
            id="email"
            type="email"
            placeholder="ইমেইল প্রবেশ করুন"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">মোবাইল</Label>
          <Input id="phone" placeholder="০১X-XXXXXXXX" {...register('phone')} />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Specialization */}
        <div className="space-y-2">
          <Label htmlFor="specialization">বিশেষত্ব</Label>
          <Input
            id="specialization"
            placeholder="যেমন: গণিত, ইংরেজি"
            {...register('specialization')}
          />
          {errors.specialization && (
            <p className="text-sm text-destructive">{errors.specialization.message}</p>
          )}
        </div>
      </div>

      {/* Classes Checkboxes */}
      <div className="space-y-2">
        <Label>ক্লাস নির্বাচন করুন</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {classList.map((cls) => (
            <label key={cls} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={classesValue.includes(cls)}
                onChange={(e) => toggleClass(cls, e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">{cls}</span>
            </label>
          ))}
        </div>
        {errors.classes && (
          <p className="text-sm text-destructive">{errors.classes.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <Label className="text-base">সক্রিয় অবস্থা</Label>
        <Switch
          checked={statusValue === 'active'}
          onCheckedChange={(checked) =>
            setValue('status', checked ? 'active' : 'inactive', { shouldValidate: true })
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'প্রসেসিং...' : initialData ? 'আপডেট করুন' : 'যোগ করুন'}
      </Button>
    </form>
  )
}