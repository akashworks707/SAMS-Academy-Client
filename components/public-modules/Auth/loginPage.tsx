"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, User2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { loginUser } from "@/utills/loginUser";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/GoogleLogin";

// function GoogleIcon() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 18 18"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
//         fill="#4285F4"
//       />
//       <path
//         d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
//         fill="#34A853"
//       />
//       <path
//         d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
//         fill="#FBBC05"
//       />
//       <path
//         d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
//         fill="#EA4335"
//       />
//     </svg>
//   );
// }

const bn = {
  title: "লগইন করুন",
  subtitle: "আপনার একাউন্ট প্রবেশ করতে নিচের তথ্য দিন",
  identifierLabel: "ইমেইল / মোবাইল নম্বর",
  identifierPlaceholder: "আপনার ইমেইল বা মোবাইল নম্বর দিন",
  passwordLabel: "পাসওয়ার্ড",
  passwordPlaceholder: "আপনার পাসওয়ার্ড দিন",
  rememberMe: "আমাকে মনে রাখুন",
  forgotPassword: "পাসওয়ার্ড ভুলেছেন?",
  loginBtn: "লগইন করুন",
  orDivider: "অথবা",
  googleLogin: "Google দিয়ে লগইন করুন",
  noAccount: "এখনো একাউন্ট নেই?",
  register: "নিবন্ধন করুন",
  loggingIn: "লগইন হচ্ছে...",
  footer: "© 2025 সামস একাডেমি। সর্বস্বত্ব সংরক্ষিত।",
};

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await loginUser({ email: identifier, password });
    if (res.success) {
      toast.success("লগইন সফল হয়েছে!");
      login(res.user.user);
      const role = res.user.user.role;
      if (role === "ADMIN" || role === "TEACHER" || role === "STUDENT") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } else {
      toast.error(res.message || "লগইন ব্যর্থ হয়েছে!");
    }
    setIsLoading(false);
  };

  return (
    <div
      className="
      min-h-screen flex flex-col items-center justify-center px-4 py-8
      bg-slate-200 dark:bg-slate-950
      transition-colors duration-300
    "
    >
      <div
        className="
          w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex
          border border-slate-300 dark:border-slate-700
        "
        style={{ minHeight: 540 }}
      >
        <div
          className="hidden md:flex flex-col items-center justify-between w-75 shrink-0 px-7 py-8"
          style={{
            background:
              "linear-gradient(160deg, #0f6b3c 0%, #0d5a32 45%, #083d22 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center mx-auto gap-3 shrink-0">
              <div
                className="
                relative h-24 w-96 overflow-hidden
                rounded-xl
                transition-transform duration-300
                hover:scale-[1.02]
              "
              >
                <Image
                  src="/logos/sams-logo-bn.jpeg"
                  alt="SAMS Academy Logo"
                  fill
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </Link>
          </div>

          <p
            className="text-center text-[13px] leading-relaxed text-white/70 px-1"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            মানসম্মত শিক্ষা ও আধুনিক প্রশিক্ষণের মাধ্যমে আপনার ভবিষ্যৎ গড়ে
            তুলুন আমাদের সাথে।
          </p>

          <div className="w-full mt-2">
            <div className="relative w-full h-48">
              <Image
                src="/graduate.svg"
                alt="Education illustration"
                fill
                className="object-contain object-bottom drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        <div
          className="
          flex-1 flex flex-col justify-center px-8 py-10 md:px-10
          bg-white dark:bg-slate-800
          transition-colors duration-300
        "
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <User2 className="h-5 w-5 text-slate-500 dark:text-slate-300" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-slate-800 dark:text-slate-100"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {bn.title}
              </h1>
              <p
                className="text-sm text-slate-500 dark:text-slate-400 mt-0.5"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {bn.subtitle}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier */}
            <div className="space-y-1.5">
              <Label
                htmlFor="identifier"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {bn.identifierLabel}
              </Label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={bn.identifierPlaceholder}
                  className="
                    pl-10 h-11 rounded-lg text-sm
                    border-slate-300 dark:border-slate-600
                    bg-white dark:bg-slate-700
                    text-slate-800 dark:text-slate-100
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus-visible:ring-[#0E8F3B] dark:focus-visible:ring-[#4ade80]
                    focus-visible:border-[#0E8F3B] dark:focus-visible:border-[#4ade80]
                  "
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {bn.passwordLabel}
              </Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={bn.passwordPlaceholder}
                  className="
                    pl-10 pr-10 h-11 rounded-lg text-sm
                    border-slate-300 dark:border-slate-600
                    bg-white dark:bg-slate-700
                    text-slate-800 dark:text-slate-100
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus-visible:ring-[#0E8F3B] dark:focus-visible:ring-[#4ade80]
                    focus-visible:border-[#0E8F3B] dark:focus-visible:border-[#4ade80]
                  "
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
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
                  onCheckedChange={(v) => setRememberMe(!!v)}
                  className="
                    border-slate-300 dark:border-slate-600
                    data-[state=checked]:bg-[#0E8F3B]
                    data-[state=checked]:border-[#0E8F3B]
                  "
                />
                <Label
                  htmlFor="remember"
                  className="text-sm cursor-pointer text-slate-600 dark:text-slate-400"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  {bn.rememberMe}
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#0E8F3B] dark:text-[#4ade80] hover:underline"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                {bn.forgotPassword}
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full hover:cursor-pointer h-12 rounded-lg font-semibold text-base
                flex items-center justify-center gap-2
                bg-[#0E8F3B] hover:bg-[#0a7a32]
                dark:bg-[#0E8F3B] dark:hover:bg-[#0a7a32]
                text-white shadow-md shadow-[#0E8F3B]/30
                disabled:opacity-60 transition-colors
              "
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {bn.loggingIn}
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  {bn.loginBtn}
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
            <span
              className="text-xs text-slate-400 dark:text-slate-500"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {bn.orDivider}
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
          </div>

          {/* Google */}
          {/* <button
            type="button"
            className="
              w-full h-11 hover:cursor-pointer rounded-lg text-sm font-medium
              flex items-center justify-center gap-2
              border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-700
              text-slate-700 dark:text-slate-200
              hover:bg-slate-50 dark:hover:bg-slate-600
              shadow-sm transition-colors
            "
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <GoogleIcon />
            {bn.googleLogin}
          </button> */}
          <GoogleAuthButton />

          {/* Sign-up link */}
          <p
            className="text-center text-sm text-slate-800 dark:text-slate-400 mt-5"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            {bn.noAccount}{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#0E8F3B] dark:text-[#4ade80] hover:underline"
            >
              {bn.register}
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p
        className="mt-5 text-xs text-slate-700 dark:text-slate-300"
        style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
      >
        {bn.footer}
      </p>
    </div>
  );
}
