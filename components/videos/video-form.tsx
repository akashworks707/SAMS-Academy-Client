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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IRecordedVideo, RecordedVideoFormData, getCourseId } from "@/types/admin";

const videoFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  course: z.string().min(1, "Please select a course"),   // backend field is `course`
  videoUrl: z.string().url("Please enter a valid URL"),
  thumbnailUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
});

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
    reset,
    formState: { errors },
  } = useForm<RecordedVideoFormData>({
    resolver: zodResolver(videoFormSchema as any),
    defaultValues: {
      title: video?.title ?? "",
      description: video?.description ?? "",
      // getCourseId handles both populated objects and plain id strings
      course: video ? getCourseId(video.course) : "",
      videoUrl: video?.videoUrl ?? "",
      thumbnailUrl: video?.thumbnailUrl ?? "",
      status: (video?.status as "ACTIVE" | "INACTIVE" | "ARCHIVED") ?? "ACTIVE",
    },
  });

  const handleFormSubmit = async (data: RecordedVideoFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("VideoForm submission error:", error);
    }
  };

  return (
    <ScrollArea className="h-[66vh] pr-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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

        {/* Course — field name is `course`, value is the course _id */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">Course</label>
          <Controller
            control={control}
            name="course"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.course?.message} />
        </div>

        {/* Video URL */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">Video URL</label>
          <Input
            placeholder="https://example.com/video.mp4"
            {...register("videoUrl")}
          />
          <p className="text-xs text-muted-foreground">
            Direct link to the video file or streaming platform
          </p>
          <FieldError message={errors.videoUrl?.message} />
        </div>

        {/* Thumbnail URL (optional) */}
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            Thumbnail URL{" "}
            <span className="font-normal text-muted-foreground">(Optional)</span>
          </label>
          <Input
            placeholder="https://example.com/thumb.jpg"
            {...register("thumbnailUrl")}
          />
          <FieldError message={errors.thumbnailUrl?.message} />
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
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-800 hover:bg-indigo-700 hover:cursor-pointer"
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {video ? "Update Video" : "Upload Video"}
        </Button>
      </form>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}