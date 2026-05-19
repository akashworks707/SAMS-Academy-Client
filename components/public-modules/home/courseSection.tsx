"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import {
  BookOpen,
  FlaskConical,
  Calculator,
  Globe,
  Star,
  Users,
  Clock,
  ChevronRight,
  Zap,
  Trophy,
  ArrowRight,
  GraduationCap,
  Target,
  Flame,
  Moon,
  Sun,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Theme Toggle ────────────────────────────────────────
function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed right-6 top-6 z-50 rounded-full border-border bg-background/80 backdrop-blur"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />

      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-yellow-300" />
    </Button>
  );
}

// ── Types ───────────────────────────────────────────────
interface Course {
  id: string;
  grade: string;
  gradeLabel: string;
  tagline: string;
  subjects: string[];
  students: number;
  rating: number;
  hours: number;
  color: string;
  icon: React.ElementType;
  badge?: string;
  featured?: boolean;
}

// ── Data ────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: "c6",
    grade: "৬",
    gradeLabel: "Class 6",
    tagline: "Build your foundation strong",
    subjects: ["Bangla", "English", "Math", "Science"],
    students: 3200,
    rating: 4.8,
    hours: 180,
    color: "from-violet-500 to-purple-600",
    icon: BookOpen,
  },
  {
    id: "c7",
    grade: "৭",
    gradeLabel: "Class 7",
    tagline: "Explore deeper concepts",
    subjects: ["Bangla", "English", "Math", "Science"],
    students: 2900,
    rating: 4.7,
    hours: 200,
    color: "from-sky-500 to-cyan-600",
    icon: Globe,
  },
  {
    id: "c8",
    grade: "৮",
    gradeLabel: "Class 8",
    tagline: "Master core fundamentals",
    subjects: ["Bangla", "English", "Math", "Science"],
    students: 3100,
    rating: 4.9,
    hours: 220,
    color: "from-emerald-500 to-teal-600",
    icon: Calculator,
    badge: "Popular",
  },
];

// ── Filters ─────────────────────────────────────────────
const FILTERS = [
  "All Classes",
  "Junior (6–8)",
  "SSC (9–10)",
  "HSC (11–12)",
];

// ── Card ────────────────────────────────────────────────
function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border-border
        bg-card/70
        backdrop-blur
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      {/* Top Bar */}
      <div
        className={`absolute left-0 top-0 h-1 w-full bg-linear-to-r ${course.color}`}
      />

      {/* Glow */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${course.color} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.07]`}
      />

      <CardContent className="relative p-6">
        {/* Badge */}
        {course.badge && (
          <Badge className="absolute right-5 top-5 border-none bg-foreground text-background">
            {course.badge}
          </Badge>
        )}

        {/* Top */}
        <div className="mb-5 flex items-start gap-4">
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${course.color} shadow-lg`}
          >
            <span
              className="text-2xl font-black text-white"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {course.grade}
            </span>

            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
              <Icon className="h-3.5 w-3.5 text-foreground/80" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">
              {course.gradeLabel}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {course.tagline}
            </p>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-5 flex flex-wrap gap-2">
          {course.subjects.map((subject) => (
            <Badge
              key={subject}
              variant="secondary"
              className="bg-muted text-muted-foreground hover:bg-muted/80"
            >
              {subject}
            </Badge>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-5 h-px bg-border" />

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Users className="h-3 w-3 text-sky-400" />

              <span className="text-sm font-bold text-foreground">
                {(course.students / 1000).toFixed(1)}k
              </span>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Students
            </p>
          </div>

          <div className="border-x border-border text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />

              <span className="text-sm font-bold text-foreground">
                {course.rating}
              </span>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Rating
            </p>
          </div>

          <div className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-emerald-400" />

              <span className="text-sm font-bold text-foreground">
                {course.hours}h
              </span>
            </div>

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Content
            </p>
          </div>
        </div>

        {/* Button */}
        <Button
          className={`
            w-full
            bg-linear-to-r
            ${course.color}
            text-white
            hover:opacity-90
          `}
        >
          Enroll Now

          <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Main Section ────────────────────────────────────────
export default function CoursesSection() {
  const [activeFilter, setActiveFilter] =
    useState("All Classes");

  const filtered = COURSES.filter((c) => {
    if (activeFilter === "Junior (6–8)")
      return ["c6", "c7", "c8"].includes(c.id);

    return true;
  });

  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 transition-colors duration-500">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2">
            <Flame className="h-4 w-4 text-orange-400" />

            <span className="text-sm font-semibold text-muted-foreground">
              Classes 6 to 12 — All in One Place
            </span>
          </div>

          <h2 className="text-5xl font-black leading-tight text-foreground md:text-6xl">
            Choose Your{" "}
            <span className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Class
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Expert teachers, live classes & full board exam prep.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-400" />

              <span className="text-sm font-semibold text-muted-foreground">
                32,800+ Students
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />

              <span className="text-sm font-semibold text-muted-foreground">
                Live Classes Daily
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-400" />

              <span className="text-sm font-semibold text-muted-foreground">
                98% Pass Rate
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant={
                activeFilter === filter
                  ? "default"
                  : "outline"
              }
              className={
                activeFilter === filter
                  ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-5 rounded-3xl border border-border bg-card px-8 py-8 sm:flex-row">
            <div className="text-left">
              <h3 className="text-xl font-bold text-foreground">
                Not sure which class to pick?
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Talk to a counselor — free consultation.
              </p>
            </div>

            <Button className="bg-linear-to-r from-amber-500 to-orange-500 text-white hover:opacity-90">
              Free Counseling

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}