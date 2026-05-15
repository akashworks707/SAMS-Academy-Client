/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

import {
  Star,
  Users,
  BookOpen,
  Award,
  Play,
  Quote,
  GraduationCap,
  Flame,
  MessageCircle,
  Pen,
  Moon,
  Sun,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Types ───────────────────────────────────────────────
interface Teacher {
  id: string;
  name: string;
  title: string;
  subject: string;
  experience: string;
  students: number;
  rating: number;
  videos: number;
  education: string;
  quote: string;
  tags: string[];
  avatar: string;
  avatarBg: string;
  accent: string;
  badge?: string;
}

// ── Data ────────────────────────────────────────────────
const TEACHERS: Teacher[] = [
  {
    id: "1",
    name: "আব্দুর রহমান",
    title: "Senior Math Faculty",
    subject: "Mathematics",
    experience: "12 yrs",
    students: 18400,
    rating: 4.9,
    videos: 320,
    education: "BUET, MSc Applied Math",
    quote:
      "Math is not about numbers, it's about understanding patterns in nature.",
    tags: ["Algebra", "Calculus", "SSC", "HSC"],
    avatar: "আর",
    avatarBg: "from-sky-500 to-cyan-600",
    accent: "sky",
    badge: "⭐ Top Rated",
  },
  {
    id: "2",
    name: "ফারহানা আক্তার",
    title: "Lead Physics Teacher",
    subject: "Physics",
    experience: "9 yrs",
    students: 14200,
    rating: 5.0,
    videos: 275,
    education: "DU, BSc Physics",
    quote:
      "Every student who understands physics sees the universe differently.",
    tags: ["Mechanics", "Optics", "HSC"],
    avatar: "ফা",
    avatarBg: "from-violet-500 to-purple-600",
    accent: "violet",
    badge: "🏆 Best Teacher",
  },
  {
    id: "3",
    name: "নাফিসা ইসলাম",
    title: "English Language Coach",
    subject: "English",
    experience: "8 yrs",
    students: 22000,
    rating: 4.9,
    videos: 310,
    education: "IBA, Dhaka University",
    quote:
      "Fluent English opens every door — and I'll hand you the keys.",
    tags: ["Grammar", "Writing", "Speaking"],
    avatar: "না",
    avatarBg: "from-amber-500 to-orange-500",
    accent: "amber",
    badge: "🔥 Popular",
  },
];

const SUBJECTS = ["All", "Mathematics", "Physics", "English"];

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

// ── Helpers ─────────────────────────────────────────────
function TeacherAvatar({
  avatar,
  avatarBg,
}: {
  avatar: string;
  avatarBg: string;
}) {
  return (
    <div
      className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ${avatarBg} shadow-lg`}
    >
      <span
        className="text-2xl font-black text-white"
        style={{ fontFamily: "'Noto Serif Bengali', serif" }}
      >
        {avatar}
      </span>

      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-emerald-400" />
    </div>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <Icon className="h-4 w-4 text-amber-400" />

        <span className="text-sm font-bold text-foreground">
          {value}
        </span>
      </div>

      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ── Card ────────────────────────────────────────────────
function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border-border/50
        bg-card/70
        backdrop-blur
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-white/4 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="relative p-6">
        {/* Badge */}
        {teacher.badge && (
          <Badge className="absolute right-5 top-5 border-border bg-muted text-foreground">
            {teacher.badge}
          </Badge>
        )}

        {/* Top */}
        <div className="mb-5 flex items-start gap-4">
          <TeacherAvatar
            avatar={teacher.avatar}
            avatarBg={teacher.avatarBg}
          />

          <div className="flex-1">
            <h3
              className="text-xl font-black text-foreground"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              {teacher.name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {teacher.title}
            </p>

            <Badge
              variant="outline"
              className="mt-3 border-border bg-muted/50 text-foreground"
            >
              <BookOpen className="mr-1 h-3 w-3" />
              {teacher.subject}
            </Badge>
          </div>
        </div>

        {/* Quote */}
        <div className="mb-5 rounded-xl border border-border bg-muted/30 p-4">
          <Quote className="mb-2 h-4 w-4 text-muted-foreground" />

          <p className="text-sm italic leading-relaxed text-muted-foreground">
            {teacher.quote}
          </p>
        </div>

        {/* Education */}
        <div className="mb-5 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm text-muted-foreground">
            {teacher.education}
          </span>
        </div>

        {/* Tags */}
        <div className="mb-5 flex flex-wrap gap-2">
          {teacher.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-muted text-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-4 gap-2 rounded-2xl border border-border bg-muted/20 p-4">
          <StatItem
            icon={Users}
            value={`${(teacher.students / 1000).toFixed(0)}k`}
            label="Students"
          />

          <StatItem
            icon={Star}
            value={`${teacher.rating}`}
            label="Rating"
          />

          <StatItem
            icon={Play}
            value={`${teacher.videos}`}
            label="Videos"
          />

          <StatItem
            icon={Award}
            value={teacher.experience}
            label="Exp"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-linear-to-r from-amber-500 to-orange-500 text-white hover:opacity-90">
            <Play className="mr-2 h-4 w-4" />
            Watch Class
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="border-border bg-background"
          >
            <Pen className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="border-border bg-background"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main ────────────────────────────────────────────────
export default function TeachersSection() {
  const [activeSubject, setActiveSubject] = useState("All");

  const filteredTeachers = TEACHERS.filter((teacher) =>
    activeSubject === "All"
      ? true
      : teacher.subject === activeSubject
  );

  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 transition-colors duration-500">
      {/* BG */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2">
            <Flame className="h-4 w-4 text-orange-400" />

            <span className="text-sm font-semibold text-muted-foreground">
              Learn from Bangladesh&apos;s Finest
            </span>
          </div>

          <h2 className="text-5xl font-black leading-tight text-foreground md:text-6xl">
            Meet Your{" "}
            <span className="bg-linear-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
              Teachers
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Experienced educators from top Bangladeshi universities.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {SUBJECTS.map((subject) => (
            <Button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              variant={
                activeSubject === subject ? "default" : "outline"
              }
              className={
                activeSubject === subject
                  ? "bg-linear-to-r from-amber-500 to-orange-500 text-white"
                  : ""
              }
            >
              {subject}
            </Button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
            />
          ))}
        </div>
      </div>
    </section>
  );
}