/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  UserPlus,
  ImageIcon,
  User,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import config from "@/config";

const optionalNumber = z
  .number()
  .optional()
  .or(z.nan())
  .transform((v: any) => (isNaN(v) ? undefined : v));

const createSignupSchema = () =>
  z
    .object({
      // User base fields
      name: z.string().min(1, "Full name is required"),
      email: z.string().email("Valid email required"),
      phone: z.string().min(11, "11-digit phone number required"),
      password: z.string().min(6, "Minimum 6 characters"),
      confirmPassword: z.string(),
      role: z.enum(["STUDENT", "TEACHER"] as const),
      picture: z.instanceof(File).optional(),

      // Student fields
      guardianName: z.string().optional(),
      guardianPhone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      section: z.string().optional(),
      roll: optionalNumber,
      experience: optionalNumber,
      salary: optionalNumber,

      // Teacher fields
      qualification: z.string().optional(),
      designation: z.string().optional(),
      bio: z.string().optional(),

      // Address fields (for both)
      division: z.string().optional(),
      district: z.string().optional(),
      thana: z.string().optional(),
      union: z.string().optional(),

      // Terms
      agreeTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to terms",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords don't match",
    })
    .refine(
      (data) => {
        if (data.role === "STUDENT") {
          return !!data.guardianName && !!data.guardianPhone;
        }

        if (data.role === "TEACHER") {
          return !!data.qualification;
        }

        return true;
      },
      {
        path: ["role"],
        message: "Fill all required fields for selected role",
      },
    );

type SignupFormType = z.infer<ReturnType<typeof createSignupSchema>>;

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-emerald-700">
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 dark:text-red-400 text-xs mt-1">{message}</p>
  );
}

