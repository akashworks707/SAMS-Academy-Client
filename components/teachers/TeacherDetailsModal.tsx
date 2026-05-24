"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Phone, Mail, MapPin, Briefcase, BookOpen, Banknote, CalendarDays } from "lucide-react";

interface TeacherDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-start gap-4 py-2">
      <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 shrink-0 w-36">{label}</span>
      <span className="text-sm text-slate-700 dark:text-slate-300 text-right">{value}</span>
    </div>
  );
}

export function TeacherDetailsModal({ open, onOpenChange, item }: TeacherDetailsModalProps) {
  if (!item) return null;

  // const user = item.userId;
  const address = item.address;
  const hasAddress = address && Object.values(address).some(Boolean);

  const dob = item.dateOfBirth
    ? new Date(item.dateOfBirth).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase text-center">
            শিক্ষকের বিবরণ
          </DialogTitle>
        </DialogHeader>

        <Separator />

        {/* Profile top */}
        <div className="flex flex-col items-center gap-3 py-4">
          {item?.picture ? (
            <img src={item?.picture} alt={item?.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-3xl">
              {item?.name?.charAt(0)?.toUpperCase() ?? "T"}
            </div>
          )}
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item?.name ?? "—"}</h3>
            <p className="text-sm text-slate-500">{item.designation ?? "শিক্ষক"}</p>
          </div>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-emerald-500" />
            সক্রিয়
          </Badge>
        </div>

        <Separator />

        {/* যোগাযোগ */}
        <div className="py-2">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-2">
            <Phone className="w-3.5 h-3.5" /> যোগাযোগ
          </p>
          <DetailRow label="ইমেইল" value={item?.email} />
          <DetailRow label="মোবাইল" value={item?.phone} />
          {dob && <DetailRow label="জন্ম তারিখ" value={dob} />}
        </div>

        <Separator />

        {/* পেশাদার তথ্য */}
        <div className="py-2">
          <p className="text-xs font-bold tracking-widests uppercase text-slate-400 flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> পেশাদার তথ্য
          </p>
          <DetailRow label="যোগ্যতা" value={item.qualification} />
          <DetailRow label="পদবী" value={item.designation} />
          {item.experience > 0 && <DetailRow label="অভিজ্ঞতা" value={`${item.experience} বছর`} />}
          {item.salary > 0 && <DetailRow label="মাসিক বেতন" value={`৳ ${item.salary?.toLocaleString()}`} />}
          {item.perClassSalary > 0 && <DetailRow label="প্রতি ক্লাস" value={`৳ ${item.perClassSalary?.toLocaleString()}`} />}
        </div>

        {item.bio && (
          <>
            <Separator />
            <div className="py-2">
              <p className="text-xs font-bold tracking-widests uppercase text-slate-400 mb-2">জীবনী</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.bio}</p>
            </div>
          </>
        )}

        {hasAddress && (
          <>
            <Separator />
            <div className="py-2">
              <p className="text-xs font-bold tracking-widests uppercase text-slate-400 flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5" /> ঠিকানা
              </p>
              <DetailRow label="বিভাগ" value={address?.division} />
              <DetailRow label="জেলা" value={address?.district} />
              <DetailRow label="থানা" value={address?.thana} />
              <DetailRow label="ইউনিয়ন" value={address?.union} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}