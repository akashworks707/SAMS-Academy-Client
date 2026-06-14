"use client"

import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, Clock, Star } from "lucide-react";
import Link from "next/link";
import { SectionEyebrow } from "./SectionHeader";
const getClassName = (cls: any) =>
  typeof cls === "object" && cls ? cls.title : "";

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: any }) {
  const price  = course.discountPrice ?? course.regularPrice;
  const hasOff = course.discountPrice && course.regularPrice && course.discountPrice < course.regularPrice;
  const cls    = getClassName(course.class);
  const pct    = hasOff ? Math.round(((course.regularPrice - course.discountPrice) / course.regularPrice) * 100) : 0;

  const statusMap: Record<string, { dot: string; label: string; pill: string }> = {
    running:   { dot: "bg-emerald-400", label: "Running",   pill: "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
    upcoming:  { dot: "bg-blue-400",    label: "Upcoming",  pill: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400"             },
    completed: { dot: "bg-slate-400",   label: "Completed", pill: "bg-slate-500/10 border-slate-400/30 text-slate-600 dark:text-slate-400"         },
  };
  const s = statusMap[course.status ?? ""] ?? statusMap.upcoming;

  return (
    <div className="group relative flex flex-col h-full rounded-2xl overflow-hidden
      border border-slate-200 ark:border-white/8
      bg-white dark:bg-linear-to-b dark:from-[#131f34] dark:to-[#0f1928]
      shadow-sm hover:shadow-lg dark:hover:shadow-[0_16px_48px_rgba(34,197,94,0.13)]
      hover:border-emerald-400/60 dark:hover:border-emerald-500/35
      transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-[#0a1422] shrink-0">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-linear-to-br dark:from-[#0f1e33] dark:to-[#0a1422]">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-white/[0.07]" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

        {course.status && (
          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold backdrop-blur-md ${s.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
            {s.label}
          </div>
        )}
        {course.isFeatured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-[10px] font-semibold backdrop-blur-md">
            <Star className="w-2.5 h-2.5 fill-current" /> Featured
          </div>
        )}
        {pct > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
            {pct}% OFF
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {cls && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.07]">
              {cls}
            </span>
          )}
          {course.batch && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              {course.batch}
            </span>
          )}
          {course.certificate && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1">
              <BadgeCheck className="w-2.5 h-2.5" /> Certificate
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-white text-[15px] leading-snug line-clamp-2 flex-1">
          {course.title}
        </h3>

        {/* Meta */}
        {(course.totalClasses || course.duration) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
            {course.totalClasses && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.totalClasses} classes
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {course.duration}
              </span>
            )}
          </div>
        )}

        <div className="h-px bg-slate-100 dark:bg-white/5" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            {price ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900 dark:text-white">৳{price.toLocaleString()}</span>
                {hasOff && (
                  <span className="text-xs text-slate-400 line-through">৳{course.regularPrice?.toLocaleString()}</span>
                )}
              </div>
            ) : (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Free</span>
            )}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
              bg-emerald-50 dark:bg-emerald-500/15
              border border-emerald-300 dark:border-emerald-500/25
              text-emerald-700 dark:text-emerald-400
              text-xs font-semibold
              hover:bg-emerald-500 hover:text-white hover:border-emerald-500
              dark:hover:bg-emerald-500 dark:hover:text-white dark:hover:border-emerald-500
              transition-all duration-200"
          >
            Enroll <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function OurCoursesSection() {
  const { data, isLoading } = useGetCoursesQuery({ limit: 4, page: 1 });
  const courses = data?.data ?? [];

  return (
    <section className="bg-slate-50 dark:bg-[#0B1120] py-20 px-4 transition-colors">
      <div className="container mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <SectionEyebrow label="আমাদের কোর্সসমূহ" />
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              সেরা কোর্সগুলো{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                এক জায়গায়
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-md leading-relaxed">
              অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে শিখুন, নিজেকে গড়ুন
            </p>
          </div>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              border border-emerald-500/40 dark:border-emerald-500/30
              text-emerald-700 dark:text-emerald-400
              text-sm font-semibold
              hover:bg-emerald-50 dark:hover:bg-emerald-500/10
              transition-all shrink-0 whitespace-nowrap"
          >
            সব কোর্স দেখুন
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-200 dark:bg-[#111c2e] border border-slate-200 dark:border-white/[0.07] h-80 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>কোনো কোর্স পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((course: any) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}