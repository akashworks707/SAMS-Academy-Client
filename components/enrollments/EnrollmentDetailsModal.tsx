"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Hash,
  CalendarDays,
  CreditCard,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ShieldOff,
  Banknote,
  Clock,
  Tag,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{label}</p>
        <p className="text-sm text-slate-800 dark:text-slate-200 break-wwrap-break-word">
          {value !== undefined && value !== null && value !== "" ? (
            value
          ) : (
            <span className="text-slate-400 italic">Not provided</span>
          )}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
      {children}
    </p>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    FAILED:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
    CANCELLED:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
  };
  const dot: Record<string, string> = {
    COMPLETED: "bg-emerald-500",
    PENDING: "bg-amber-500",
    FAILED: "bg-red-500",
    CANCELLED: "bg-slate-400",
  };
  return (
    <Badge variant="outline" className={map[status] ?? ""}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${dot[status] ?? "bg-slate-400"}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Progress</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface EnrollmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EnrollmentDetailsModal({
  open,
  onOpenChange,
  item,
}: EnrollmentDetailsModalProps) {
  if (!item) return null;

  const student = item.student;
  const course = item.course;
  const address = student?.address;
  const addressParts = [
    address?.union,
    address?.thana,
    address?.district,
    address?.division,
  ].filter(Boolean);

  const fmt = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">

        {/* ─── Header ─── */}
        <div className="relative bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 pt-8 pb-6 rounded-t-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>
              Enrollment details for {student?.name} in {course?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Student avatar */}
            <div className="shrink-0">
              {student?.picture ? (
                <img
                  src={student.picture}
                  alt={student.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white dark:border-slate-800 shadow-md">
                  {student?.name?.charAt(0)?.toUpperCase() ?? "S"}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                {student?.name ?? "—"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                {student?.studentId ?? student?.email ?? "—"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <StatusBadge status={item.status} />
                {item.isActive ? (
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    <ShieldOff className="w-3 h-3 mr-1" /> Inactive
                  </Badge>
                )}
              </div>
            </div>

            {/* Course thumbnail */}
            {course?.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-24 h-16 rounded-lg object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0 hidden sm:block"
              />
            )}
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="px-6 py-5 space-y-6">

          {/* Progress */}
          <ProgressBar value={item.progress ?? 0} />

          <Separator />

          {/* Enrollment Info */}
          <div>
            <SectionTitle>Enrollment Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={CreditCard} label="Transaction ID" value={item.transactionId} />
              <Field icon={CalendarDays} label="Enrolled At" value={fmt(item.createdAt)} />
              <Field icon={CalendarDays} label="Last Updated" value={fmt(item.updatedAt)} />
              <Field
                icon={TrendingUp}
                label="Progress"
                value={`${item.progress ?? 0}%`}
              />
            </div>
          </div>

          <Separator />

          {/* Course Info */}
          <div>
            <SectionTitle>Course Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={BookOpen} label="Course Title" value={course?.title} />
              <Field icon={Tag} label="Batch" value={course?.batch} />
              <Field icon={Hash} label="Total Classes" value={course?.totalClasses} />
              <Field icon={Clock} label="Duration" value={course?.duration} />
              <Field
                icon={Banknote}
                label="Regular Price"
                value={course?.regularPrice ? `৳ ${course.regularPrice.toLocaleString()}` : null}
              />
              <Field
                icon={Banknote}
                label="Discount Price"
                value={course?.discountPrice ? `৳ ${course.discountPrice.toLocaleString()}` : null}
              />
              <Field icon={CalendarDays} label="Course Start" value={fmt(course?.courseStartDate)} />
              <Field icon={CalendarDays} label="Course End" value={fmt(course?.courseEndDate)} />
            </div>
          </div>

          <Separator />

          {/* Student Info */}
          <div>
            <SectionTitle>Student Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={User} label="Full Name" value={student?.name} />
              <Field icon={Mail} label="Email" value={student?.email} />
              <Field icon={Phone} label="Phone" value={student?.phone} />
              <Field icon={Hash} label="Student ID" value={student?.studentId} />
              <Field icon={BookOpen} label="Section" value={student?.section} />
              <Field icon={Hash} label="Roll" value={student?.roll} />
              <Field icon={User} label="Guardian Name" value={student?.guardianName} />
              <Field icon={Phone} label="Guardian Phone" value={student?.guardianPhone} />
            </div>
          </div>

          {/* Address */}
          {addressParts.length > 0 && (
            <>
              <Separator />
              <div>
                <SectionTitle>Student Address</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field icon={MapPin} label="Division" value={address?.division} />
                  <Field icon={MapPin} label="District" value={address?.district} />
                  <Field icon={MapPin} label="Thana" value={address?.thana} />
                  <Field icon={MapPin} label="Union / Ward" value={address?.union} />
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">Full Address:</span>{" "}
                  {addressParts.join(", ")}
                </p>
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}