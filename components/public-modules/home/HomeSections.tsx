"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
  ArrowRight, ChevronLeft, ChevronRight,
  Clock, CalendarDays, BadgeCheck, Star,
  GraduationCap, BookOpen, Award,
} from "lucide-react";
import { useGetAllTeachersQuery } from "@/redux/features/user/user.api";
import { SectionEyebrow } from "./SectionHeader";


// ─── Teacher Card ─────────────────────────────────────────────────────────────

function TeacherCard({ teacher }: { teacher: any }) {
  return (
    <div className="group relative flex flex-col items-center text-center p-6 rounded-2xl
      border border-slate-200 dark:border-white/8
      bg-white dark:bg-linear-to-b dark:from-[#131f34] dark:to-[#0f1928]
      shadow-sm hover:shadow-lg dark:hover:shadow-[0_16px_48px_rgba(34,197,94,0.12)]
      hover:border-emerald-400/60 dark:hover:border-emerald-500/35
      transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Radial glow dark only */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:bg-[radial-gradient(ellipse_at_30%_0%,rgba(34,197,94,0.07),transparent_65%)] pointer-events-none" />

      {/* Avatar */}
      <div className="relative mb-5">
        <div className="absolute -inset-1 rounded-full bg-linear-to-br from-emerald-500/30 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-emerald-400 dark:group-hover:ring-emerald-500/50 transition-all duration-300">
          {teacher?.picture ? (
            <img src={teacher.picture} alt={teacher.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-2xl">
              {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
            </div>
          )}
        </div>
        {teacher?.isActive && (
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131f34] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        )}
      </div>

      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-1">
        {teacher?.name ?? "Unknown"}
      </h3>
      <p className="text-[11px] text-slate-500 mb-5 leading-tight">
        {teacher?.designation ?? "Subject Teacher"}
      </p>

      {/* Stats box */}
      <div className="flex items-stretch gap-0 w-full rounded-xl overflow-hidden border border-slate-100 dark:border-white/6 bg-slate-50 dark:bg-white/3">
        {teacher?.experience > 0 && (
          <div className="flex flex-col items-center justify-center py-3 flex-1 border-r border-slate-100 dark:border-white/6">
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 leading-tight">{teacher.experience}+</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-600 uppercase tracking-wide mt-0.5">Yrs Exp</span>
          </div>
        )}
        {teacher?.qualification && (
          <div className="flex flex-col items-center justify-center py-3 flex-1 px-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-[9px] text-slate-400 dark:text-slate-600 uppercase tracking-wide leading-tight text-center line-clamp-1">
              {teacher.qualification}
            </span>
          </div>
        )}
        {!teacher?.experience && !teacher?.qualification && (
          <div className="flex items-center justify-center py-3 flex-1">
            <GraduationCap className="w-4 h-4 text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Responsive slide width ───────────────────────────────────────────────────

function useSlideWidth() {
  const [width, setWidth] = React.useState("25%");
  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640)       setWidth("90%");
      else if (w < 768)  setWidth("50%");
      else if (w < 1024) setWidth("33.333%");
      else               setWidth("25%");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

function TeacherSlide({ teacher }: { teacher: any }) {
  const slideWidth = useSlideWidth();
  return (
    <div style={{ flex: `0 0 ${slideWidth}`, minWidth: 0, padding: "0 10px" }}>
      <TeacherCard teacher={teacher} />
    </div>
  );
}

// ─── Our Teachers Section ─────────────────────────────────────────────────────

export function OurTeachersSection() {
  const { data, isLoading } = useGetAllTeachersQuery({ limit: 20, page: 1 });
  const teachers = data?.data ?? [];

  const autoplay = React.useRef(
    Autoplay({ delay: 3200, stopOnInteraction: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [autoplay.current]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white dark:bg-[#0d1626] py-20 relative transition-colors">
      {/* bg glow dark only */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-70 dark:bg-emerald-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="container mx-auto px-4 mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <SectionEyebrow label="আমাদের শিক্ষকবৃন্দ" />
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              অভিজ্ঞ ও দক্ষ{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                শিক্ষকমণ্ডলী
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-md leading-relaxed">
              প্রতিটি বিষয়ে সেরা শিক্ষকের কাছ থেকে শিখুন
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-white/4
                text-slate-500 dark:text-slate-400
                hover:bg-emerald-50 dark:hover:bg-emerald-500/20
                hover:border-emerald-400 dark:hover:border-emerald-500/40
                hover:text-emerald-600 dark:hover:text-emerald-400
                shadow-sm
                transition-all flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-white/4
                text-slate-500 dark:text-slate-400
                hover:bg-emerald-50 dark:hover:bg-emerald-500/20
                hover:border-emerald-400 dark:hover:border-emerald-500/40
                hover:text-emerald-600 dark:hover:text-emerald-400
                shadow-sm
                transition-all flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      {isLoading ? (
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-slate-100 dark:bg-[#131f34] border border-slate-200 dark:border-white/[0.07] h-56 animate-pulse" />
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>কোনো শিক্ষক পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto relative">
          {/* Fade edges */}
          <div className="absolute top-0 left-0 w-10 h-full bg-linear-to-r from-white dark:from-[#0d1626] to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-10 h-full bg-linear-to-l from-white dark:from-[#0d1626] to-transparent pointer-events-none z-10" />

          <div className="overflow-hidden px-4" ref={emblaRef}>
            <div className="flex">
              {teachers.map((teacher: any) => (
                <TeacherSlide key={teacher._id} teacher={teacher} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
