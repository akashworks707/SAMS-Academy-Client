/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { Student } from '@/types'

const studentFormSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  email: z.string().email('সঠিক ইমেইল প্রবেশ করুন'),
  phone: z.string().min(10, 'সঠিক ফোন নম্বর প্রবেশ করুন'),
  class: z.string().min(1, 'ক্লাস নির্বাচন করুন'),
  status: z.enum(['active', 'inactive']),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

interface StudentFormProps {
  initialData?: Student
  onSubmit: (data: Omit<Student, 'id'>) => Promise<void>
  isLoading?: boolean
}

export const StudentForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          class: initialData.class,
          status: initialData.status,
        }
      : {
          name: '',
          email: '',
          phone: '',
          class: '',
          status: 'active',
        },
  })

  const statusValue = watch('status')
  const classValue = watch('class')

  const handleFormSubmit = async (values: StudentFormValues) => {
    await onSubmit({
      ...values,
      enrollmentDate:
        initialData?.enrollmentDate || new Date().toISOString().split('T')[0],
      avatar: initialData?.avatar,
    })
    reset()
  }

  const classes = ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম', 'একাদশ', 'দ্বাদশ']

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">শিক্ষার্থীর নাম</Label>
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
          <Label htmlFor="phone">মোবাইল নম্বর</Label>
          <Input id="phone" placeholder="০১X-XXXXXXXX" {...register('phone')} />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Class */}
        <div className="space-y-2">
          <Label>ক্লাস</Label>
          <Select
            value={classValue}
            onValueChange={(val: any) => setValue('class', val, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="ক্লাস নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class && (
            <p className="text-sm text-destructive">{errors.class.message}</p>
          )}
        </div>
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