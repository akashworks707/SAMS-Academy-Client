"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2, Clock, CalendarDays, BadgeCheck,
  Star, BookOpen, ArrowRight, Loader2, CreditCard,
  Calendar, AlertCircle, GraduationCap, Users, Award,
  ExternalLink, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";
import { useGetSingleCourseQuery } from "@/redux/features/course/course.api";
import { useCreateEnrollmentMutation } from "@/redux/features/enrollment/enrollment.api";
import { useUser } from "@/context/UserContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  class?: { _id: string; title: string } | string;
  batch?: string;
  regularPrice?: number;
  discountPrice?: number;
  courseStartDate?: string;
  courseEndDate?: string;
  duration?: string;
  totalClasses?: number;
  status?: "upcoming" | "running" | "completed";
  isFeatured?: boolean;
  isActive?: boolean;
  certificate?: boolean;
  ratings?: number;
}



// ─── Helpers ──────────────────────────────────────────────────────────────────

const getClassName = (cls: CourseItem["class"]) =>
  typeof cls === "object" && cls ? cls.title : "";

const statusMap = {
  running:   { label: "Running",   dot: "bg-emerald-400", pill: "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
  upcoming:  { label: "Upcoming",  dot: "bg-blue-400",    pill: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400"             },
  completed: { label: "Completed", dot: "bg-slate-400",   pill: "bg-slate-500/10 border-slate-400/30 text-slate-600 dark:text-slate-400"         },
};

// ─── Success Modal ────────────────────────────────────────────────────────────

function EnrollmentSuccessModal({
  open,
  onOpenChange,
  paymentUrl,
  courseName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  paymentUrl?: string;
  courseName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-500" />

        <div className="p-8 flex flex-col items-center text-center gap-5">
          {/* Success icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: "2s" }} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ভর্তি সফল হয়েছে! 🎉
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{courseName}</span> কোর্সে আপনার ভর্তি নিশ্চিত হয়েছে।
            </p>
          </div>

          {/* Status note */}
          <div className="w-full flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">পেমেন্ট বাকি আছে</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                আপনার ভর্তি এখন <strong>Pending</strong> অবস্থায় আছে। পেমেন্ট সম্পন্ন করলে কোর্সের সম্পূর্ণ অ্যাক্সেস পাবেন।
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-3 mt-1">
            {paymentUrl && (
              <button
                onClick={() => { window.location.href = paymentUrl; }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                  bg-emerald-500 hover:bg-emerald-400
                  text-white font-semibold text-sm
                  transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]
                  active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                এখনই পেমেন্ট করুন
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                bg-slate-100 dark:bg-white/5
                border border-slate-200 dark:border-white/8
                text-slate-600 dark:text-slate-400
                font-medium text-sm
                hover:bg-slate-200 dark:hover:bg-white/10
                transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              পরে পেমেন্ট করব
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Course Detail Skeleton ───────────────────────────────────────────────────

function EnrollmentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3 p-6 rounded-2xl border border-slate-200 dark:border-white/8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-3 p-6 rounded-2xl border border-slate-200 dark:border-white/8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const slug = params?.slug as string;

  const [successModal, setSuccessModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: courseData, isLoading: courseLoading } = useGetSingleCourseQuery(slug, {
    skip: !slug,
  });

  const [createEnrollment, { isLoading: enrolling }] = useCreateEnrollmentMutation();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !courseLoading) {
      router.push(`/login?redirect=/enrollment/${slug}`);
    }
  }, [user, courseLoading, router, slug]);

  const course = courseData?.data?.result as unknown as CourseItem | undefined;
  

  const price  = course?.discountPrice ?? course?.regularPrice;
  const hasOff = course?.discountPrice && course?.regularPrice && course.discountPrice < course.regularPrice;
  const pct    = hasOff ? Math.round(((course!.regularPrice! - course!.discountPrice!) / course!.regularPrice!) * 100) : 0;
  const cls    = getClassName(course?.class);
  const s      = statusMap[course?.status ?? "upcoming"] ?? statusMap.upcoming;

  const handleEnroll = async () => {
    if (!user || !course) return;
    setErrorMsg(null);

    try {
      const result = await createEnrollment({
        student: (user as any)._id,
        course: course._id,
      }).unwrap();

      const url = (result as any)?.data?.paymentUrl;
      setPaymentUrl(url);
      setSuccessModal(true);
    } catch (err: any) {
      const msg = err?.data?.message ?? "ভর্তি হতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMsg(msg);
    }
  };

  if (courseLoading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <EnrollmentSkeleton />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center">
      <div className="text-center space-y-3">
        <BookOpen className="w-16 h-16 text-slate-300 dark:text-white/10 mx-auto" />
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">কোর্সটি পাওয়া যায়নি</p>
        <button
          onClick={() => router.push("/courses")}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          সব কোর্স দেখুন
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-[#0d1f2d] to-[#0B1120] py-12 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-20%,rgba(34,197,94,0.12),transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold tracking-wide">ভর্তি নিশ্চিতকরণ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            কোর্সে ভর্তি হন
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            নিচের তথ্য যাচাই করে ভর্তি নিশ্চিত করুন
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Course thumbnail header */}
        <div className="relative rounded-2xl overflow-hidden mb-6 h-56 bg-slate-100 dark:bg-[#0a1422]">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-slate-300 dark:text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {course.status && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold backdrop-blur-md ${s.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </div>
            )}
            {course.isFeatured && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold backdrop-blur-md">
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </div>
            )}
          </div>

          {pct > 0 && (
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
              {pct}% OFF
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {cls && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                  {cls}
                </span>
              )}
              {course.batch && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                  {course.batch}
                </span>
              )}
              {course.certificate && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-500/30 backdrop-blur-sm flex items-center gap-1">
                  <BadgeCheck className="w-2.5 h-2.5" /> Certificate
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">
              {course.title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

          {/* ── Left: Course Info ── */}
          <div className="md:col-span-3 space-y-5">

            {/* Quick stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] p-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">কোর্সের বিবরণ</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Clock, label: "মোট ক্লাস", value: course.totalClasses ? `${course.totalClasses} টি` : "—" },
                  { icon: CalendarDays, label: "মেয়াদ", value: course.duration ?? "—" },
                  { icon: Users, label: "ব্যাচ", value: course.batch ?? "—" },
                  { icon: Award, label: "সার্টিফিকেট", value: course.certificate ? "হ্যাঁ" : "না" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/6">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            {(course.courseStartDate || course.courseEndDate) && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">কোর্সের সময়সীমা</h3>
                <div className="flex flex-col gap-2.5">
                  {course.courseStartDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        শুরুর তারিখ
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {new Date(course.courseStartDate).toLocaleDateString("bn-BD", { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  )}
                  {course.courseEndDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        শেষের তারিখ
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {new Date(course.courseEndDate).toLocaleDateString("bn-BD", { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {course.description && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] p-5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  কোর্স সম্পর্কে
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {course.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right: Enrollment Card ── */}
          <div className="md:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e] overflow-hidden">

              {/* Price section */}
              <div className="p-5 border-b border-slate-100 dark:border-white/6">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">কোর্স ফি</p>
                {price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      ৳{price.toLocaleString()}
                    </span>
                    {hasOff && (
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-400 line-through">৳{course.regularPrice?.toLocaleString()}</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{pct}% ছাড়</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">বিনামূল্যে</span>
                )}
              </div>

              {/* What you get */}
              <div className="p-5 border-b border-slate-100 dark:border-white/6 space-y-2.5">
                {[
                  "অভিজ্ঞ শিক্ষকের তত্ত্বাবধানে লাইভ ক্লাস",
                  "রেকর্ডেড ক্লাসের অ্যাক্সেস",
                  course.certificate ? "সমাপ্তি সার্টিফিকেট" : null,
                  "প্রশ্নোত্তর সেশন",
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Student info */}
              {user && (
                <div className="px-5 pt-4 pb-2">
                  <p className="text-xs text-slate-400 mb-2">ভর্তি হচ্ছেন</p>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/6">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      {((user as any).name?.[0] ?? (user as any).email?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                        {(user as any).name ?? "শিক্ষার্থী"}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{(user as any).email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {errorMsg && (
                <div className="mx-5 mt-3 flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-400">{errorMsg}</p>
                </div>
              )}

              {/* Enroll button */}
              <div className="p-5">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                    bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed
                    text-white font-semibold text-sm
                    transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]
                    active:scale-95"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      ভর্তি হচ্ছে...
                    </>
                  ) : (
                    <>
                      ভর্তি নিশ্চিত করুন
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                  ভর্তির পর পেমেন্ট করে কোর্সের অ্যাক্সেস পান
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      <EnrollmentSuccessModal
        open={successModal}
        onOpenChange={setSuccessModal}
        paymentUrl={paymentUrl}
        courseName={course.title}
      />
    </div>
  );
}