function TextField({
  placeholder,
  type = "text",
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  const { ...rest } = props;
  return (
    <div>
      <div className="relative">
        {icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          className={`h-9 text-sm rounded border-slate-300 dark:border-slate-600 ${
            icon ? "pl-8" : "pl-3"
          }`}
          {...rest}
        />
      </div>
    </div>
  );
}

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);

  const schema = createSignupSchema();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      role: "STUDENT",
      agreeTerms: false,
    },
  });

  const selectedRole = watch("role");

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (picturePreview) {
      URL.revokeObjectURL(picturePreview);
    }

    setSelectedPicture(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const removeSelectedPicture = () => {
    if (picturePreview) {
      URL.revokeObjectURL(picturePreview);
    }

    setPicturePreview(null);
    setSelectedPicture(null);

    const input = document.getElementById("picture") as HTMLInputElement;

    if (input) {
      input.value = "";
    }
  };

  const onSubmit = async (data: SignupFormType) => {
    try {
      const address = {
        division: data.division || "",
        district: data.district || "",
        thana: data.thana || "",
        union: data.union || "",
      };

      const payload: Record<string, any> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        address,
      };

      // Add role-specific fields
      if (data.role === "STUDENT") {
        payload.guardianName = data.guardianName;
        payload.guardianPhone = data.guardianPhone;
        if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth ?? "";
        if (data.section) payload.section = data.section ?? "";
        if (data.roll !== undefined) payload.roll = data.roll;
      }

      if (data.role === "TEACHER") {
        payload.qualification = data.qualification;
        if (data.designation) payload.designation = data.designation ?? "";
        if (data.experience !== undefined) payload.experience = data.experience;

        if (data.salary !== undefined) payload.salary = data.salary;
        if (data.bio) payload.bio = data.bio ?? "";
        if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth ?? "";
      }

      // Handle picture upload
      const pictureFile = selectedPicture;

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === "address") {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      });

      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      // Submit to backend
      const res = await fetch(`${config.baseUrl}/user/create-user`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }

      if (result) {
        toast.success("Registration successful!");
        router.push("/login");
      }
    } catch (err: any) {
      console.error("[signup] Error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen py-6 px-3 bg-slate-200 dark:bg-background">
      <div className="max-w-6xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
        {/* Header */}
        <div className="flex items-center flex-wrap justify-center md:gap-0 gap-4 md:justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-20 w-72 overflow-hidden rounded-lg">
              <Image
                src="/logos/sams-logo-bn.jpeg"
                alt="SAMS Academy Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-emerald-600" />
            <div>
              <h1 className="text-xl font-bold text-emerald-600">
                Registration Form
              </h1>
              <p className="text-xs text-slate-500">
                Complete all required fields
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-5">
          {/* Role Selection */}
          <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <SectionHeader>Account Type</SectionHeader>
            <div className="p-4 flex gap-4 bg-white dark:bg-slate-950">
              {(["STUDENT", "TEACHER"] as const).map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={role}
                    {...register("role")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <SectionHeader>Basic Information</SectionHeader>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-950">
              <div className="space-y-1">
                <FieldLabel required>Full Name</FieldLabel>
                <TextField
                  placeholder="Enter full name"
                  icon={<User className="h-4 w-4" />}
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className="space-y-1">
                <FieldLabel required>Email</FieldLabel>
                <TextField
                  placeholder="email@example.com"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className="space-y-1">
                <FieldLabel required>Phone Number</FieldLabel>
                <TextField
                  placeholder="01XXXXXXXXX"
                  icon={<Phone className="h-4 w-4" />}
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              <div className="space-y-1">
                <FieldLabel required>Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    className="h-9 text-sm pl-8 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldError message={errors.password?.message} />
              </div>

              <div className="space-y-1">
                <FieldLabel required>Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="h-9 text-sm pl-8 pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldError message={errors.confirmPassword?.message} />
              </div>

              {/* Picture Upload */}
              <div className="space-y-1">
                <FieldLabel>Profile Picture</FieldLabel>
                {!picturePreview ? (
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 cursor-pointer text-sm">
                    <ImageIcon className="h-4 w-4" />
                    Choose Image
                    <input
                      id="picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePictureChange}
                    />
                  </label>
                ) : (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600">
                    <Image
                      src={picturePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeSelectedPicture}
                      className="
                        absolute top-2 right-2
                        flex h-8 w-8 items-center justify-center
                        rounded-full
                        bg-red-500 text-white
                        shadow-lg
                        hover:bg-red-600
                        transition
                        cursor-pointer
                      "
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <SectionHeader>Address</SectionHeader>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-950">
              <div className="space-y-1">
                <FieldLabel>Division</FieldLabel>
                <TextField placeholder="Division" {...register("division")} />
              </div>

              <div className="space-y-1">
                <FieldLabel>District</FieldLabel>
                <TextField placeholder="District" {...register("district")} />
              </div>

              <div className="space-y-1">
                <FieldLabel>Thana</FieldLabel>
                <TextField placeholder="Thana" {...register("thana")} />
              </div>

              <div className="space-y-1">
                <FieldLabel>Union/Ward</FieldLabel>
                <TextField placeholder="Union" {...register("union")} />
              </div>
            </div>
          </div>

          {/* Role-Specific Fields */}
          {selectedRole === "STUDENT" && (
            <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
              <SectionHeader>Student Information</SectionHeader>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-950">
                <div className="space-y-1">
                  <FieldLabel required>Guardian Name</FieldLabel>
                  <TextField
                    placeholder="Guardian name"
                    {...register("guardianName")}
                  />
                  <FieldError message={errors.guardianName?.message} />
                </div>

                <div className="space-y-1">
                  <FieldLabel required>Guardian Phone</FieldLabel>
                  <TextField
                    placeholder="Guardian phone"
                    {...register("guardianPhone")}
                  />
                  <FieldError message={errors.guardianPhone?.message} />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    type="date"
                    className="h-9 text-sm"
                    {...register("dateOfBirth")}
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Section</FieldLabel>
                  <TextField placeholder="Section" {...register("section")} />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Roll Number</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Roll"
                    className="h-9 text-sm"
                    {...register("roll", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedRole === "TEACHER" && (
            <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
              <SectionHeader>Teacher Information</SectionHeader>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-950">
                <div className="space-y-1">
                  <FieldLabel required>Qualification</FieldLabel>
                  <TextField
                    placeholder="e.g., B.Sc, M.Sc"
                    {...register("qualification")}
                  />
                  <FieldError message={errors.qualification?.message} />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Experience (Years)</FieldLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-9 text-sm"
                    {...register("experience", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Designation</FieldLabel>
                  <TextField
                    placeholder="e.g., Senior Teacher"
                    {...register("designation")}
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Salary</FieldLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-9 text-sm"
                    {...register("salary", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <FieldLabel>Bio</FieldLabel>
                  <textarea
                    placeholder="Brief bio"
                    className="w-full h-24 p-2 text-sm rounded border border-slate-300 dark:border-slate-600"
                    {...register("bio")}
                  />
                </div>

                <div className="space-y-1">
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    type="date"
                    className="h-9 text-sm"
                    {...register("dateOfBirth")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="w-4 h-4 mt-1"
            />
            <div>
              <label className="text-sm text-slate-700 dark:text-slate-300">
                I agree to the terms and conditions
              </label>
              <FieldError message={errors.agreeTerms?.message} />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full hover:cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white h-10"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
