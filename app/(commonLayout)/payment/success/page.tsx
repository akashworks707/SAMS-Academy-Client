"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Home, BookOpen,
  ArrowRight, Loader2, Receipt, Hash,
  BadgeCheck, AlertTriangle, RefreshCw,
} from "lucide-react";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get("transactionId");
  const amount        = searchParams.get("amount");
  const status        = searchParams.get("status"); // "success" | "failed" | etc.

  const isSuccess = status === "success";

  const [open, setOpen] = useState(false);

  // Open modal immediately on mount
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center px-4">

      {/* Subtle background glow */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}>
        <div className={`absolute inset-0 ${isSuccess
          ? "bg-[radial-gradient(ellipse_at_50%_30%,rgba(34,197,94,0.08),transparent_65%)]"
          : "bg-[radial-gradient(ellipse_at_50%_30%,rgba(239,68,68,0.08),transparent_65%)]"
        }`} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-md p-0 gap-0 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] overflow-hidden"
          // Prevent closing by clicking outside or pressing Escape for important payment status
          // onInteractOutside={(e) => e.preventDefault()}
          // onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Top accent bar */}
          <div className={`h-1 w-full ${isSuccess
            ? "bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-500"
            : "bg-linear-to-r from-red-400 via-rose-400 to-red-500"
          }`} />

          <div className="p-8 flex flex-col items-center text-center gap-5">

            {/* Icon */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isSuccess
                ? "bg-emerald-500/10 dark:bg-emerald-500/15"
                : "bg-red-500/10 dark:bg-red-500/15"
              }`}>
                {isSuccess
                  ? <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  : <XCircle className="w-12 h-12 text-red-500" />
                }
              </div>
              {/* Pulse ring */}
              <div className={`absolute inset-0 rounded-full animate-ping ${isSuccess ? "bg-emerald-400/15" : "bg-red-400/15"}`}
                style={{ animationDuration: "2.5s" }}
              />
            </div>

            {/* Title & subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isSuccess ? "পেমেন্ট সফল! 🎉" : "পেমেন্ট ব্যর্থ হয়েছে"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {isSuccess
                  ? "আপনার পেমেন্ট সম্পন্ন হয়েছে। কোর্সে আপনার সম্পূর্ণ অ্যাক্সেস এখন চালু হয়েছে।"
                  : "দুঃখিত, পেমেন্ট প্রক্রিয়া সম্পন্ন হয়নি। আবার চেষ্টা করুন।"
                }
              </p>
            </div>

            {/* Transaction details */}
            <div className="w-full rounded-xl border border-slate-100 dark:border-white/6 bg-slate-50 dark:bg-white/3 divide-y divide-slate-100 dark:divide-white/5 text-left overflow-hidden">
              {transactionId && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    Transaction ID
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 max-w-40 truncate">
                    {transactionId}
                  </span>
                </div>
              )}
              {amount && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    পরিমাণ
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    ৳{Number(amount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  {isSuccess
                    ? <BadgeCheck className="w-3.5 h-3.5" />
                    : <AlertTriangle className="w-3.5 h-3.5" />
                  }
                  স্ট্যাটাস
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${isSuccess
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
                }`}>
                  {isSuccess ? "সফল" : "ব্যর্থ"}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex flex-col gap-3">
              {isSuccess ? (
                <>
                  {/* Primary: Continue to course */}
                  <button
                    onClick={() => router.push("/student/dashboard/courses")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                      bg-emerald-500 hover:bg-emerald-400
                      text-white font-semibold text-sm
                      transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]
                      active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    কোর্স চালিয়ে যান
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Secondary: Go home */}
                  <button
                    onClick={() => router.push("/")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                      bg-slate-100 dark:bg-white/5
                      border border-slate-200 dark:border-white/8
                      text-slate-600 dark:text-slate-400
                      font-medium text-sm
                      hover:bg-slate-200 dark:hover:bg-white/10
                      transition-all active:scale-95"
                  >
                    <Home className="w-4 h-4" />
                    হোমে যান
                  </button>
                </>
              ) : (
                <>
                  {/* Primary: Retry */}
                  <button
                    onClick={() => router.back()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                      bg-red-500 hover:bg-red-400
                      text-white font-semibold text-sm
                      transition-all hover:shadow-[0_0_24px_rgba(239,68,68,0.3)]
                      active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    আবার চেষ্টা করুন
                  </button>

                  {/* Secondary: Go home */}
                  <button
                    onClick={() => router.push("/")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                      bg-slate-100 dark:bg-white/5
                      border border-slate-200 dark:border-white/8
                      text-slate-600 dark:text-slate-400
                      font-medium text-sm
                      hover:bg-slate-200 dark:hover:bg-white/10
                      transition-all active:scale-95"
                  >
                    <Home className="w-4 h-4" />
                    হোমে যান
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}