
"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  CircleDollarSign,
  Users, GraduationCap, CalendarDays, LayoutGrid,
  PlayCircle, Clock, CheckCircle2, X,
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

import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  totalCourses: number;
  totalActiveCourses: number;
  runningCourses: number;
  upcomingCourses: number;
  completedCourses: number;
  totalEnrollments: number;
  completedEnrollments: number;
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
}

interface ChartPoint {
  period: string;
  revenue: number;
  transactions: number;
  totalEnrollments: number;
  newStudents: number;
  completedEnrollments: number;
}

interface TopCourse {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  completionRate: number;
  completedCount: number;
  totalRevenue?: number;
  status?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtBDT = (n: number) =>
  `৳${new Intl.NumberFormat("en-US").format(Math.round(n))}`;

/**
 * Format chart period label correctly per granularity.
 * "2026-06"   → "Jun 26"
 * "2026-25"   → "Week 25, 2026"   (week uses %Y-%U → two numbers)
 * "2026-06-10"→ "Jun 10"
 * "2026"      → "2026"
 */
const formatPeriod = (p: string, granularity: string) => {
  const parts = p.split("-");
  if (granularity === "year" || parts.length === 1) return parts[0];

  if (granularity === "week") {
    // format: YYYY-WW
    return `Wk ${parts[1]}, ${parts[0]}`;
  }

  if (granularity === "day" && parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // month: YYYY-MM
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

// ─── Color tokens ───────────────────────────────────────────────────────────────

const colorTokens = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", sub: "text-indigo-500" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", sub: "text-emerald-600" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", sub: "text-violet-500" },
  amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", sub: "text-amber-500" },
  sky: { bg: "bg-sky-50 dark:bg-sky-900/20", icon: "text-sky-600 dark:text-sky-400", sub: "text-sky-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-900/20", icon: "text-rose-600 dark:text-rose-400", sub: "text-rose-500" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600 dark:text-teal-400", sub: "text-teal-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "text-orange-600 dark:text-orange-400", sub: "text-orange-500" },
} as const;
type ColorKey = keyof typeof colorTokens;



const statsDemo = {
  totalRevenue: 13700,
  totalTransactions: 3,

  totalCourses: 3,
  totalActiveCourses: 0,

  runningCourses: 0,
  upcomingCourses: 0,
  completedCourses: 3,

  totalEnrollments: 4,
  completedEnrollments: 3,

  totalTeachers: 2,
  totalStudents: 11,

  totalClasses: 2,
  totalSubjects: 5,
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
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
            {sub && <p className={`text-xs font-medium ${c.sub} dark:opacity-90`}>{sub}</p>}
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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-xs min-w-18">
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
            {p.name.toLowerCase().includes("revenue") ? fmtBDT(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Pie custom label ──────────────────────────────────────────────────────────

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.08) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Course status badge ───────────────────────────────────────────────────────

function CourseBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-slate-400 text-xs">—</span>;
  const map: Record<string, string> = {
    RUNNING: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
    UPCOMING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    COMPLETED: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <Badge variant="outline" className={`text-[10px] px-2 py-0 ${map[status] ?? ""}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [granularity, setGranularity] = useState<"day" | "week" | "month" | "year">("month");

  const hasDateFilter = !!(startDate || endDate);

  const { data: res, isLoading } = useGetAllAnalyticsQuery({
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    granularity,
  });

  console.log("All analytics data", res)

  const coursesWithRevenue = res?.data?.revenue?.courseRevenue?.courses;


  // ── Derived ──
  const stats: DashboardStats | null = res?.data?.stats ?? statsDemo;
  const chartData: ChartPoint[] = res?.data?.charts?.dashboard?.chartData ?? [];
  const topCourses: TopCourse[] = useMemo(
    () => res?.data?.charts?.enrollmentStudent?.topCoursesByEnrollment ?? [],
    [res]
  );

  // Build pie data from topCourses enrollments
  const pieData = useMemo(
    () => topCourses.slice(0, 5).map((c) => ({
      name: c.courseTitle.length > 22 ? c.courseTitle.slice(0, 20) + "…" : c.courseTitle,
      value: c.totalEnrollments,
    })),
    [topCourses]
  );

  const enrichedCourses = topCourses.map((course) => {
    const matched = coursesWithRevenue.find(
      (c: any) => c._id === course.courseId
    );

    return {
      ...course,
      totalRevenue: matched?.totalRevenue ?? 0,
    };
  });

  const clearDates = () => { setStartDate(""); setEndDate(""); };

  // ── Tick formatter (needs granularity in scope) ──
  const tickFmt = (v: string) => formatPeriod(v, granularity);

  // ── Stat cards ──
  const statCards = stats ? [
    { label: "Total Revenue", value: fmtBDT(stats.totalRevenue), sub: `${stats.totalTransactions} transactions`, icon: CircleDollarSign, color: "indigo" as ColorKey },
    { label: "Completed Courses", value: stats.completedCourses, sub: `of ${stats.totalCourses} total`, icon: CheckCircle2, color: "emerald" as ColorKey },
    { label: "Running Courses", value: stats.runningCourses, sub: `${stats.totalActiveCourses} active total`, icon: PlayCircle, color: "sky" as ColorKey },
    { label: "Upcoming Courses", value: stats.upcomingCourses, sub: `Scheduled to start`, icon: Clock, color: "amber" as ColorKey },
    { label: "Total Students", value: stats.totalStudents, sub: `Registered on platform`, icon: Users, color: "rose" as ColorKey },
    { label: "Total Teachers", value: stats.totalTeachers, sub: `${stats.totalClasses} classes held`, icon: GraduationCap, color: "violet" as ColorKey },
    { label: "Total Classes", value: stats.totalClasses, sub: `Completed zoom sessions`, icon: CalendarDays, color: "teal" as ColorKey },
    { label: "Total Subjects", value: stats.totalSubjects, sub: `Across all courses`, icon: LayoutGrid, color: "orange" as ColorKey },
  ] : [];

  return (
    <div className="space-y-6">

      {/* ── Header + Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Platform performance summary</p>
        </div>

        {/* Date filter — same pattern as TeacherManagement */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">From</span>
          <Input
            type="date" className="h-9 w-40 text-sm"
            value={startDate} onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">to</span>
          <Input
            type="date" className="h-9 w-40 text-sm"
            value={endDate} onChange={(e) => setEndDate(e.target.value)}
          />
          {hasDateFilter && (
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0"
              onClick={clearDates} title="Clear date filter">
              <X className="w-4 h-4" />
            </Button>
          )}
          <Select value={granularity} onValueChange={(v) => setGranularity(v as any)}>
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── 8 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((c) => <StatCard key={c.label} {...c} />)
        }
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue + Enrollment area chart — 2 cols */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-0 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Revenue & Enrollment Trend
              </CardTitle>
              <Badge variant="outline" className="text-[11px] capitalize">{granularity}</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-56 rounded-lg" />
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-sm text-slate-400">
                No data for selected period
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gEnr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="period" tickFormatter={tickFmt}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      yAxisId="rev" orientation="left"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      yAxisId="enr" orientation="right"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false} tickLine={false} allowDecimals={false}
                    />
                    <Tooltip content={(p) => <ChartTooltip {...p} granularity={granularity} />} />
                    <Area
                      yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue"
                      stroke="#6366f1" strokeWidth={2} fill="url(#gRev)"
                      dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5 }}
                    />
                    <Area
                      yAxisId="enr" type="monotone" dataKey="totalEnrollments" name="Enrollments"
                      stroke="#10b981" strokeWidth={2} fill="url(#gEnr)"
                      dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-5 mt-2 px-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-0.5 rounded-full bg-indigo-500 inline-block" />
                    Revenue (left axis)
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-0.5 rounded-full bg-emerald-500 inline-block" />
                    Enrollments (right axis)
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* New Students bar — 1 col */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-0 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              New Students
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-56 rounded-lg" />
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-56 text-sm text-slate-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={244}>
                <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="period" tickFormatter={tickFmt}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false} tickLine={false} allowDecimals={false}
                  />
                  <Tooltip content={(p) => <ChartTooltip {...p} granularity={granularity} />} />
                  <Bar dataKey="newStudents" name="New Students" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Popular Courses: table + pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Table — 3 cols */}
        <Card className="lg:col-span-3 border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-3 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Popular Courses by Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-4">
            {isLoading ? (
              <div className="px-5 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : topCourses.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center px-5">No course data</p>
            ) : (
              <>
                {/* Header row */}
                <div className="grid grid-cols-[1.5rem_1fr_4rem_5rem] gap-3 px-5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">#</span>
                  <span className="text-[11px] text-slate-400">Course Title</span>
                  <span className="text-[11px] text-slate-400 text-right">Enrolled</span>
                  <span className="text-[11px] text-slate-400 text-right">Revenue</span>
                  {/* <span className="text-[11px] text-slate-400 text-right">Status</span> */}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topCourses.slice(0, 5).map((course, idx) => (
                    <div
                      key={course.courseId}
                      className="grid grid-cols-[1.5rem_1fr_4rem_5rem] gap-3 px-5 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-400">{idx + 1}</span>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                          {course.courseTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {course.completedCount}/{course.totalEnrollments} completed
                          {" · "}
                          <span className={
                            course.completionRate === 100 ? "text-emerald-600" :
                              course.completionRate >= 50 ? "text-amber-600" : "text-rose-500"
                          }>
                            {course.completionRate}%
                          </span>
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-right">
                        {course.totalEnrollments}
                      </span>

                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 text-right">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 text-right">
                          {fmtBDT(
                            coursesWithRevenue.find(
                              (c:any) => c.courseId === course.courseId
                            )?.totalRevenue ?? 0
                          )}
                        </span>
                      </span>

                      {/* <div className="flex justify-end">
                        <CourseBadge status={course.status} />
                      </div> */}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pie chart — 2 cols */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-none bg-white dark:bg-slate-900">
          <CardHeader className="pt-5 pb-0 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Enrollment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-5 pt-2">
            {isLoading ? (
              <Skeleton className="w-full h-48 rounded-lg mt-2" />
            ) : pieData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-slate-400">No data</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      outerRadius={82}
                      dataKey="value"
                      labelLine={false}
                      label={renderPieLabel}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any, n: any) => [v, n]}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom legend */}
                <div className="mt-3 space-y-2">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 ml-2 shrink-0">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}