"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
} from "lucide-react";

import { toast } from "sonner";

import { useUser } from "@/context/UserContext";
import { loginUser } from "@/utills/loginUser";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsLoading(true);

    const loginData = {
      email,
      password,
    };

    const res = await loginUser(loginData);

    if (res.success) {
      toast.success("Login successful!");

      login(res.user.user);

      if (
        res.user.user.role === "ADMIN" ||
        res.user.user.role === "TEACHER"
      ) {
        router.push("/staff/dashboard");
      } else if (
        res.user.user.role === "STUDENT"
      ) {
        router.push("/student/dashboard");
      } else {
        router.push("/");
      }
    } else {
      toast.error(
        res.message || "Login failed!"
      );
    }

    setIsLoading(false);
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
      {/* Background */}
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
        {/* Top */}
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
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your learning
            journey
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
            onSubmit={handleLogin}
            className="space-y-5"
          >
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
                  required
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
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
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
                    transition-colors
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
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) =>
                    setRememberMe(!!v)
                  }
                />

                <Label
                  htmlFor="remember"
                  className="
                    cursor-pointer text-sm
                    text-muted-foreground
                  "
                >
                  Remember me
                </Label>
              </div>

              <Link
                href="/forgot-password"
                className="
                  text-sm font-medium
                  text-primary
                  transition-colors
                  hover:underline
                "
              >
                Forgot Password?
              </Link>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                h-11 w-full rounded-xl
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

                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Bottom */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="
                  font-semibold text-primary
                  hover:underline
                "
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}