/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { IZoomMeeting, ZoomMeetingFormData } from "@/types/admin";

const zoomFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start date & time is required"),
  duration: z.coerce.number().min(15, "Minimum duration is 15 minutes"),
  courseId: z.string().min(1, "Please select a course"),
  instructorId: z.string().min(1, "Please select an instructor"),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});


function toDatetimeLocal(value: string | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

interface ZoomFormProps {
  meeting?: IZoomMeeting;
  courses: Array<{ _id: string; title: string }>;
  instructors: Array<{ _id: string; name: string }>;
  isLoading?: boolean;
  onSubmit: (data: ZoomMeetingFormData) => Promise<void>;
}

export function ZoomForm({
  meeting,
  courses,
  instructors,
  isLoading = false,
  onSubmit,
}: ZoomFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZoomMeetingFormData>({
    resolver: zodResolver(zoomFormSchema as any),
    defaultValues: {
      topic: meeting?.topic ?? "",
      description: meeting?.description ?? "",
      // Normalise to the format datetime-local needs
      startTime: toDatetimeLocal(meeting?.startTime),
      duration: meeting?.duration ?? 60,
      courseId: meeting?.courseId ?? "",
      instructorId: meeting?.instructorId ?? "",
      status: meeting?.status ?? "SCHEDULED",
    },
  });

  const handleFormSubmit = async (data: ZoomMeetingFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("ZoomForm submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Topic */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Meeting Topic
        </label>
        <Input
          placeholder="e.g., Calculus Lecture Session 1"
          {...register("topic")}
        />
        <FieldError message={errors.topic?.message} />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Description{" "}
          <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <Textarea
          placeholder="Meeting description and agenda..."
          className="resize-none"
          rows={3}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* Start Date & Time */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Start Date &amp; Time
        </label>
        <Input type="datetime-local" {...register("startTime")} />
        <FieldError message={errors.startTime?.message} />
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Duration (Minutes)
        </label>
        <Input
          type="number"
          min={15}
          step={15}
          placeholder="60"
          {...register("duration")}
        />
        <p className="text-sm text-muted-foreground">Minimum 15 minutes</p>
        <FieldError message={errors.duration?.message} />
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
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.status?.message} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {meeting ? "Update Meeting" : "Schedule Meeting"}
      </Button>
    </form>
  );
}
