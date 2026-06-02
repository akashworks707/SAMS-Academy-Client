// ─── Shared Types ──────────────────────────────────────────────────────────────

export interface IRecordedVideo {
  _id: string;
  course: string;
  subject: string;
  title: string;
  description?: string;
  videoUrl: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILiveClass {
  _id: string;
  courseId: string;
  subjectId: string;
  classTitle: string;
  topic?: string;
  meetingId?: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  startTime: string;
  duration: number;
  timezone?: string;
  password?: string;
  joinUrl?: string;
  startUrl?: string;
  hostId?: string;
  hostEmail?: string;
  createdAt: string;
}

export interface ISubjectResolved {
  _id: string;
  title: string;
}

// ─── Live Status Config ────────────────────────────────────────────────────────

export const liveStatusConfig: Record<string, { label: string; color: string; dot: string }> = {
  SCHEDULED: {
    label: "Scheduled",
    dot: "bg-blue-500",
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  LIVE: {
    label: "Live Now",
    dot: "bg-emerald-500 animate-pulse",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  COMPLETED: {
    label: "Ended",
    dot: "bg-slate-400",
    color: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-red-400",
    color: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

export const statusLabel: Record<string, string> = {
  SCHEDULED: "Scheduled",
  LIVE: "Live Now",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}