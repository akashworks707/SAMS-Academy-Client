/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Subject } from '@/types'

const subjectFormSchema = z.object({
  name: z.string().min(2, 'বিষয়ের নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  code: z.string().min(2, 'কোড প্রবেশ করুন'),
  creditHours: z.string().min(1, 'ক্রেডিট ঘন্টা নির্বাচন করুন'),
  classes: z.array(z.string()).min(1, 'কমপক্ষে একটি ক্লাস নির্বাচন করুন'),
  status: z.enum(['active', 'inactive']),
})

type SubjectFormValues = z.infer<typeof subjectFormSchema>

interface SubjectFormProps {
  initialData?: Subject
  onSubmit: (data: Omit<Subject, 'id'>) => Promise<void>
  isLoading?: boolean
}

export const SubjectForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: SubjectFormProps) => {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          code: initialData.code,
          creditHours: initialData.creditHours.toString(),
          classes: initialData.classes,
          status: initialData.status,
        }
      : {
          name: '',
          code: '',
          creditHours: '',
          classes: [],
          status: 'active',
        },
  })

  const selectedClasses = watch('classes')
  const selectedStatus = watch('status')

  const handleFormSubmit = async (values: SubjectFormValues) => {
    setSubmitting(true)
    try {
      await onSubmit({
        ...values,
        creditHours: parseInt(values.creditHours),
      })
      setSuccessMessage(
        initialData ? 'বিষয় সফলভাবে আপডেট হয়েছে!' : 'বিষয় সফলভাবে যোগ হয়েছে!'
      )
      setTimeout(() => setSuccessMessage(''), 3000)
      if (!initialData) reset()
    } catch (error) {
      console.error('[v0] Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const classes = ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম', 'একাদশ', 'দ্বাদশ']
  const creditOptions = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <ScrollArea className="h-150 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
      <div className="pr-4">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 border border-emerald-200 dark:border-emerald-800 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              বিষয়ের নাম <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="যেমন: গণিত, ইংরেজি, বিজ্ঞান"
              className={`transition-all duration-200 ${
                errors.name
                  ? 'border-red-500 dark:border-red-600 focus-visible:ring-red-500'
                  : 'border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500'
              }`}
            />
            {errors.name && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Code Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              বিষয় কোড <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('code')}
              placeholder="যেমন: MTH-101, ENG-102"
              className={`transition-all duration-200 ${
                errors.code
                  ? 'border-red-500 dark:border-red-600 focus-visible:ring-red-500'
                  : 'border-slate-300 dark:border-slate-700 focus-visible:ring-emerald-500'
              }`}
            />
            {errors.code && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.code.message}
              </div>
            )}
          </div>

          {/* Credit Hours Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              ক্রেডিট ঘন্টা <span className="text-red-500">*</span>
            </label>
            <Controller
              name="creditHours"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`transition-all duration-200 ${
                      errors.creditHours
                        ? 'border-red-500 dark:border-red-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <SelectValue placeholder="ক্রেডিট ঘন্টা নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditOptions.map((credit) => (
                      <SelectItem key={credit} value={credit.toString()}>
                        {credit} ঘন্টা
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.creditHours && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.creditHours.message}
              </div>
            )}
          </div>

          {/* Classes Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              ক্লাস নির্বাচন করুন <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {classes.map((cls) => (
                <label
                  key={cls}
                  className="group cursor-pointer"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      value={cls}
                      checked={selectedClasses?.includes(cls) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue('classes', [...(selectedClasses || []), cls])
                        } else {
                          setValue('classes', selectedClasses?.filter((c) => c !== cls) || [])
                        }
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`h-10 px-3 py-2 rounded-lg border-2 flex items-center justify-center font-medium transition-all duration-200 ${
                        selectedClasses?.includes(cls)
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:border-emerald-400 dark:group-hover:border-emerald-500'
                      }`}
                    >
                      {cls}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.classes && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errors.classes.message}
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <div className="rounded-lg border-2 border-slate-200 dark:border-slate-700 p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  সক্রিয় অবস্থা
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  এই বিষয়টি সক্রিয় বা নিষ্ক্রিয় করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setValue('status', selectedStatus === 'active' ? 'inactive' : 'active')
                }
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
                  selectedStatus === 'active'
                    ? 'bg-emerald-500 dark:bg-emerald-600'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                    selectedStatus === 'active' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || isLoading}
            className={`w-full h-11 font-semibold transition-all duration-300 ${
              submitting || isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            } bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white`}
          >
            {submitting || isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                প্রসেসিং...
              </span>
            ) : initialData ? (
              'আপডেট করুন'
            ) : (
              'যোগ করুন'
            )}
          </Button>
        </form>
      </div>
    </ScrollArea>
  )
}
