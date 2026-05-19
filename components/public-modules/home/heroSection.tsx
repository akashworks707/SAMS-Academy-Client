"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownLeft, MessageCircle } from "lucide-react";
import { FloatingContactCard } from "./FloatingContactCard";

function ConcentricCircles() {
  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none opacity-20 dark:opacity-10"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((r) => (
        <circle
          key={r}
          cx="600"
          cy="600"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-green-600 dark:text-emerald-400"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function PaperPlane() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md"
    >
      {/* plane body */}
      <path d="M8 40 L72 8 L56 72 L38 50 Z" fill="#0E8F3B" opacity="0.9" />
      <path d="M38 50 L32 60 L28 72 L56 72 Z" fill="#0B4F66" opacity="0.8" />
      {/* trail dots */}
      <circle cx="68" cy="24" r="2.5" fill="#0E8F3B" opacity="0.5" />
      <circle cx="62" cy="18" r="2" fill="#0E8F3B" opacity="0.35" />
      <circle cx="56" cy="13" r="1.5" fill="#0E8F3B" opacity="0.2" />
    </svg>
  );
}

function Squiggle() {
  return (
    <svg
      width="60"
      height="40"
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="opacity-60"
    >
      <path
        d="M4 30 Q14 10 24 20 Q34 30 44 15 Q54 0 60 10"
        stroke="#0E8F3B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section
      className="
    relative w-full overflow-hidden
    bg-linear-to-br
    from-[#e6f9ed] via-[#d4f5e0] to-[#c8f0d8]
    dark:from-slate-950
    dark:via-slate-900
    dark:to-slate-950
  "
    >
      <div className="mx-auto max-w-352 px-4 md:px-6">
        <ConcentricCircles />

        <div className="relative z-10 container mx-auto">
          {/* ── Badge ── */}
          <div className="flex justify-center pt-10 md:pt-12">
            <span
              className="
              inline-flex items-center rounded-full
              bg-[#0E8F3B] px-6 py-2
              text-sm font-semibold text-white
              shadow-md shadow-[#0E8F3B]/30
            "
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              নিজেকে গড়ুন, ভবিষ্যৎ জয় করুন
            </span>
          </div>

          <div className="mt-5 text-center">
            <h1
              className="text-5xl font-black leading-tight text-[#0E8F3B] md:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              সামস একাডেমি
            </h1>

            <p
              className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200 md:text-3xl"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              এর অভিজ্ঞতার সাথে
            </p>

            <div className="mt-3 flex items-center justify-center gap-3">
              <span
                className="text-5xl font-black text-[#0E8F3B] md:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                ফ্রি
              </span>
              <Link href="/free-class">
                <span
                  className="
                  inline-flex items-center rounded-xl
                  bg-[#0E8F3B] px-8 py-3
                  text-2xl font-bold text-white
                  shadow-lg shadow-[#0E8F3B]/40
                  hover:bg-[#0a7a32] transition-colors cursor-pointer
                  md:text-3xl md:px-10 md:py-4
                "
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  ক্লাস করুন
                </span>
              </Link>
            </div>
          </div>

          <div className="relative mt-4 flex items-end justify-center">
            <div
              className="
              absolute left-0 bottom-32
              hidden md:flex flex-col items-center gap-3
              z-20
            "
            >
              <div className="flex items-center justify-center">
                <div
                  className="
                  flex h-14 w-14 items-center justify-center
                  rounded-full border-2 border-[#0E8F3B]
                  text-[#0E8F3B]
                "
                >
                  <ArrowDownLeft className="h-6 w-6" strokeWidth={2.5} />
                </div>
              </div>
              <p
                className="text-center text-sm font-semibold dark:text-gray-200 text-gray-700"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                রেজিস্ট্রেশন করতে
              </p>
              <Link href="/signup">
                <button
                  className="
                  rounded-xl bg-[#0E8F3B]
                  px-7 py-2.5
                  text-sm font-bold text-white
                  shadow-md shadow-[#0E8F3B]/30
                  hover:bg-[#0a7a32] transition-colors
                "
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  ক্লিক করুন
                </button>
              </Link>
            </div>

            <div className="relative w-full max-w-5xl mx-auto">
              <div
                className="
                relative mx-auto
                w-[90%] md:w-[80%]
              "
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src="/sams-academy.png"
                  alt="SAMS Academy Teachers"
                  fill
                  className="object-contain object-bottom drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            <div className="absolute right-4 top-8 hidden md:block z-20">
              <PaperPlane />
            </div>
          </div>

          <div className="absolute bottom-16 left-10 hidden md:block">
            <Squiggle />
          </div>
        </div>

        <div className="absolute bottom-6 left-4 z-20 md:left-8">
          <FloatingContactCard type="whatsapp" />
        </div>

        <div className="absolute bottom-6 right-4 z-20 flex flex-col items-end gap-3 md:right-8">
          <FloatingContactCard type="call" />

          <a
            href="https://wa.me/8801818788816"
            target="_blank"
            rel="noopener noreferrer"
            className="
            flex h-12 w-12 items-center justify-center
            rounded-full bg-[#25D366]
            shadow-lg shadow-green-500/40
            hover:bg-[#1fb555] transition-colors
          "
          >
            <MessageCircle className="h-6 w-6 text-white fill-white" />
          </a>
        </div>
      </div>
    </section>
  );
}
