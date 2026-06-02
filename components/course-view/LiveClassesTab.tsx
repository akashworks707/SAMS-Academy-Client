"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Radio, Filter, Plus, Pencil, Trash2, Calendar,
  Timer, Users, ExternalLink, AlertTriangle,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import {
  useGetLiveClassesByCourseAndSubjectQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} from "@/redux/features/zoom/zoom.api";
import { formatDateTime, ILiveClass, ISubjectResolved, liveStatusConfig, statusLabel } from "@/types/course-view.types";


// ─── Form State ────────────────────────────────────────────────────────────────

type LiveFormState = {
  classTitle: string;
  topic: string;
  subjectId: string;
  startTime: string;
  duration: number;
  timezone: string;
  password: string;
  status: string;
};

// ─── Create / Edit Modal ───────────────────────────────────────────────────────

interface LiveClassModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  courseId: string;
  subjects: ISubjectResolved[];
  defaultSubjectId?: string;
  editClass?: ILiveClass | null;
  onSuccess: () => void;
}

function LiveClassModal({
  open, onOpenChange, courseId, subjects, defaultSubjectId, editClass, onSuccess,
}: LiveClassModalProps) {
  const isEdit = !!editClass;
  const [createLive, { isLoading: creating }] = useCreateMeetingMutation();
  const [updateLive, { isLoading: updating }] = useUpdateMeetingMutation();
  const isLoading = creating || updating;

  const [form, setForm] = useState<LiveFormState>({
    classTitle: "", topic: "",
    subjectId: defaultSubjectId ?? "",
    startTime: "", duration: 60,
    timezone: "Asia/Dhaka", password: "", status: "SCHEDULED",
  });

  useEffect(() => {
    if (!open) return;
    if (isEdit && editClass) {
      setForm({
        classTitle: editClass.classTitle,
        topic: editClass.topic ?? "",
        subjectId: editClass.subjectId,
        startTime: editClass.startTime ? new Date(editClass.startTime).toISOString().slice(0, 16) : "",
        duration: editClass.duration,
        timezone: editClass.timezone ?? "Asia/Dhaka",
        password: editClass.password ?? "",
        status: editClass.status,
      });
    } else {
      setForm({
        classTitle: "", topic: "",
        subjectId: defaultSubjectId ?? subjects[0]?._id ?? "",
        startTime: "", duration: 60,
        timezone: "Asia/Dhaka", password: "", status: "SCHEDULED",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classTitle.trim() || !form.subjectId || !form.startTime) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const payload = {
        courseId, subjectId: form.subjectId,
        classTitle: form.classTitle, topic: form.topic,
        startTime: new Date(form.startTime).toISOString(),
        duration: Number(form.duration),
        timezone: form.timezone,
        status: form.status as ILiveClass["status"],
        ...(form.password && { password: form.password }),
      };
      if (isEdit && editClass) {
        await updateLive({ id: editClass._id, data: payload }).unwrap();
        toast.success("Live class updated successfully!");
      } else {
        await createLive(payload).unwrap();
        toast.success("Live class created successfully!");
      }
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-wide uppercase">
            {isEdit ? "Edit Live Class" : "Create Live Class"}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            {isEdit ? "Update the live class details" : "Schedule a new live class via Zoom"}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Select value={form.subjectId} onValueChange={v => setForm(f => ({ ...f, subjectId: String(v) }))}>
              <SelectTrigger>
                <span>{subjects.find(s => s._id === form.subjectId)?.title || "Select subject"}</span>
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widests uppercase">
              Class Title <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="e.g. Biology Full Course - Class 1" value={form.classTitle}
              onChange={e => setForm(f => ({ ...f, classTitle: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">Topic</Label>
            <Input placeholder="e.g. Cell structure and function" value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold tracking-widest uppercase">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input type="datetime-local" value={form.startTime}
                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold tracking-widest uppercase">Duration (min)</Label>
              <Input type="number" min={15} value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">Timezone</Label>
            <Input value={form.timezone}
              onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))} />
          </div>

          {/* Status — edit only */}
          {isEdit && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-widest uppercase">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: String(v) }))}>
                <SelectTrigger>
                  <span>{statusLabel[form.status] ?? form.status}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="LIVE">Live Now</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full font-bold tracking-widest uppercase">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEdit ? "Updating..." : "Creating..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                {isEdit ? "Update Class" : "Create Live Class"}
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Live Class Card ───────────────────────────────────────────────────────────

function LiveClassCard({
  liveClass, subjectTitle, isAdmin, onEdit, onDelete,
}: {
  liveClass: ILiveClass;
  subjectTitle: string;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cfg = liveStatusConfig[liveClass.status] ?? liveStatusConfig.SCHEDULED;
  const isLive = liveClass.status === "LIVE";
  const canJoin = (isLive || liveClass.status === "SCHEDULED") && !!liveClass.joinUrl;

  const handleJoin = async (meetingId: string, password: string) => {
    const sigRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/zoom/signature?meetingNumber=${meetingId}&role=0`
    );
    const sigJson = await sigRes.json();
    const params = new URLSearchParams({
      meetingNumber: String(meetingId),
      password,
      signature: sigJson.data,
    });
    window.location.href = `/zoom-meeting?${params.toString()}`;
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border transition-all hover:shadow-md dark:hover:shadow-slate-800/50 overflow-hidden ${isLive ? "border-emerald-300 dark:border-emerald-700 shadow-sm" : "border-slate-200 dark:border-slate-800"}`}>
      {isLive && <div className="h-1 w-full bg-linear-to-r from-emerald-400 to-teal-400" />}
      <div className="p-4 space-y-3">

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[11px] px-2 py-0.5 font-semibold border ${cfg.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
              {cfg.label}
            </Badge>
            {subjectTitle && (
              <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                {subjectTitle}
              </span>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={onEdit}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{liveClass.classTitle}</h3>
        {liveClass.topic && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{liveClass.topic}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />{formatDateTime(liveClass.startTime)}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="w-3 h-3" />{liveClass.duration} min
          </span>
          {liveClass.hostEmail && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />{liveClass.hostEmail}
            </span>
          )}
        </div>

        {canJoin && (
          <Button
            onClick={() => handleJoin(liveClass.meetingId as string, liveClass.password as string)}
            size="sm"
            className={`h-8 text-xs font-bold px-4 gap-1.5 ${isLive ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
            <ExternalLink className="w-3.5 h-3.5" />
            {isLive ? "Join Now" : "Join Class"}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface LiveClassesTabProps {
  courseId: string;
  subjects: ISubjectResolved[];
  isAdmin: boolean;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function LiveClassesTab({ courseId, subjects, isAdmin }: LiveClassesTabProps) {
  const [liveSubjectId, setLiveSubjectId] = useState<string>("");
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [editingLive, setEditingLive] = useState<ILiveClass | null>(null);
  const [deletingLive, setDeletingLive] = useState<ILiveClass | null>(null);

  const [deleteLive, { isLoading: deletingLiveLoading }] = useDeleteMeetingMutation();

  const { data: liveResponse, isLoading: liveLoading, refetch: refetchLive } =
    useGetLiveClassesByCourseAndSubjectQuery({courseId, subjectId: liveSubjectId}, { skip: !courseId || !liveSubjectId });
  const allLiveClasses: ILiveClass[] = (liveResponse as any)?.data ?? [];

  // Default: first subject
  useEffect(() => {
    if (subjects.length > 0 && !liveSubjectId) setLiveSubjectId(subjects[0]._id);
  }, [subjects, liveSubjectId]);

  const filteredLiveClasses = useMemo(() =>
    liveSubjectId ? allLiveClasses.filter(lc => lc.subjectId === liveSubjectId) : allLiveClasses,
    [allLiveClasses, liveSubjectId]);

  const getSubjectTitle = (id: string) => subjects.find(s => s._id === id)?.title ?? id;

  const handleDeleteLive = async () => {
    if (!deletingLive) return;
    try {
      await deleteLive(deletingLive._id).unwrap();
      toast.success("Live class deleted successfully");
      setDeletingLive(null);
      refetchLive();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 shrink-0">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Select Subject</span>
        </div>
        <Select value={liveSubjectId} onValueChange={v => setLiveSubjectId(String(v))} disabled={subjects.length === 0}>
          <SelectTrigger className="w-48 h-9 text-sm">
            <span>{getSubjectTitle(liveSubjectId) || "Select subject"}</span>
          </SelectTrigger>
          <SelectContent>
            {subjects.map(sub => <SelectItem key={sub._id} value={sub._id}>{sub.title}</SelectItem>)}
          </SelectContent>
        </Select>
        {!liveLoading && filteredLiveClasses.length > 0 && (
          <span className="text-xs text-slate-400">
            {filteredLiveClasses.length} class{filteredLiveClasses.length !== 1 ? "es" : ""}
          </span>
        )}
        {isAdmin && (
          <div className="ml-auto">
            <Button size="sm" onClick={() => { setEditingLive(null); setLiveModalOpen(true); }}
              className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Plus className="w-4 h-4" /> Create Live Class
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {liveLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredLiveClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Radio className="w-14 h-14 mb-4 opacity-20" />
          <p className="text-base font-medium">No live classes found</p>
          <p className="text-sm mt-1 opacity-70">No live classes scheduled for this subject</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLiveClasses.map(lc => (
            <LiveClassCard
              key={lc._id}
              liveClass={lc}
              subjectTitle={getSubjectTitle(lc.subjectId)}
              isAdmin={isAdmin}
              onEdit={() => { setEditingLive(lc); setLiveModalOpen(true); }}
              onDelete={() => setDeletingLive(lc)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <LiveClassModal
        open={liveModalOpen}
        onOpenChange={setLiveModalOpen}
        courseId={courseId}
        subjects={subjects}
        defaultSubjectId={liveSubjectId}
        editClass={editingLive}
        onSuccess={refetchLive}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingLive} onOpenChange={v => { if (!v) setDeletingLive(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Delete Live Class
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">"{deletingLive?.classTitle}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={deletingLiveLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLive} disabled={deletingLiveLoading} className="bg-red-600 hover:bg-red-700">
              {deletingLiveLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}