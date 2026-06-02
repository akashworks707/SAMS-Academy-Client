
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Video, Radio, ClipboardList, FileText, BookOpen } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useGetSingleCourseQuery } from "@/redux/features/course/course.api";
import { useUser } from "@/context/UserContext";
import { Role } from "@/types";
import { ISubjectResolved } from "@/types/course-view.types";
import { RecordedClassesTab } from "@/components/course-view/RecordedClassesTab";
import { LiveClassesTab } from "@/components/course-view/LiveClassesTab";
import { AssignmentTab, QuizTab } from "@/components/course-view/PlaceholderTabs";


// ─── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "recorded",    label: "Recorded Classes", icon: Video },
  { key: "live",        label: "Live Classes",      icon: Radio },
  { key: "quiz",        label: "Quiz",              icon: ClipboardList },
  { key: "assignment",  label: "Assignment",        icon: FileText },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ViewCoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useUser();
  const isAdmin = user?.role === Role.ADMIN;

  const [activeTab, setActiveTab] = useState<TabKey>("recorded");

  // ── Fetch course ─────────────────────────────────────────────────────────
  const { data: courseResponse, isLoading: courseLoading } = useGetSingleCourseQuery(slug);
  const course = (courseResponse as any)?.data?.result ?? courseResponse;

  // ── Resolve subjects (populated objects from API) ─────────────────────────
  const subjects = useMemo<ISubjectResolved[]>(() => {
    if (!course?.assignSubWithTeacher) return [];
    const seen = new Set<string>();
    const result: ISubjectResolved[] = [];
    for (const entry of course.assignSubWithTeacher) {
      const sub = entry.subject;
      if (typeof sub === "object" && sub?._id) {
        if (!seen.has(sub._id)) {
          seen.add(sub._id);
          result.push({ _id: sub._id, title: sub.title ?? sub._id });
        }
      } else if (typeof sub === "string" && !seen.has(sub)) {
        seen.add(sub);
        result.push({ _id: sub, title: sub });
      }
    }
    return result;
  }, [course]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Course Title Header ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-4 sticky top-0 z-20 shadow-sm">
        {courseLoading ? (
          <Skeleton className="h-7 w-64" />
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate max-w-[55vw]">
                {course?.title ?? "Course"}
              </h1>
            </div>
            {course?.batch && (
              <Badge variant="outline" className="text-[11px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                {course.batch}
              </Badge>
            )}
            {course?.status && (
              <Badge variant="outline" className={`text-[11px] ${
                course.status === "running"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : course.status === "upcoming"
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-15 z-10">
        <div className="px-4 md:px-6 overflow-x-auto">
          <div className="flex min-w-max">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 py-5">
        {activeTab === "recorded" && (
          <RecordedClassesTab
            courseId={course?._id ?? ""}
            subjects={subjects}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "live" && (
          <LiveClassesTab
            courseId={course?._id ?? ""}
            subjects={subjects}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === "quiz" && <QuizTab />}
        {activeTab === "assignment" && <AssignmentTab />}
      </div>
    </div>
  );
}