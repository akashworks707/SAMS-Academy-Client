/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Subject } from "@/types";

const subjectFormSchema = z.object({
  name: z.string().min(2, "বিষয়ের নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  code: z.string().min(2, "কোড প্রবেশ করুন"),
  creditHours: z.string().min(1, "ক্রেডিট ঘন্টা নির্বাচন করুন"),
  classes: z.array(z.string()).min(1, "কমপক্ষে একটি ক্লাস নির্বাচন করুন"),
  status: z.enum(["active", "inactive"]),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface SubjectFormProps {
  initialData?: Subject;
  onSubmit: (data: Omit<Subject, "id">) => Promise<void>;
  isLoading?: boolean;
}

export const SubjectForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: SubjectFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
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
          name: "",
          code: "",
          creditHours: "",
          classes: [],
          status: "active",
        },
  });

  const statusValue = watch("status");
  const creditValue = watch("creditHours");
  const classesValue = watch("classes") ?? [];

  const handleFormSubmit = async (values: SubjectFormValues) => {
    await onSubmit({
      ...values,
      creditHours: parseInt(values.creditHours),
    });
    reset();
  };

  const classList = ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম", "একাদশ", "দ্বাদশ"];
  const creditOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  const toggleClass = (cls: string, checked: boolean) => {
    const current = classesValue;
    const updated = checked
      ? [...current, cls]
      : current.filter((c) => c !== cls);
    setValue("classes", updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Name */}
        <div className="space-y-2">
          <Label htmlFor="name">বিষয়ের নাম</Label>
          <Input
            id="name"
            placeholder="যেমন: গণিত, ইংরেজি"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code">বিষয় কোড</Label>
          <Input id="code" placeholder="যেমন: MTH-101" {...register("code")} />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        {/* Credit Hours */}
        <div className="space-y-2">
          <Label>ক্রেডিট ঘন্টা</Label>
          <Select
            value={creditValue}
            onValueChange={(val: any) =>
              setValue("creditHours", val, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {creditOptions.map((credit) => (
                <SelectItem key={credit} value={credit.toString()}>
                  {credit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.creditHours && (
            <p className="text-sm text-destructive">
              {errors.creditHours.message}
            </p>
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
          checked={statusValue === "active"}
          onCheckedChange={(checked) =>
            setValue("status", checked ? "active" : "inactive", {
              shouldValidate: true,
            })
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "প্রসেসিং..." : initialData ? "আপডেট করুন" : "যোগ করুন"}
      </Button>
    </form>
  );
};
