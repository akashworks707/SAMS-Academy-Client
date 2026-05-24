"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, GraduationCap, Upload, X, Eye, EyeOff } from "lucide-react";

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
import { useCreateUserMutation } from "@/redux/features/user/user.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const createTeacherSchema = z
  .object({
    name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে").max(100),
    email: z.string().email("সঠিক ইমেইল দিন"),
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
    password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>;

interface CreateTeacherModalProps {
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateTeacherModal({ onSuccess }: CreateTeacherModalProps) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema) as any,
    defaultValues: {
      name: "", email: "", phone: "",
      dateOfBirth: "", qualification: "", designation: "",
      experience: undefined, salary: undefined, perClassSalary: undefined,
      bio: "", division: "", district: "", thana: "", union: "",
      password: "", confirmPassword: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("ছবি ২MB এর বেশি হওয়া যাবে না"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError(null);
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleClose = () => {
    reset();
    clearImage();
    setImageError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOpen(false);
  };

  const onSubmit = async (data: CreateTeacherFormValues) => {
    try {
      const formData = new FormData();
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "TEACHER",
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth).toISOString() }),
        qualification: data.qualification,
        ...(data.designation && { designation: data.designation }),
        ...(data.experience !== undefined && { experience: data.experience }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.perClassSalary !== undefined && { salaryPerClass: data.perClassSalary }),
        ...(data.bio && { bio: data.bio }),
        address: {
          division: data.division || "",
          district: data.district || "",
          thana: data.thana || "",
          union: data.union || "",
        },
        assignedSubjects: [],
        assignedCourses: [],
      };
      formData.append("data", JSON.stringify(payload));
      if (imageFile) formData.append("picture", imageFile);

      await createUser(formData).unwrap();
      toast.success("শিক্ষক সফলভাবে তৈরি হয়েছে!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "শিক্ষক তৈরি করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        শিক্ষক যোগ করুন
      </Button>

      <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="flex flex-col items-center gap-2 pb-2">
            <DialogTitle className="text-xl font-bold tracking-widest uppercase">
              নতুন শিক্ষক যোগ করুন
            </DialogTitle>
            <DialogDescription className="text-[#96999A] text-sm tracking-wide">
              নতুন শিক্ষকের তথ্য পূরণ করুন
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

            {/* ─── ব্যক্তিগত তথ্য ─── */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">ব্যক্তিগত তথ্য</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1.5">
                  <Label htmlFor="t-name" className="text-xs font-semibold tracking-widest uppercase">
                    পূর্ণ নাম <span className="text-red-500">*</span>
                  </Label>
                  <Input id="t-name" placeholder="যেমন: মোঃ রফিকুল ইসলাম" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-email" className="text-xs font-semibold tracking-widest uppercase">
                    ইমেইল <span className="text-red-500">*</span>
                  </Label>
                  <Input id="t-email" type="email" placeholder="example@email.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-phone" className="text-xs font-semibold tracking-widest uppercase">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </Label>
                  <Input id="t-phone" placeholder="01XXXXXXXXX" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-dob" className="text-xs font-semibold tracking-widest uppercase">
                    জন্ম তারিখ <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                  </Label>
                  <Input id="t-dob" type="date" {...register("dateOfBirth")} />
                  {errors.dateOfBirth && <p className="text-xs text-red-400">{errors.dateOfBirth.message}</p>}
                </div>

              </div>
            </div>

            <Separator />

            {/* ─── পেশাদার তথ্য ─── */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">পেশাদার তথ্য</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1.5">
                  <Label htmlFor="t-qualification" className="text-xs font-semibold tracking-widest uppercase">
                    শিক্ষাগত যোগ্যতা <span className="text-red-500">*</span>
                  </Label>
                  <Input id="t-qualification" placeholder="যেমন: MSc in Mathematics" {...register("qualification")} />
                  {errors.qualification && <p className="text-xs text-red-400">{errors.qualification.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-designation" className="text-xs font-semibold tracking-widest uppercase">
                    পদবী <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                  </Label>
                  <Input id="t-designation" placeholder="যেমন: Senior Math Teacher" {...register("designation")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-experience" className="text-xs font-semibold tracking-widest uppercase">
                    অভিজ্ঞতা (বছর) <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                  </Label>
                  <Input id="t-experience" type="number" min={0} placeholder="যেমন: 5" {...register("experience")} />
                  {errors.experience && <p className="text-xs text-red-400">{errors.experience.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-salary" className="text-xs font-semibold tracking-widest uppercase">
                    মাসিক বেতন (টাকা) <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                  </Label>
                  <Input id="t-salary" type="number" min={0} placeholder="যেমন: 45000" {...register("salary")} />
                  {errors.salary && <p className="text-xs text-red-400">{errors.salary.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-perclass" className="text-xs font-semibold tracking-widest uppercase">
                    প্রতি ক্লাস বেতন (টাকা) <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                  </Label>
                  <Input id="t-perclass" type="number" min={0} placeholder="যেমন: 200" {...register("perClassSalary")} />
                  {errors.perClassSalary && <p className="text-xs text-red-400">{errors.perClassSalary.message}</p>}
                </div>

              </div>

              <div className="space-y-1.5 mt-4">
                <Label htmlFor="t-bio" className="text-xs font-semibold tracking-widest uppercase">
                  জীবনী / বিবরণ <span className="text-[#96999A] normal-case font-normal">(ঐচ্ছিক)</span>
                </Label>
                <Textarea id="t-bio" placeholder="শিক্ষকের সংক্ষিপ্ত পরিচিতি লিখুন..." rows={3} {...register("bio")} />
                {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
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
                  <Label htmlFor="t-division" className="text-xs font-semibold tracking-widest uppercase">বিভাগ</Label>
                  <Input id="t-division" placeholder="যেমন: Dhaka" {...register("division")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-district" className="text-xs font-semibold tracking-widest uppercase">জেলা</Label>
                  <Input id="t-district" placeholder="যেমন: Dhaka" {...register("district")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-thana" className="text-xs font-semibold tracking-widest uppercase">থানা</Label>
                  <Input id="t-thana" placeholder="যেমন: Mirpur" {...register("thana")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-union" className="text-xs font-semibold tracking-widest uppercase">ইউনিয়ন / ওয়ার্ড</Label>
                  <Input id="t-union" placeholder="যেমন: Ward-10" {...register("union")} />
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
                <div className="relative flex items-center gap-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 p-2">
                  <img src={imagePreview} alt="Preview" className="h-14 w-14 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 truncate">{imageFile?.name}</p>
                    <p className="text-xs text-slate-400">{imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : ""}</p>
                  </div>
                  <Button variant="destructive" type="button" size="sm" onClick={clearImage} className="shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="teacher-image-upload" className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-6 cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <div className="text-center">
                    <p className="text-sm text-slate-500">ছবি আপলোড করতে ক্লিক করুন</p>
                    <p className="text-xs text-slate-400">PNG, JPG, WEBP — সর্বোচ্চ ২MB</p>
                  </div>
                  <input id="teacher-image-upload" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              {imageError && <p className="text-xs text-red-400">{imageError}</p>}
            </div>

            <Separator />

            {/* ─── পাসওয়ার্ড — সবার নিচে ─── */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                অ্যাকাউন্ট সুরক্ষা
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1.5">
                  <Label htmlFor="t-password" className="text-xs font-semibold tracking-widest uppercase">
                    পাসওয়ার্ড <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="t-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="pr-10"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="t-confirm-password" className="text-xs font-semibold tracking-widest uppercase">
                    পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="t-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      className="pr-10"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
                </div>

              </div>
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
                  তৈরি হচ্ছে...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  শিক্ষক তৈরি করুন
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}