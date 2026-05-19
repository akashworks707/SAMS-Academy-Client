/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
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
import { IRecordedVideo, RecordedVideoFormData } from "@/types/admin";

const videoFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  courseId: z.string().min(1, "Please select a course"),
  videoUrl: z.string().url("Invalid video URL"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 second"),
  instructor: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

interface VideoFormProps {
  video?: IRecordedVideo;
  courses: Array<{ _id: string; title: string }>;
  isLoading?: boolean;
  onSubmit: (data: RecordedVideoFormData) => Promise<void>;
}

export function VideoForm({
  video,
  courses,
  isLoading = false,
  onSubmit,
}: VideoFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RecordedVideoFormData>({
    resolver: zodResolver(videoFormSchema as any),
    defaultValues: {
      title: video?.title ?? "",
      description: video?.description ?? "",
      courseId: video?.courseId ?? "",
      videoUrl: video?.videoUrl ?? "",
      duration: video?.duration ?? 0,
      instructor: video?.instructor ?? "",
      status: video?.status ?? "ACTIVE",
    },
  });

  const durationValue = watch("duration");
  const durationPreview = formatDuration(Number(durationValue));

  const handleFormSubmit = async (data: RecordedVideoFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("VideoForm submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Video Title</label>
        <Input placeholder="e.g., Calculus Lecture 1" {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Description</label>
        <Textarea
          placeholder="Describe the video content..."
          className="resize-none"
          rows={4}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
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

      {/* Video URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">Video URL</label>
        <Input
          placeholder="https://example.com/video.mp4"
          {...register("videoUrl")}
        />
        <p className="text-sm text-muted-foreground">
          Full URL to the video file or streaming platform
        </p>
        <FieldError message={errors.videoUrl?.message} />
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Duration (Seconds)
        </label>
        <Input
          type="number"
          min={1}
          placeholder="3600"
          {...register("duration")}
        />
        <p className="text-sm text-muted-foreground">
          {durationPreview || "Enter duration in seconds"}
        </p>
        <FieldError message={errors.duration?.message} />
      </div>

      {/* Instructor */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none">
          Instructor{" "}
          <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <Input placeholder="e.g., Dr. John Smith" {...register("instructor")} />
        <FieldError message={errors.instructor?.message} />
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
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.status?.message} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {video ? "Update Video" : "Upload Video"}
      </Button>
    </form>
  );
}
