"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useUpdateSubjectMutation } from "@/redux/features/subjects/subject.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateSubjectSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  code: z
    .string()
    .max(20, "Code cannot exceed 20 characters")
    .regex(
      /^[A-Za-z0-9\-_]*$/,
      "Only letters, numbers, hyphens and underscores are allowed"
    )
    .optional(),
  isActive: z.enum(["true", "false"]).default("true"),
});

type UpdateSubjectFormValues = z.infer<typeof updateSubjectSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubjectItem {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

interface UpdateSubjectModalProps {
  subject: SubjectItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpdateSubjectModal({
  subject,
  open,
  onOpenChange,
  onSuccess,
}: UpdateSubjectModalProps) {
  const [updateSubject, { isLoading }] = useUpdateSubjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateSubjectFormValues>({
    resolver: zodResolver(updateSubjectSchema) as any,
    defaultValues: {
      title: subject.title,
      description: subject.description ?? "",
      code: subject.code ?? "",
      isActive: subject.isActive ? "true" : "false",
    },
  });

  // Sync form when subject changes
  useEffect(() => {
    if (open) {
      reset({
        title: subject.title,
        description: subject.description ?? "",
        code: subject.code ?? "",
        isActive: subject.isActive ? "true" : "false",
      });
    }
  }, [open, subject, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateSubjectFormValues) => {
    try {
      const payload = {
        title: data.title,
        ...(data.description && { description: data.description }),
        ...(data.code && { code: data.code }),
        isActive: data.isActive === "true",
      };

      await updateSubject({ id: subject._id, data: payload }).unwrap();
      toast.success("Subject updated successfully!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update subject");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">

        {/* Header */}
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">
            Edit Subject
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Update the subject information
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="u-title" className="text-xs font-semibold tracking-widest uppercase">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="u-title"
              type="text"
              placeholder="e.g. Mathematics, Physics"
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Subject Code */}
          <div className="space-y-1.5">
            <Label htmlFor="u-code" className="text-xs font-semibold tracking-widest uppercase">
              Subject Code{" "}
              <span className="text-[#96999A] normal-case font-normal">(Optional)</span>
            </Label>
            <Input
              id="u-code"
              type="text"
              placeholder="e.g. MATH-101, PHY-201"
              className="font-mono"
              {...register("code")}
            />
            {errors.code && <p className="text-xs text-red-400">{errors.code.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="u-description" className="text-xs font-semibold tracking-widest uppercase">
              Description{" "}
              <span className="text-[#96999A] normal-case font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="u-description"
              placeholder="Write a brief description of the subject..."
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="u-isActive" className="text-xs font-semibold tracking-widest uppercase">
              Status
            </Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="u-isActive">
                    {field.value === "true" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                        Active
                      </span>
                    ) : field.value === "false" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                        Inactive
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Select status</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                        Active
                      </span>
                    </SelectItem>
                    <SelectItem value="false">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                        Inactive
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.isActive && <p className="text-xs text-red-400">{errors.isActive.message}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 cursor-pointer font-bold tracking-widest uppercase transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Update Subject
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}