"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CircleDollarSign, BookOpen,
  CalendarDays, Users, X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useGetTeacherAnalyticsQuery } from "@/redux/features/analytics/analytics.api";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TeacherStats {
  totalClasses: number;
  totalRevenue: number;
  perClassSalary: number;
  assignedCoursesCount: number;
  totalStudents: number;
}

interface ChartPoint {
  period: string;
  revenue?: number;
  classes?: number;
  totalEnrollments?: number;
  completedEnrollments?: number;
}

interface CourseRevenue {
  courseId: string;
  courseTitle: string;
  courseStatus: string;
  totalClasses: number;
  teacherSalary: number;   // this teacher's earned salary for this course
  courseRevenue: number;   // total payment collected from students
  totalStudents: number;
}

interface CourseRevenueSummary {
  totalCourses: number;
  totalTeacherSalary: number;
  totalCourseRevenue: number;
  totalStudents: number;
  totalClasses: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtBDT = (n: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Math.round(n))}`;

const formatPeriod = (p: string, granularity: string) => {
  const parts = p.split("-");
  if (granularity === "year" || parts.length === 1) return parts[0];
  if (granularity === "week") return `Wk ${parts[1]}, ${parts[0]}`;
  if (granularity === "day" && parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

const colorTokens = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", sub: "text-emerald-600 dark:text-emerald-400" },
  indigo:  { bg: "bg-indigo-50 dark:bg-indigo-900/20",   icon: "text-indigo-600 dark:text-indigo-400",   sub: "text-indigo-500 dark:text-indigo-400"  },
  violet:  { bg: "bg-violet-50 dark:bg-violet-900/20",   icon: "text-violet-600 dark:text-violet-400",   sub: "text-violet-500 dark:text-violet-400"  },
  amber:   { bg: "bg-amber-50 dark:bg-amber-900/20",     icon: "text-amber-600 dark:text-amber-400",     sub: "text-amber-500 dark:text-amber-400"    },
} as const;
type ColorKey = keyof typeof colorTokens;

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: ColorKey;
}) {
  const c = colorTokens[color];
  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {value}
            </p>
            {sub && <p className={`text-xs font-medium ${c.sub}`}>{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${c.bg} shrink-0`}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatSkeleton() {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, granularity }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-xs min-w-[140px]">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {formatPeriod(label, granularity)}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {p.name.toLowerCase().includes("salary") || p.name.toLowerCase().includes("revenue")
              ? fmtBDT(p.value)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Course Status Badge ───────────────────────────────────────────────────────

