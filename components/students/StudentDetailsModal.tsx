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
  CalendarDays,
  Hash,
  BookOpen,
  Users,
  MapPin,
  ShieldCheck,
  ShieldOff,
  IdCard,
} from "lucide-react";

// ─── Helper ───────────────────────────────────────────────────────────────────

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
        <p className="text-sm text-slate-800 dark:text-slate-200 break-words">
          {value !== undefined && value !== null && value !== "" ? value : (
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface StudentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StudentDetailsModal({
  open,
  onOpenChange,
  item,
}: StudentDetailsModalProps) {
  if (!item) return null;

  const address = item.address;
  const addressParts = [
    address?.union,
    address?.thana,
    address?.district,
    address?.division,
  ].filter(Boolean);

  const dob = item.dateOfBirth
    ? new Date(item.dateOfBirth).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  const createdAt = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">

        {/* ─── Header with Avatar ─── */}
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 pt-8 pb-6 rounded-t-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Detailed information for {item.name}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Avatar */}
            {item?.picture ? (
              <img
                src={item.picture}
                alt={item.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white dark:border-slate-800 shadow-md shrink-0">
                {item?.name?.charAt(0)?.toUpperCase() ?? "S"}
              </div>
            )}

            {/* Name + ID + Status */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                {item?.name ?? "—"}
              </h2>
              {item?.studentId && (
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {item.studentId}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge
                  variant="outline"
                  className={
                    item?.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }
                >
                  {item?.isActive ? (
                    <><ShieldCheck className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><ShieldOff className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                </Badge>
                <Badge variant="secondary">Student</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="px-6 py-5 space-y-6">

          {/* Personal */}
          <div>
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Mail} label="Email" value={item?.email} />
              <Field icon={Phone} label="Phone" value={item?.phone} />
              <Field icon={CalendarDays} label="Date of Birth" value={dob} />
              <Field icon={IdCard} label="Student ID" value={item?.studentId} />
            </div>
          </div>

          <Separator />

          {/* Academic */}
          <div>
            <SectionTitle>Academic Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Hash} label="Roll Number" value={item?.roll} />
              <Field icon={BookOpen} label="Section" value={item?.section} />
            </div>
          </div>

          <Separator />

          {/* Guardian */}
          <div>
            <SectionTitle>Guardian Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Users} label="Guardian Name" value={item?.guardianName} />
              <Field icon={Phone} label="Guardian Phone" value={item?.guardianPhone} />
            </div>
          </div>

          {/* Address — only if any value exists */}
          {addressParts.length > 0 && (
            <>
              <Separator />
              <div>
                <SectionTitle>Address</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field icon={MapPin} label="Division" value={address?.division} />
                  <Field icon={MapPin} label="District" value={address?.district} />
                  <Field icon={MapPin} label="Thana" value={address?.thana} />
                  <Field icon={MapPin} label="Union / Ward" value={address?.union} />
                </div>
                {addressParts.length > 0 && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Full Address:</span>{" "}
                    {addressParts.join(", ")}
                  </p>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Meta */}
          <div>
            <SectionTitle>Account Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={User} label="Role" value={item?.role} />
              <Field icon={CalendarDays} label="Joined" value={createdAt} />
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}