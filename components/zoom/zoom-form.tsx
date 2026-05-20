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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

function toDatetimeLocal(value: string | Date | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(zoomFormSchema as any),
    defaultValues: {
      topic: meeting?.topic || "",
      description: meeting?.description || "",
      startTime: toDatetimeLocal(meeting?.startTime),
      duration: meeting?.duration || 60,
      courseId: meeting?.courseId || "",
      instructorId: meeting?.instructorId || "",
      status: meeting?.status || "SCHEDULED",
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
    <ScrollArea className="h-[60vh] pr-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 px-4"
      >
        {/* Topic */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Meeting Topic *
          </label>
          <Input
            placeholder="e.g., Calculus Lecture Session 1"
            className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
            {...register("topic")}
          />
          <FieldError message={errors.topic?.message} />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Description{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <Textarea
            placeholder="Meeting description and agenda..."
            className="resize-none border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
            rows={3}
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* Start Date & Time */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Start Date &amp; Time *
          </label>
          <Input
            type="datetime-local"
            className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
            {...register("startTime")}
          />
          <FieldError message={errors.startTime?.message} />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Duration (Minutes) *
          </label>
          <Input
            type="number"
            min={15}
            step={15}
            placeholder="60"
            className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
            {...register("duration")}
          />
          <p className="text-xs text-muted-foreground">Minimum 15 minutes</p>
          <FieldError message={errors.duration?.message} />
        </div>

        {/* Course */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Course *
          </label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500">
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
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Instructor *
          </label>
          <Controller
            control={control}
            name="instructorId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500">
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
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Status *
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500">
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

        {/* Submit Button with Animated Effect */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 hover:cursor-pointer bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {meeting ? "Update Meeting" : "Schedule Meeting"}
        </Button>
      </form>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
