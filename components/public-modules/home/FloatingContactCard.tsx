"use client";

import { MessageCircle, Phone } from "lucide-react";

interface FloatingContactCardProps {
  type: "whatsapp" | "call";
}

export function FloatingContactCard({ type }: FloatingContactCardProps) {
  if (type === "whatsapp") {
    return (
      <a
        href="https://wa.me/8801818788816"
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-3
          rounded-2xl border border-[#0E8F3B]/30
          bg-white/90 backdrop-blur-sm
          px-4 py-3
          shadow-lg shadow-black/10
          hover:shadow-xl transition-shadow duration-200
          cursor-pointer
        "
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]">
          <MessageCircle className="h-5 w-5 text-white fill-white" />
        </div>
        <div style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          <p className="text-[11px] font-semibold text-gray-500">হোয়াটসঅ্যাপ</p>
          <p className="text-[13px] font-bold text-gray-800">01818788816</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href="tel:01818788816"
      className="
        flex flex-col items-start
        rounded-2xl
        bg-red-500
        px-4 py-3
        shadow-lg shadow-red-500/30
        hover:bg-red-600 transition-colors duration-200
        cursor-pointer
      "
    >
      <div className="flex items-center gap-2 mb-0.5">
        <Phone className="h-4 w-4 text-white" />
        <p
          className="text-[11px] font-semibold text-white/80"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          কল করুন
        </p>
      </div>
      <p className="text-[15px] font-extrabold text-white tracking-wide">
        01818788816
      </p>
      <p
        className="text-[10px] font-medium text-white/80 mt-0.5"
        style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
      >
        সকাল ৮ টা - রাত ১০ টা
      </p>
    </a>
  );
}