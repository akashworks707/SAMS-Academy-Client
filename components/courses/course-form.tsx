/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ICourse, CourseFormData } from "@/types/admin";

const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  code: z.string().min(2, "Course code must be at least 2 characters"),
  credits: z.coerce.number().min(1).max(10),
  instructorId: z.string().min(1, "Please select an instructor"),
  status: z.enum(["upcoming", "running", "completed"]),
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

interface CourseFormProps {
  course?: ICourse;
  instructors: Array<{ _id: string; name: string }>;
  isLoading?: boolean;
  onSubmit: (data: CourseFormData) => Promise<void>;
}

export function CourseForm({
  course,
  instructors,
  isLoading = false,
  onSubmit,
}: CourseFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema as any),
    defaultValues: {
      title: course?.title ?? "",
      description: course?.description ?? "",
      code: course?.code ?? "",
      credits: course?.credits ?? 3,
      instructorId: course?.instructorId ?? "",
      status: course?.status ?? "running",
    },
  });

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("CourseForm submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Course Title</label>
        <Input
          placeholder="e.g., Advanced Mathematics"
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Description</label>
        <Textarea
          placeholder="Describe the course..."
          className="resize-none"
          rows={4}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* Code + Credits side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Course Code
          </label>
          <Input placeholder="e.g., MATH301" {...register("code")} />
          <FieldError message={errors.code?.message} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">Credits</label>
          <Input type="number" min={1} max={10} {...register("credits")} />
          <FieldError message={errors.credits?.message} />
        </div>
      </div>

      {/* Instructor */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Instructor</label>
        <Controller
          control={control}
          name="instructorId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.instructorId?.message} />
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
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.status?.message} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {course ? "Update Course" : "Create Course"}
      </Button>
    </form>
  );
}