function CourseBadge({ status }: { status?: string }) {
  if (!status) return null;
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    running:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
    upcoming:  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    completed: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <Badge variant="outline" className={`text-[10px] px-2 py-0 capitalize ${map[s] ?? ""}`}>
      {s}
    </Badge>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [granularity, setGranularity] = useState<"day" | "week" | "month" | "year">("month");

  const hasDateFilter = !!(startDate || endDate);

  const { data: res, isLoading } = useGetTeacherAnalyticsQuery({
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    granularity,
  });

  const stats: TeacherStats | null = res?.data?.stats ?? null;
  const revenueChartData: ChartPoint[] = res?.data?.revenueChart?.chartData ?? [];
  const enrollmentChartData: ChartPoint[] = res?.data?.enrollmentChart?.chartData ?? [];
  const courses: CourseRevenue[] = res?.data?.courseRevenue?.courses ?? [];
  const courseRevenueSummary: CourseRevenueSummary | undefined = res?.data?.courseRevenue?.summary;

  // merge salary + enrollment chart by period
  const combinedChartData = useMemo(() => {
    const map: Record<string, any> = {};
    for (const r of revenueChartData) {
      map[r.period] = { period: r.period, revenue: r.revenue ?? 0, classes: r.classes ?? 0 };
    }
    for (const e of enrollmentChartData) {
      map[e.period] = {
        ...(map[e.period] ?? { period: e.period, revenue: 0, classes: 0 }),
        totalEnrollments: e.totalEnrollments ?? 0,
        completedEnrollments: e.completedEnrollments ?? 0,
      };
    }
    return Object.values(map).sort((a, b) => a.period.localeCompare(b.period));
  }, [revenueChartData, enrollmentChartData]);

  const clearDates = () => { setStartDate(""); setEndDate(""); };
  const tickFmt = (v: string) => formatPeriod(v, granularity);

  const statCards = stats ? [
    {
      label: "Total Salary Earned",
      value: fmtBDT(stats.totalRevenue),
      sub: `৳${stats.perClassSalary.toLocaleString()} per class`,
      icon: CircleDollarSign,
      color: "emerald" as ColorKey,
    },
    {
      label: "Classes Conducted",
      value: stats.totalClasses,
      sub: "Completed zoom sessions",
      icon: CalendarDays,
      color: "indigo" as ColorKey,
    },
    {
      label: "Assigned Courses",
      value: stats.assignedCoursesCount,
      // ✅ shows total course revenue (student payments), not teacher salary
      sub: courseRevenueSummary?.totalCourseRevenue
        ? `${fmtBDT(courseRevenueSummary.totalCourseRevenue)} course revenue`
        : "৳0 course revenue",
      icon: BookOpen,
      color: "violet" as ColorKey,
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      sub: "Enrolled in your courses",
      icon: Users,
      color: "amber" as ColorKey,
    },
  ] : [];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Revenue, classes and enrollment overview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">From</span>
          <Input type="date" className="h-9 w-40 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span className="text-sm text-slate-500 dark:text-slate-400">to</span>
          <Input type="date" className="h-9 w-40 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {hasDateFilter && (
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={clearDates} title="Clear date filter">
              <X className="w-4 h-4" />
            </Button>
          )}
          <Select value={granularity} onValueChange={(v) => setGranularity(v as any)}>
            <SelectTrigger className="h-9 w-32 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((c) => <StatCard key={c.label} {...c} />)
        }
      </div>

      {/* ── Chart Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Salary area chart — 2 cols */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-0 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Salary Earned Over Time
              </CardTitle>
              <Badge variant="outline" className="text-[11px] capitalize">{granularity}</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-56 rounded-lg" />
            ) : combinedChartData.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-sm text-slate-400">No data for selected period</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={combinedChartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gSalary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gClasses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="period" tickFormatter={tickFmt} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="rev" orientation="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="cls" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={(p) => <ChartTooltip {...p} granularity={granularity} />} />
                    <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Salary" stroke="#10b981" strokeWidth={2} fill="url(#gSalary)" dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Area yAxisId="cls" type="monotone" dataKey="classes" name="Classes" stroke="#6366f1" strokeWidth={2} fill="url(#gClasses)" dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-5 mt-2 px-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-0.5 rounded-full bg-emerald-500 inline-block" />
                    Salary (left axis)
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-0.5 rounded-full bg-indigo-500 inline-block" />
                    Classes (right axis)
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Enrollment bar chart — 1 col */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-0 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Student Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-56 rounded-lg" />
            ) : combinedChartData.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-sm text-slate-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={244}>
                <BarChart data={combinedChartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" tickFormatter={tickFmt} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={(p) => <ChartTooltip {...p} granularity={granularity} />} />
                  <Bar dataKey="totalEnrollments" name="Enrolled" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completedEnrollments" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Course Revenue Table + Bar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Table — 3 cols */}
        <Card className="lg:col-span-3 border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-3 px-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Revenue by Course
              </CardTitle>
              {courseRevenueSummary && (
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    My salary:{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {fmtBDT(courseRevenueSummary.totalTeacherSalary)}
                    </span>
                  </span>
                  <span>
                    Course revenue:{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {fmtBDT(courseRevenueSummary.totalCourseRevenue)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-4">
            {isLoading ? (
              <div className="px-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    {/* <Skeleton className="h-4 w-16" /> */}
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">No course data available</p>
            ) : (
              <>
                {/* ✅ Two separate revenue columns: My Salary + Course Revenue */}
                <div className="grid grid-cols-[1.5rem_1fr_3rem_3rem_5rem_5rem] gap-2 px-5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">#</span>
                  <span className="text-[11px] text-slate-400">Course</span>
                  <span className="text-[11px] text-slate-400 text-right">Cls</span>
                  <span className="text-[11px] text-slate-400 text-right">Stu</span>
                  <span className="text-[11px] text-slate-400 text-right">My Salary</span>
                  {/* <span className="text-[11px] text-slate-400 text-right">Crs Rev</span> */}
                  <span className="text-[11px] text-slate-400 text-center">Status</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses.map((course, idx) => (
                    <div
                      key={course.courseId}
                      className="grid grid-cols-[1.5rem_1fr_3rem_3rem_5rem_5rem] gap-2 px-5 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-400">{idx + 1}</span>

                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {course.courseTitle}
                      </p>

                      {/* classes taken by this teacher */}
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                        {course.totalClasses}
                      </span>

                      {/* students enrolled */}
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">
                        {course.totalStudents}
                      </span>

                      {/* ✅ teacher's salary from this course */}
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 text-right">
                        {fmtBDT(course.teacherSalary)}
                      </span>

                      {/* ✅ total payment revenue for this course */}
                      {/* <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                        {fmtBDT(course.courseRevenue)}
                      </span> */}

                      <div className="flex justify-center">
                        <CourseBadge status={course.courseStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Horizontal bar — teacher salary per course — 2 cols */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-0 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              My Salary by Course
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-64 rounded-lg" />
            ) : courses.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-sm text-slate-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(200, courses.length * 60)}>
                <BarChart
                  data={courses}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 0, left: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `৳${(v / 1000).toFixed(1)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="courseTitle"
                    width={90}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 12) + "…" : v}
                  />
                  <Tooltip
                    formatter={(v: any) => [fmtBDT(v), "My Salary"]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  />
                  {/* ✅ chart shows teacherSalary, not courseRevenue */}
                  <Bar dataKey="teacherSalary" name="My Salary" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}