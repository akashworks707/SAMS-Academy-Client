/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { IEnrollment } from "@/types/admin";

const enrollmentFormSchema = z.object({
  student: z.string().min(1, "Please select a student"),
  class: z.string().min(1, "Please select a class"),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "DROPPED"]).optional(),
  progress: z.coerce.number().min(0).max(100).optional(),
});

type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;

interface EnrollmentFormProps {
  enrollment?: IEnrollment;
  students: Array<{ _id: string; name: string }>;
  courses: Array<{ _id: string; title: string }>;
  isLoading?: boolean;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
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
    resolver: zodResolver(enrollmentFormSchema as any),
    defaultValues: {
      student: enrollment?.student?.toString() || "",
      class: enrollment?.course?.toString() || "",
      status:
        enrollment?.status === "INACTIVE"
          ? "PENDING"
          : enrollment?.status || "PENDING",
      progress: enrollment?.progress || 0,
    },
  });

  const handleFormSubmit: SubmitHandler<EnrollmentFormData> = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("EnrollmentForm submission error:", error);
    }
  };

  return (
    <ScrollArea className="max-h-[90vh] pr-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 px-4"
      >
        {/* Student - BACKEND EXPECTED FIELD */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Student *
          </label>
          <Controller
            control={control}
            name="student"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500">
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
          <FieldError message={errors.student?.message} />
        </div>

        {/* Course - BACKEND EXPECTED FIELD */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Course *
          </label>
          <Controller
            control={control}
            name="class"
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
          <FieldError message={errors.class?.message} />
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="DROPPED">Dropped</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.status?.message} />
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
            Progress (%){" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="0"
            className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
            {...register("progress")}
          />
          <FieldError message={errors.progress?.message} />
        </div>

        {/* Submit Button with Animated Effect */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-linear-to-r hover:cursor-pointer from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4" />}
          {enrollment ? "Update Enrollment" : "Create Enrollment"}
        </Button>
      </form>
    </ScrollArea>
  );
}
