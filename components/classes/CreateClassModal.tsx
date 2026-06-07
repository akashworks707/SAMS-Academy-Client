"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, School } from "lucide-react";

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
import { useCreateClassMutation } from "@/redux/features/class/class.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const createClassSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  isActive: z.enum(["true", "false"]).default("true"),
});

type CreateClassFormValues = z.infer<typeof createClassSchema>;

interface CreateClassModalProps {
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateClassModal({ onSuccess }: CreateClassModalProps) {
  const [open, setOpen] = useState(false);
  const [createClass, { isLoading }] = useCreateClassMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema) as any,
    defaultValues: { title: "", description: "", isActive: "true" },
  });

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: CreateClassFormValues) => {
    try {
      const payload = {
        title: data.title,
        ...(data.description && { description: data.description }),
        isActive: data.isActive === "true",
      };
      await createClass(payload).unwrap();
      toast.success("Class created successfully!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create class");
    }
  };

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add Class
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="flex flex-col items-center gap-2 pb-2">
            <DialogTitle className="text-xl font-bold tracking-widest uppercase">
              Add New Class
            </DialogTitle>
            <DialogDescription className="text-[#96999A] text-sm tracking-wide">
              Create a new class
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="c-title" className="text-xs font-semibold tracking-widest uppercase">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="c-title"
                type="text"
                placeholder="e.g. Class 1, Class 2"
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="c-description" className="text-xs font-semibold tracking-widest uppercase">
                Description{" "}
                <span className="text-[#96999A] normal-case font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="c-description"
                placeholder="Write a brief description of the class..."
                rows={3}
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="c-isActive" className="text-xs font-semibold tracking-widest uppercase">
                Status
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="c-isActive">
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Create Class
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}