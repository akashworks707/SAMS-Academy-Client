"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserRound, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUpdateUserMutation } from "@/redux/features/user/user.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(11, "Enter a valid phone number").max(15),
  dateOfBirth: z.string().optional(),
  studentId: z.string().optional(),
  section: z.string().optional(),
  roll: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().min(1, "Roll must be a positive number").optional()
  ),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  union: z.string().optional(),
});

type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;

interface UpdateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpdateStudentModal({
  open,
  onOpenChange,
  item,
  onSuccess,
}: UpdateStudentModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateStudentFormValues>({
    resolver: zodResolver(updateStudentSchema) as any,
  });

  useEffect(() => {
    if (open && item) {
      const dob = item.dateOfBirth
        ? new Date(item.dateOfBirth).toISOString().split("T")[0]
        : "";
      reset({
        name: item.name ?? "",
        phone: item.phone ?? "",
        dateOfBirth: dob,
        studentId: item.studentId ?? "",
        section: item.section ?? "",
        roll: item.roll ?? undefined,
        guardianName: item.guardianName ?? "",
        guardianPhone: item.guardianPhone ?? "",
        division: item.address?.division ?? "",
        district: item.address?.district ?? "",
        thana: item.address?.thana ?? "",
        union: item.address?.union ?? "",
      });
      setImagePreview(item.picture ?? null);
      setImageFile(null);
    }
  }, [open, item, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleClose = () => {
    clearImage();
    onOpenChange(false);
  };

  const onSubmit = async (data: UpdateStudentFormValues) => {
    try {
      const formData = new FormData();
      const payload = {
        name: data.name,
        phone: data.phone,
        ...(data.dateOfBirth && {
          dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        }),
        ...(data.studentId && { studentId: data.studentId }),
        ...(data.section && { section: data.section }),
        ...(data.roll !== undefined && { roll: data.roll }),
        ...(data.guardianName && { guardianName: data.guardianName }),
        ...(data.guardianPhone && { guardianPhone: data.guardianPhone }),
        address: {
          division: data.division || "",
          district: data.district || "",
          thana: data.thana || "",
          union: data.union || "",
        },
      };

      formData.append("data", JSON.stringify(payload));
      if (imageFile) formData.append("picture", imageFile);

      await updateUser({ id: item._id, data: formData }).unwrap();
      toast.success("Student updated successfully!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update student");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">
            Edit Student
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Update the student&apos;s information
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

          {/* ─── Personal Information ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <Label htmlFor="us-name" className="text-xs font-semibold tracking-widest uppercase">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input id="us-name" placeholder="e.g. John Doe" {...register("name")} />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="us-phone" className="text-xs font-semibold tracking-widest uppercase">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input id="us-phone" placeholder="01XXXXXXXXX" {...register("phone")} />
                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="us-dob" className="text-xs font-semibold tracking-widest uppercase">
                  Date of Birth <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                </Label>
                <Input id="us-dob" type="date" {...register("dateOfBirth")} />
              </div>

            </div>
          </div>

          <Separator />

          {/* ─── Academic Information ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              Academic Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <Label htmlFor="us-studentId" className="text-xs font-semibold tracking-widest uppercase">
                  Student ID <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                </Label>
                <Input id="us-studentId" placeholder="e.g. STU-2024-001" {...register("studentId")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="us-section" className="text-xs font-semibold tracking-widest uppercase">
                  Section <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                </Label>
                <Input id="us-section" placeholder="e.g. A" {...register("section")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="us-roll" className="text-xs font-semibold tracking-widest uppercase">
                  Roll Number <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                </Label>
                <Input id="us-roll" type="number" min={1} placeholder="e.g. 12" {...register("roll")} />
                {errors.roll && <p className="text-xs text-red-400">{errors.roll.message}</p>}
              </div>

            </div>
          </div>

          <Separator />

          {/* ─── Guardian Information ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              Guardian Information <span className="text-[#96999A] normal-case font-normal">(optional)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <Label htmlFor="us-guardianName" className="text-xs font-semibold tracking-widest uppercase">
                  Guardian Name
                </Label>
                <Input id="us-guardianName" placeholder="e.g. Mr. Robert Doe" {...register("guardianName")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="us-guardianPhone" className="text-xs font-semibold tracking-widest uppercase">
                  Guardian Phone
                </Label>
                <Input id="us-guardianPhone" placeholder="01XXXXXXXXX" {...register("guardianPhone")} />
              </div>

            </div>
          </div>

          <Separator />

          {/* ─── Address ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              Address <span className="text-[#96999A] normal-case font-normal">(optional)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="us-division" className="text-xs font-semibold tracking-widest uppercase">Division</Label>
                <Input id="us-division" placeholder="e.g. Dhaka" {...register("division")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="us-district" className="text-xs font-semibold tracking-widest uppercase">District</Label>
                <Input id="us-district" placeholder="e.g. Dhaka" {...register("district")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="us-thana" className="text-xs font-semibold tracking-widest uppercase">Thana</Label>
                <Input id="us-thana" placeholder="e.g. Mirpur" {...register("thana")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="us-union" className="text-xs font-semibold tracking-widest uppercase">Union / Ward</Label>
                <Input id="us-union" placeholder="e.g. Ward-10" {...register("union")} />
              </div>
            </div>
          </div>

          <Separator />

          {/* ─── Profile Picture ─── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Profile Picture <span className="text-[#96999A] normal-case font-normal">(optional)</span>
            </Label>
            {imagePreview ? (
              <div className="relative flex items-center gap-3 rounded-md border border-slate-200 dark:border-slate-700 p-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-14 w-14 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  {imageFile ? (
                    <>
                      <p className="text-xs text-slate-500 truncate">{imageFile.name}</p>
                      <p className="text-xs text-slate-400">{(imageFile.size / 1024).toFixed(1)} KB</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400">Current photo</p>
                  )}
                </div>
                <Button variant="destructive" type="button" size="sm" onClick={clearImage} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="update-student-image"
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-6 cursor-pointer transition-colors"
              >
                <Upload className="h-6 w-6 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm text-slate-500">Click to upload a new photo</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP — max 2MB</p>
                </div>
                <input
                  id="update-student-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* ─── Submit ─── */}
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
                <UserRound className="h-4 w-4" />
                Update Student
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}