/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  User,
  Phone,
  LockKeyhole,
} from "lucide-react";

import { toast } from "sonner";

import { useUser } from "@/context/UserContext";

import { registerUser } from "@/utills/registerUser";
import { loginUser } from "@/utills/loginUser";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();

  const { login } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const validate = () => {
    const newErrors: Record<
      string,
      string
    > = {};

    if (!name.trim())
      newErrors.name = "Name is required";

    if (!email.trim())
      newErrors.email =
        "Email is required";

    if (!phone.trim())
      newErrors.phone =
        "Phone number is required";

    if (password.length < 6)
      newErrors.password =
        "Password must be at least 6 characters";

    if (password !== confirmPassword)
      newErrors.confirmPassword =
        "Passwords do not match";

    if (!agreeTerms)
      newErrors.terms =
        "Please accept terms & conditions";

    return newErrors;
  };

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();

      const payload = {
        name,
        email,
        phone,
        password,
      };

      formData.append(
        "data",
        JSON.stringify(payload)
      );

      const res = await registerUser(
        formData
      );

      if (res.success) {
        toast.success(
          "Registration successful!"
        );

        const loggedInUser =
          await loginUser({
            email,
            password,
          });

        login(loggedInUser.user.user);

        if (
          loggedInUser.user.user.role ===
            "ADMIN" ||
          loggedInUser.user.user.role ===
            "TEACHER"
        ) {
          router.push("/staff/dashboard");
        } else if (
          loggedInUser.user.user.role ===
          "STUDENT"
        ) {
          router.push(
            "/student/dashboard"
          );
        } else {
          router.push("/");
        }
      } else {
        toast.error(
          res.message ||
            "Registration failed"
        );
      }
    } catch (error) {
      console.error(error);

      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="
        relative flex min-h-[calc(100vh-64px)]
        items-center justify-center
        overflow-hidden
        bg-background
        px-4 py-12
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_40%)]
          dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_35%)]
        "
      />

      {/* Grid */}
      <div
        className="
          absolute inset-0 opacity-30
          bg-size-[32px_32px]
          bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]
        "
      />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <div
              className="
                flex h-16 w-16 items-center justify-center
                rounded-3xl
                bg-primary
                text-primary-foreground
                shadow-lg
              "
            >
              <BookOpen className="h-8 w-8" />
            </div>
          </div>

          <h1
            className="
              text-3xl font-bold tracking-tight
              text-foreground
            "
          >
            Create Account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Join the platform and start
            learning today
          </p>
        </div>

        {/* Card */}
        <div
          className="
            rounded-3xl
            border border-border
            bg-card/80
            p-8
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <form
            onSubmit={handleSignup}
            className="space-y-4"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name
              </Label>

              <div className="relative">
                <User
                  className="
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                  className="
                    h-11 rounded-xl
                    border-border
                    bg-background
                    pl-10
                  "
                />
              </div>

              {errors.name && (
                <p className="text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              <div className="relative">
                <Mail
                  className="
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="
                    h-11 rounded-xl
                    border-border
                    bg-background
                    pl-10
                  "
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>
                Phone Number
              </Label>

              <div className="relative">
                <Phone
                  className="
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="
                    h-11 rounded-xl
                    border-border
                    bg-background
                    pl-10
                  "
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <LockKeyhole
                  className="
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  className="
                    h-11 rounded-xl
                    border-border
                    bg-background
                    pl-10 pr-10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                    hover:text-foreground
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>

              <div className="relative">
                <LockKeyhole
                  className="
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <Input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm password"
                  className="
                    h-11 rounded-xl
                    border-border
                    bg-background
                    pl-10 pr-10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                    hover:text-foreground
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(v) =>
                    setAgreeTerms(!!v)
                  }
                  className="mt-1"
                />

                <Label
                  htmlFor="terms"
                  className="
                    cursor-pointer text-sm
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="
                      font-medium text-primary
                      hover:underline
                    "
                  >
                    terms & conditions
                  </Link>
                </Label>
              </div>

              {errors.terms && (
                <p className="pl-6 text-xs text-red-500">
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                mt-2 h-11 w-full rounded-xl
                text-base font-semibold
              "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="
                      h-4 w-4 animate-spin
                      rounded-full
                      border-2 border-white/30
                      border-t-white
                    "
                  />

                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="
                  font-semibold text-primary
                  hover:underline
                "
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}