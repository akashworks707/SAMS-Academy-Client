"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, BookOpen } from "lucide-react";

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
  SelectValue,
} from "@/components/ui/select";
import { useCreateSubjectMutation } from "@/redux/features/subjects/subject.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const subjectSchema = z.object({
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

type SubjectFormValues = z.infer<typeof subjectSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateSubjectModalProps {
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateSubjectModal({ onSuccess }: CreateSubjectModalProps) {
  const [open, setOpen] = useState(false);
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      code: "",
      isActive: "true",
    },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      const payload = {
        title: data.title,
        ...(data.description && { description: data.description }),
        ...(data.code && { code: data.code }),
        isActive: data.isActive === "true",
      };

      await createSubject(payload).unwrap();
      toast.success("Subject created successfully!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create subject");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add Subject
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">

          {/* Header */}
          <DialogHeader className="flex flex-col items-center gap-2 pb-2">
            <DialogTitle className="text-xl font-bold tracking-widest uppercase">
              Add New Subject
            </DialogTitle>
            <DialogDescription className="text-[#96999A] text-sm tracking-wide">
              Create a new subject for the curriculum
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. Mathematics, Physics"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Subject Code */}
            <div className="space-y-1.5">
              <Label
                htmlFor="code"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Subject Code{" "}
                <span className="text-[#96999A] normal-case font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="e.g. MATH-101, PHY-201"
                className="font-mono"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-red-400">{errors.code.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Description{" "}
                <span className="text-[#96999A] normal-case font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Write a brief description of the subject..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label
                htmlFor="isActive"
                className="text-xs font-semibold tracking-widest uppercase"
              >
                Status
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="isActive">
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
              {errors.isActive && (
                <p className="text-xs text-red-400">{errors.isActive.message}</p>
              )}
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Create Subject
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}