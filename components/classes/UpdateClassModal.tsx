"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { School } from "lucide-react";

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
import { useUpdateClassMutation } from "@/redux/features/class/class.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateClassSchema = z.object({
  title: z
    .string()
    .min(2, "শিরোনাম কমপক্ষে ২ অক্ষর হতে হবে")
    .max(100, "শিরোনাম ১০০ অক্ষরের বেশি হওয়া যাবে না"),
  description: z
    .string()
    .max(500, "বিবরণ ৫০০ অক্ষরের বেশি হওয়া যাবে না")
    .optional(),
  isActive: z.enum(["true", "false"]).default("true"),
});

type UpdateClassFormValues = z.infer<typeof updateClassSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassItem {
  _id: string;
  title: string;
  description?: string;
  isActive: boolean;
}

interface UpdateClassModalProps {
  classItem: ClassItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpdateClassModal({
  classItem,
  open,
  onOpenChange,
  onSuccess,
}: UpdateClassModalProps) {
  const [updateClass, { isLoading }] = useUpdateClassMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateClassFormValues>({
    resolver: zodResolver(updateClassSchema) as any,
    defaultValues: {
      title: classItem.title,
      description: classItem.description ?? "",
      isActive: classItem.isActive ? "true" : "false",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: classItem.title,
        description: classItem.description ?? "",
        isActive: classItem.isActive ? "true" : "false",
      });
    }
  }, [open, classItem, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateClassFormValues) => {
    try {
      const payload = {
        title: data.title,
        ...(data.description && { description: data.description }),
        isActive: data.isActive === "true",
      };
      await updateClass({ id: classItem._id, data: payload }).unwrap();
      toast.success("ক্লাস সফলভাবে আপডেট হয়েছে!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "ক্লাস আপডেট করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">
            ক্লাস সম্পাদনা করুন
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            ক্লাসটির তথ্য আপডেট করুন
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">

          {/* শিরোনাম */}
          <div className="space-y-1.5">
            <Label htmlFor="uc-title" className="text-xs font-semibold tracking-widest uppercase">
              শিরোনাম <span className="text-red-500">*</span>
            </Label>
            <Input
              id="uc-title"
              type="text"
              placeholder="যেমন: ক্লাস ১, ক্লাস ২"
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* বিবরণ */}
          <div className="space-y-1.5">
            <Label htmlFor="uc-description" className="text-xs font-semibold tracking-widest uppercase">
              বিবরণ{" "}
              <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
            </Label>
            <Textarea
              id="uc-description"
              placeholder="ক্লাসটির সংক্ষিপ্ত বিবরণ লিখুন..."
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* অবস্থা */}
          <div className="space-y-1.5">
            <Label htmlFor="uc-isActive" className="text-xs font-semibold tracking-widest uppercase">
              অবস্থা
            </Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="uc-isActive">
                    {field.value === "true" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                        সক্রিয়
                      </span>
                    ) : field.value === "false" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                        নিষ্ক্রিয়
                      </span>
                    ) : (
                      <span className="text-muted-foreground">অবস্থা নির্বাচন করুন</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                        সক্রিয়
                      </span>
                    </SelectItem>
                    <SelectItem value="false">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                        নিষ্ক্রিয়
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.isActive && <p className="text-xs text-red-400">{errors.isActive.message}</p>}
          </div>

          {/* জমা দিন */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 cursor-pointer font-bold tracking-widest uppercase transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                আপডেট হচ্ছে...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <School className="h-4 w-4" />
                আপডেট করুন
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}