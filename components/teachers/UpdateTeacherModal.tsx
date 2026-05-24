"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GraduationCap, Upload, X } from "lucide-react";

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
import { useUpdateUserMutation } from "@/redux/features/user/user.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateTeacherSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে").max(100),
  phone: z.string().min(11, "সঠিক মোবাইল নম্বর দিন").max(15),
  dateOfBirth: z.string().optional(),
  qualification: z.string().min(2, "যোগ্যতা লিখুন"),
  designation: z.string().optional(),
  experience: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().min(0).optional()
  ),
  salary: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().min(0).optional()
  ),
  perClassSalary: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().min(0).optional()
  ),
  bio: z.string().max(500).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  union: z.string().optional(),
});

type UpdateTeacherFormValues = z.infer<typeof updateTeacherSchema>;

interface UpdateTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpdateTeacherModal({ open, onOpenChange, item, onSuccess }: UpdateTeacherModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTeacherFormValues>({
    resolver: zodResolver(updateTeacherSchema) as any,
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
        qualification: item.qualification ?? "",
        designation: item.designation ?? "",
        experience: item.experience ?? undefined,
        salary: item.salary ?? undefined,
        perClassSalary: item.perClassSalary ?? undefined,
        bio: item.bio ?? "",
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
    if (file.size > 2 * 1024 * 1024) { toast.error("ছবি ২MB এর বেশি হওয়া যাবে না"); return; }
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

  const onSubmit = async (data: UpdateTeacherFormValues) => {
    try {
      const formData = new FormData();

      const payload = {
        name: data.name,
        phone: data.phone,
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth).toISOString() }),
        qualification: data.qualification,
        ...(data.designation && { designation: data.designation }),
        ...(data.experience !== undefined && { experience: data.experience }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.perClassSalary !== undefined && { perClassSalary: data.perClassSalary }),
        ...(data.bio && { bio: data.bio }),
        address: {
          division: data.division || "",
          district: data.district || "",
          thana: data.thana || "",
          union: data.union || "",
        },
      };

      formData.append("data", JSON.stringify(payload));
      if (imageFile) formData.append("picture", imageFile);

      const updateRes = await updateUser({ id: item._id, data: formData }).unwrap();
      console.log("Update user res ", updateRes)
      toast.success("শিক্ষকের তথ্য আপডেট হয়েছে!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">
            শিক্ষকের তথ্য সম্পাদনা
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            শিক্ষকের তথ্য আপডেট করুন
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

          {/* ─── ব্যক্তিগত তথ্য ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">ব্যক্তিগত তথ্য</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <Label htmlFor="u-name" className="text-xs font-semibold tracking-widest uppercase">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                </Label>
                <Input id="u-name" placeholder="যেমন: মোঃ রফিকুল ইসলাম" {...register("name")} />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-phone" className="text-xs font-semibold tracking-widest uppercase">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </Label>
                <Input id="u-phone" placeholder="01XXXXXXXXX" {...register("phone")} />
                {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-dob" className="text-xs font-semibold tracking-widest uppercase">
                  জন্ম তারিখ <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                </Label>
                <Input id="u-dob" type="date" {...register("dateOfBirth")} />
              </div>

            </div>
          </div>

          <Separator />

          {/* ─── পেশাদার তথ্য ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">পেশাদার তথ্য</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <Label htmlFor="u-qual" className="text-xs font-semibold tracking-widest uppercase">
                  শিক্ষাগত যোগ্যতা <span className="text-red-500">*</span>
                </Label>
                <Input id="u-qual" placeholder="যেমন: MSc in Mathematics" {...register("qualification")} />
                {errors.qualification && <p className="text-xs text-red-400">{errors.qualification.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-desig" className="text-xs font-semibold tracking-widest uppercase">
                  পদবী <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                </Label>
                <Input id="u-desig" placeholder="যেমন: Senior Math Teacher" {...register("designation")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-exp" className="text-xs font-semibold tracking-widest uppercase">
                  অভিজ্ঞতা (বছর) <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                </Label>
                <Input id="u-exp" type="number" min={0} placeholder="যেমন: 5" {...register("experience")} />
                {errors.experience && <p className="text-xs text-red-400">{errors.experience.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-salary" className="text-xs font-semibold tracking-widest uppercase">
                  মাসিক বেতন (টাকা) <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                </Label>
                <Input id="u-salary" type="number" min={0} placeholder="যেমন: 45000" {...register("salary")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-perclass" className="text-xs font-semibold tracking-widest uppercase">
                  প্রতি ক্লাস বেতন (টাকা) <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                </Label>
                <Input id="u-perclass" type="number" min={0} placeholder="যেমন: 200" {...register("perClassSalary")} />
              </div>

            </div>

            <div className="space-y-1.5 mt-4">
              <Label htmlFor="u-bio" className="text-xs font-semibold tracking-widest uppercase">
                জীবনী / বিবরণ <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
              </Label>
              <Textarea id="u-bio" placeholder="শিক্ষকের সংক্ষিপ্ত পরিচিতি লিখুন..." rows={3} {...register("bio")} />
            </div>
          </div>

          <Separator />

          {/* ─── ঠিকানা ─── */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              ঠিকানা <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="u-division" className="text-xs font-semibold tracking-widest uppercase">বিভাগ</Label>
                <Input id="u-division" placeholder="যেমন: Dhaka" {...register("division")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="u-district" className="text-xs font-semibold tracking-widest uppercase">জেলা</Label>
                <Input id="u-district" placeholder="যেমন: Dhaka" {...register("district")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="u-thana" className="text-xs font-semibold tracking-widest uppercase">থানা</Label>
                <Input id="u-thana" placeholder="যেমন: Mirpur" {...register("thana")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="u-union" className="text-xs font-semibold tracking-widest uppercase">ইউনিয়ন / ওয়ার্ড</Label>
                <Input id="u-union" placeholder="যেমন: Ward-10" {...register("union")} />
              </div>
            </div>
          </div>

          <Separator />

          {/* ─── ছবি আপলোড ─── */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              প্রোফাইল ছবি <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
            </Label>
            {imagePreview ? (
              <div className="relative flex items-center gap-3 rounded-md border border-slate-200 dark:border-slate-700 p-2">
                <img src={imagePreview} alt="Preview" className="h-14 w-14 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700" />
                <div className="flex-1 min-w-0">
                  {imageFile ? (
                    <>
                      <p className="text-xs text-slate-500 truncate">{imageFile.name}</p>
                      <p className="text-xs text-slate-400">{(imageFile.size / 1024).toFixed(1)} KB</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400">বিদ্যমান ছবি</p>
                  )}
                </div>
                <Button variant="destructive" type="button" size="sm" onClick={clearImage} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label htmlFor="update-teacher-image" className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-6 cursor-pointer transition-colors">
                <Upload className="h-6 w-6 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm text-slate-500">নতুন ছবি আপলোড করতে ক্লিক করুন</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP — সর্বোচ্চ ২MB</p>
                </div>
                <input id="update-teacher-image" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
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
                আপডেট হচ্ছে...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                আপডেট করুন
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}