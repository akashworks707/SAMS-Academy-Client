"use client";

import { ClipboardList, FileText } from "lucide-react";

function ComingSoonPlaceholder({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
      <Icon className="w-14 h-14 mb-4 opacity-30" />
      <p className="text-base font-semibold">{label}</p>
      <p className="text-sm mt-1 opacity-60">Coming soon</p>
    </div>
  );
}

export function QuizTab() {
  return <ComingSoonPlaceholder icon={ClipboardList} label="Quiz" />;
}

export function AssignmentTab() {
  return <ComingSoonPlaceholder icon={FileText} label="Assignment" />;
}