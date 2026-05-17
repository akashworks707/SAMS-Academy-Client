"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Spinner } from "@/components/ui/spinner";
import { IEnrollment, EnrollmentFormData } from "@/types/admin";

const enrollmentFormSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  courseId: z.string().min(1, "Please select a course"),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "DROPPED"]),
  grade: z.string().optional(),
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

interface EnrollmentFormProps {
  enrollment?: IEnrollment;
  students: Array<{ _id: string; name: string }>;
  courses: Array<{ _id: string; title: string }>;
  isLoading?: boolean;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
}

export function EnrollmentForm({
  enrollment,
  students,
  courses,
  isLoading = false,
  onSubmit,
}: EnrollmentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      studentId: enrollment?.studentId ?? "",
      courseId: enrollment?.courseId ?? "",
      status: enrollment?.status ?? "ACTIVE",
      grade: enrollment?.grade ?? "",
    },
  });

  const handleFormSubmit = async (data: EnrollmentFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("EnrollmentForm submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Student */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Student</label>
        <Controller
          control={control}
          name="studentId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student._id} value={student._id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.studentId?.message} />
      </div>

      {/* Course */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Course</label>
        <Controller
          control={control}
          name="courseId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.courseId?.message} />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Status</label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DROPPED">Dropped</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.status?.message} />
      </div>

      {/* Grade */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Grade{" "}
          <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <Input placeholder="e.g., A+, B, C" {...register("grade")} />
        <FieldError message={errors.grade?.message} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {enrollment ? "Update Enrollment" : "Create Enrollment"}
      </Button>
    </form>
  );
}
