"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Clock, CalendarDays, BadgeCheck, Star,
  BookOpen, X, ChevronUp, ChevronDown, ChevronsUpDown,
  Users, PlayCircle, GraduationCap, ArrowRight,
  CheckCircle2, Award, LogIn,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
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
  assignSubWithTeacher?: any[];
  description2?: string;
}

type SortField = "title" | "status" | "totalClasses" | "regularPrice";
type SortDir = "asc" | "desc" | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getClassName = (cls: CourseItem["class"]) =>
  typeof cls === "object" && cls ? cls.title : "";

const statusMap = {
  running:   { label: "Running",   dot: "bg-emerald-400", pill: "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
  upcoming:  { label: "Upcoming",  dot: "bg-blue-400",    pill: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400"             },
  completed: { label: "Completed", dot: "bg-slate-400",   pill: "bg-slate-500/10 border-slate-400/30 text-slate-600 dark:text-slate-400"         },
};

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({
  course, onViewDetails, onEnroll,
}: {
  course: CourseItem;
  onViewDetails: (c: CourseItem) => void;
  onEnroll: (c: CourseItem) => void;
}) {
  const price  = course.discountPrice ?? course.regularPrice;
  const hasOff = course.discountPrice && course.regularPrice && course.discountPrice < course.regularPrice;
  const pct    = hasOff ? Math.round(((course.regularPrice! - course.discountPrice!) / course.regularPrice!) * 100) : 0;
  const cls    = getClassName(course.class);
  const s      = statusMap[course.status ?? "upcoming"] ?? statusMap.upcoming;

  return (
    <div
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden
        border border-slate-200 dark:border-white/8
        bg-white dark:bg-linear-to-b dark:from-[#131f34] dark:to-[#0f1928]
        shadow-sm hover:shadow-xl dark:hover:shadow-[0_16px_48px_rgba(34,197,94,0.13)]
        hover:border-emerald-400/60 dark:hover:border-emerald-500/35
        transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
      onClick={() => onViewDetails(course)}
    >
      {/* Top accent */}
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

        <h3 className="font-semibold text-slate-900 dark:text-white text-[15px] leading-snug line-clamp-2 flex-1">
          {course.title}
        </h3>

        {(course.totalClasses || course.duration) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
            {course.totalClasses && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {course.totalClasses} classes
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {course.duration}
              </span>
            )}
          </div>
        )}

        <div className="h-px bg-slate-100 dark:bg-white/5" />

        {/* Price + Enroll */}
        <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
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
          <button
            onClick={(e) => { e.stopPropagation(); onEnroll(course); }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
              bg-emerald-50 dark:bg-emerald-500/15
              border border-emerald-300 dark:border-emerald-500/25
              text-emerald-700 dark:text-emerald-400
              text-xs font-semibold
              hover:bg-emerald-500 hover:text-white hover:border-emerald-500
              dark:hover:bg-emerald-500 dark:hover:text-white dark:hover:border-emerald-500
              transition-all duration-200"
          >
            ভর্তি হন <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Course Skeleton ──────────────────────────────────────────────────────────

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#111c2e] overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="h-px bg-slate-100 dark:bg-white/5" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, sortField, sortDir }: {
  field: SortField; sortField: SortField | null; sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />;
}

// ─── Course Details Modal ─────────────────────────────────────────────────────

function CourseDetailsModal({
  course, open, onOpenChange, onEnroll,
}: {
  course: CourseItem | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEnroll: (c: CourseItem) => void;
}) {
  if (!course) return null;

  const price  = course.discountPrice ?? course.regularPrice;
  const hasOff = course.discountPrice && course.regularPrice && course.discountPrice < course.regularPrice;
  const pct    = hasOff ? Math.round(((course.regularPrice! - course.discountPrice!) / course.regularPrice!) * 100) : 0;
  const cls    = getClassName(course.class);
  const s      = statusMap[course.status ?? "upcoming"] ?? statusMap.upcoming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111c2e]">

        {/* Thumbnail header */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-[#0a1422]">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-slate-300 dark:text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Status + featured */}
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
            </div>
            <h2 className="text-xl font-bold text-white leading-snug">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Clock, label: "Classes", value: course.totalClasses ? `${course.totalClasses}` : "—" },
              { icon: CalendarDays, label: "Duration", value: course.duration ?? "—" },
              { icon: Users, label: "Batch", value: course.batch ?? "—" },
              { icon: Award, label: "Certificate", value: course.certificate ? "Yes" : "No" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/6 text-center">
                <Icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Dates */}
          {(course.courseStartDate || course.courseEndDate) && (
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              {course.courseStartDate && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Start: <strong className="text-slate-800 dark:text-white ml-1">
                    {new Date(course.courseStartDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </strong>
                </span>
              )}
              {course.courseEndDate && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  End: <strong className="text-slate-800 dark:text-white ml-1">
                    {new Date(course.courseEndDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </strong>
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {course.description && (
            <>
              <Separator className="bg-slate-100 dark:bg-white/6" />
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  Course Overview
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </>
          )}

          {/* Badges */}
          {(course.isFeatured || course.certificate) && (
            <>
              <Separator className="bg-slate-100 dark:bg-white/6" />
              <div className="flex gap-2 flex-wrap">
                {course.isFeatured && (
                  <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured Course
                  </Badge>
                )}
                {course.certificate && (
                  <Badge className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 gap-1">
                    <BadgeCheck className="w-3 h-3" /> Certificate Included
                  </Badge>
                )}
              </div>
            </>
          )}

          <Separator className="bg-slate-100 dark:bg-white/6" />

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-4">
            <div>
              {price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">৳{price.toLocaleString()}</span>
                  {hasOff && (
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400 line-through">৳{course.regularPrice?.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{pct}% Discount</span>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Free</span>
              )}
            </div>
            <button
              onClick={() => { onOpenChange(false); onEnroll(course); }}
              className="flex items-center gap-2 px-6 py-3 rounded-full
                bg-emerald-500 hover:bg-emerald-400
                text-white font-semibold text-sm
                transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.4)]
                active:scale-95"
            >
              ভর্তি হন <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllCourses() {
  const router = useRouter();
  const { user } = useUser();

  const [searchTerm, setSearchTerm]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField]       = useState<SortField | null>(null);
  const [sortDir, setSortDir]           = useState<SortDir>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);

  const { data, isLoading } = useGetCoursesQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });

  const allCourses: CourseItem[] = (data as any)?.data ?? [];

  // Client-side status filter + sort
  const displayCourses = useMemo(() => {
    let list = allCourses;
    if (statusFilter !== "all") {
      list = list.filter((c) => (c.status ?? "upcoming") === statusFilter);
    }
    if (sortField && sortDir) {
      list = [...list].sort((a, b) => {
        const aVal: any = a[sortField] ?? "";
        const bVal: any = b[sortField] ?? "";
        const cmp = typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [allCourses, statusFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField !== field) { setSortField(field); setSortDir("asc");  return; }
    if (sortDir === "asc")   { setSortDir("desc");                       return; }
    setSortField(null); setSortDir(null);
  };

  const handleViewDetails = (course: CourseItem) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleEnroll = (course: CourseItem) => {
    if (!user) {
      // Not logged in — redirect to login, after login return to enrollment page
      router.push(`/login?redirect=/enrollment/${course.slug}`);
      return;
    }
    // Logged in — go directly to enrollment page
    router.push(`/enrollment/${course.slug}`);
  };

  const hasActiveFilters = statusFilter !== "all";

  // Sort toggle buttons
  const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
        ${sortField === field
          ? "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
          : "bg-white dark:bg-white/4 border-slate-200 dark:border-white/[0.07] text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-500/30"
        }`}
    >
      {label}
      <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-[#0d1f2d] to-[#0B1120] dark:from-[#060e1a] dark:via-[#0d1f2d] dark:to-[#0B1120] py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-20%,rgba(34,197,94,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold tracking-wide">সামস একাডেমি</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            আমাদের সকল{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
              কোর্সসমূহ
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে শিখুন এবং আপনার ভবিষ্যৎ গড়ে তুলুন
          </p>
          <div className="mt-6 text-sm text-slate-500">
            {!isLoading && (
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-500/70" />
                {displayCourses.length} টি কোর্স উপলব্ধ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/6 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="কোর্স খুঁজুন..."
              className="pl-10 h-9 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} 
          onValueChange={(v) => setStatusFilter(String(v))}
          >
            <SelectTrigger className="w-36 h-9 text-sm bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/8 shrink-0">
              <span>{statusFilter === "all" ? "সব স্ট্যাটাস" : statusMap[statusFilter as keyof typeof statusMap]?.label}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort buttons */}
          <div className="flex gap-2 flex-wrap">
            <SortBtn field="regularPrice" label="দাম" />
            <SortBtn field="totalClasses" label="ক্লাস" />
            <SortBtn field="title"        label="নাম"  />
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0 border-slate-200 dark:border-white/8"
              onClick={() => setStatusFilter("all")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : displayCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">কোনো কোর্স পাওয়া যায়নি</p>
            <p className="text-sm mt-1">অন্য কীওয়ার্ড বা ফিল্টার চেষ্টা করুন</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 dark:text-slate-600 mb-5">
              {displayCourses.length} টি কোর্স {hasActiveFilters && "(ফিল্টার করা)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onViewDetails={handleViewDetails}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Details Modal ── */}
      <CourseDetailsModal
        course={selectedCourse}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onEnroll={handleEnroll}
      />
    </div>
  );
}