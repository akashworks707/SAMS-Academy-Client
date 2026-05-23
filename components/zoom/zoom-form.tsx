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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IZoomMeeting } from "@/types/admin";
import { CreateMeetingPayload } from "@/redux/features/zoom/zoom.api";

const zoomFormSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  courseId: z.string().min(1, "Please select a course"),
  subjectId: z.string().min(1, "Please select a subject"),
  startTime: z.string().min(1, "Start date & time is required"),
  duration: z.coerce.number().min(15, "Minimum duration is 15 minutes"),
  timezone: z.string().optional(),
});

type ZoomFormValues = z.infer<typeof zoomFormSchema>;

interface ZoomFormProps {
  meeting?: IZoomMeeting;
  courses: Array<{ _id: string; title: string }>;
  subjects: Array<{ _id: string; title: string }>;
  isLoading?: boolean;
  onSubmit: (data: CreateMeetingPayload) => Promise<void>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

function toDatetimeLocal(value?: string | Date): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

const TIMEZONES = [
  "Asia/Dhaka",
  "Asia/Kolkata",
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "UTC",
];

export function ZoomForm({
  meeting,
  courses,
  subjects,
  isLoading = false,
  onSubmit,
}: ZoomFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZoomFormValues>({
    resolver: zodResolver(zoomFormSchema as unknown as any),
    defaultValues: {
      topic: meeting?.topic ?? "",
      courseId: meeting?.courseId ? String(meeting.courseId) : "",
      subjectId: meeting?.subjectId ? String(meeting.subjectId) : "",
      startTime: toDatetimeLocal(meeting?.startTime),
      duration: meeting?.duration ?? 60,
      timezone: meeting?.timezone ?? "Asia/Dhaka",
    },
  });

  const handleFormSubmit = async (values: ZoomFormValues) => {
    try {
      await onSubmit({
        topic: values.topic,
        courseId: values.courseId,
        subjectId: values.subjectId,
        startTime: new Date(values.startTime).toISOString(),
        duration: values.duration,
        timezone: values.timezone,
      });
      reset();
    } catch (error) {
      console.error("ZoomForm submission error:", error);
    }
  };

  const labelClass =
    "text-sm font-semibold text-indigo-900 dark:text-indigo-50";
  const inputClass =
    "border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500";

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 px-4"
      >
        {/* ── Topic ── */}
        <div className="space-y-2">
          <label className={labelClass}>Meeting Topic *</label>
          <Input
            placeholder="e.g., Calculus Lecture Session 1"
            className={inputClass}
            {...register("topic")}
          />
          <FieldError message={errors.topic?.message} />
        </div>

        {/* ── Course ── */}
        <div className="space-y-2">
          <label className={labelClass}>Course *</label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={inputClass}>
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
          <FieldError message={errors.courseId?.message} />
        </div>

        {/* ── Subject ── */}
        <div className="space-y-2">
          <label className={labelClass}>Subject *</label>
          <Controller
            control={control}
            name="subjectId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No subjects available
                    </div>
                  ) : (
                    subjects.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.subjectId?.message} />
        </div>

        {/* ── Start Date & Time ── */}
        <div className="space-y-2">
          <label className={labelClass}>Start Date &amp; Time *</label>
          <Input
            type="datetime-local"
            className={inputClass}
            {...register("startTime")}
          />
          <FieldError message={errors.startTime?.message} />
        </div>

        {/* ── Duration ── */}
        <div className="space-y-2">
          <label className={labelClass}>Duration (Minutes) *</label>
          <Input
            type="number"
            min={15}
            step={15}
            placeholder="60"
            className={inputClass}
            {...register("duration")}
          />
          <p className="text-xs text-muted-foreground">Minimum 15 minutes</p>
          <FieldError message={errors.duration?.message} />
        </div>

        {/* ── Timezone ── */}
        <div className="space-y-2">
          <label className={labelClass}>
            Timezone{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* ── Submit ── */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 cursor-pointer bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {meeting ? "Update Meeting" : "Schedule Meeting"}
        </Button>
      </form>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
