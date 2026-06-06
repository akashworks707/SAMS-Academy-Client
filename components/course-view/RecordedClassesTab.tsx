"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PlayCircle, Clock, CheckCircle2, MonitorPlay,
  Filter, Plus, Pencil, Trash2, Upload, ChevronLeft, ChevronRight, AlertTriangle,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  useGetRecordedVideosByCourseQuery,
  useCreateRecordedVideoMutation,
  useUpdateRecordedVideoMutation,
  useDeleteRecordedVideoMutation,
} from "@/redux/features/recordedVideo/recordedVideo.api";
import { IRecordedVideo, ISubjectResolved } from "@/types/course-view.types";


// ─── Form State ────────────────────────────────────────────────────────────────

type RecordedFormState = {
  title: string;
  description: string;
  videoUrl: string;
  subject: string;
  status: string;
};

// ─── Upload / Edit Modal ───────────────────────────────────────────────────────

interface RecordedVideoModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  courseId: string;
  subjects: ISubjectResolved[];
  defaultSubjectId?: string;
  editVideo?: IRecordedVideo | null;
  onSuccess: () => void;
}

function RecordedVideoModal({
  open, onOpenChange, courseId, subjects, defaultSubjectId, editVideo, onSuccess,
}: RecordedVideoModalProps) {
  const isEdit = !!editVideo;
  const [createVideo, { isLoading: creating }] = useCreateRecordedVideoMutation();
  const [updateVideo, { isLoading: updating }] = useUpdateRecordedVideoMutation();
  const isLoading = creating || updating;

  const [form, setForm] = useState<RecordedFormState>({
    title: "", description: "", videoUrl: "",
    subject: defaultSubjectId ?? "", status: "ACTIVE",
  });

  useEffect(() => {
    if (!open) return;
    if (isEdit && editVideo) {
      setForm({
        title: editVideo.title,
        description: editVideo.description ?? "",
        videoUrl: editVideo.videoUrl,
        subject: editVideo.subject,
        status: editVideo.status,
      });
    } else {
      setForm({
        title: "", description: "", videoUrl: "",
        subject: defaultSubjectId ?? subjects[0]?._id ?? "",
        status: "ACTIVE",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.videoUrl.trim() || !form.subject) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        course: courseId, subject: form.subject,
        title: form.title, description: form.description,
        videoUrl: form.videoUrl, status: form.status,
      }));
      if (isEdit && editVideo) {
        await updateVideo({ id: editVideo._id, data: formData }).unwrap();
        toast.success("Video updated successfully!");
      } else {
        await createVideo(formData).unwrap();
        toast.success("Video uploaded successfully!");
      }
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-wide uppercase">
            {isEdit ? "Edit Recorded Class" : "Upload Recorded Class"}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            {isEdit ? "Update the recorded class details" : "Add a new recorded class to this course"}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: String(v) }))}>
              <SelectTrigger>
                <span>{subjects.find(s => s._id === form.subject)?.title || "Select subject"}</span>
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Class Title <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="e.g. Biology Chapter 1" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Video URL <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="https://www.youtube.com/embed/..." value={form.videoUrl}
              onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} />
            <p className="text-[11px] text-slate-400">Use YouTube embed URL format</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">Description</Label>
            <Textarea rows={3} placeholder="Brief description of this class..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">Status</Label>
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: String(v) }))}>
              <SelectTrigger>
                <span>{form.status === "ACTIVE" ? "Active" : "Inactive"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full font-bold tracking-widest uppercase">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEdit ? "Updating..." : "Uploading..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isEdit ? "Update Class" : "Upload Class"}
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface RecordedClassesTabProps {
  courseId: string;
  subjects: ISubjectResolved[];
  isAdmin: boolean;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function RecordedClassesTab({ courseId, subjects, isAdmin }: RecordedClassesTabProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<IRecordedVideo | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<IRecordedVideo | null>(null);

  const [deleteVideo, { isLoading: deletingVideoLoading }] = useDeleteRecordedVideoMutation();

  const { data: videosResponse, isLoading: videosLoading, refetch: refetchVideos } =
    useGetRecordedVideosByCourseQuery(courseId, { skip: !courseId });
  const allVideos: IRecordedVideo[] = (videosResponse as any)?.data ?? [];

  // Default: first subject
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) setSelectedSubjectId(subjects[0]._id);
  }, [subjects, selectedSubjectId]);

  const filteredVideos = useMemo(() =>
    selectedSubjectId ? allVideos.filter(v => v.subject === selectedSubjectId) : allVideos,
    [allVideos, selectedSubjectId]);

  const handleSubjectChange = (v: string) => { setSelectedSubjectId(v); setActiveVideoIndex(0); };
  const activeVideo = filteredVideos[activeVideoIndex] ?? null;
  const goNext = () => { if (activeVideoIndex < filteredVideos.length - 1) setActiveVideoIndex(i => i + 1); };
  const goPrev = () => { if (activeVideoIndex > 0) setActiveVideoIndex(i => i - 1); };
  const getSubjectTitle = (id: string) => subjects.find(s => s._id === id)?.title ?? id;

  const handleDeleteVideo = async () => {
    if (!deletingVideo) return;
    try {
      await deleteVideo(deletingVideo._id).unwrap();
      toast.success("Video deleted successfully");
      setDeletingVideo(null);
      if (activeVideoIndex >= filteredVideos.length - 1)
        setActiveVideoIndex(Math.max(0, filteredVideos.length - 2));
      refetchVideos();
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
        <Select value={selectedSubjectId} onValueChange={v => handleSubjectChange(String(v))} disabled={subjects.length === 0}>
          <SelectTrigger className="w-48 h-9 text-sm">
            <span>{getSubjectTitle(selectedSubjectId) || "Select subject"}</span>
          </SelectTrigger>
          <SelectContent>
            {subjects.map(sub => <SelectItem key={sub._id} value={sub._id}>{sub.title}</SelectItem>)}
          </SelectContent>
        </Select>
        {filteredVideos.length > 0 && (
          <span className="text-xs text-slate-400">
            {filteredVideos.length} class{filteredVideos.length !== 1 ? "es" : ""}
          </span>
        )}
        {isAdmin && (
          <div className="ml-auto">
            <Button size="sm" onClick={() => { setEditingVideo(null); setVideoModalOpen(true); }}
              className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Plus className="w-4 h-4" /> Upload Class
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {videosLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-3">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <MonitorPlay className="w-14 h-14 mb-4 opacity-20" />
          <p className="text-base font-medium">No classes found</p>
          <p className="text-sm mt-1 opacity-70">No recorded classes for this subject yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-5">

          {/* Left: Player */}
          <div className="space-y-4 min-w-0">
            <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-lg" style={{ aspectRatio: "16/9" }}>
              {activeVideo ? (
                <iframe key={activeVideo._id} src={activeVideo.videoUrl} title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <PlayCircle className="w-16 h-16 text-slate-600" />
                </div>
              )}
            </div>

            {activeVideo && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                        Class {activeVideoIndex + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full">
                        {getSubjectTitle(activeVideo.subject)}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{activeVideo.title}</h2>
                    {activeVideo.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activeVideo.description}</p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => { setEditingVideo(activeVideo); setVideoModalOpen(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeletingVideo(activeVideo)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 px-4 disabled:opacity-40"
                onClick={goPrev} disabled={activeVideoIndex === 0}>
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <span className="text-xs text-slate-400 font-medium">
                {activeVideoIndex + 1} / {filteredVideos.length}
              </span>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 px-4 disabled:opacity-40"
                onClick={goNext} disabled={activeVideoIndex === filteredVideos.length - 1}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: Class list sidebar */}
          <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-fit max-h-[calc(100vh-220px)] lg:sticky lg:top-30">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Class List</span>
              <span className="ml-auto text-xs text-slate-400">{filteredVideos.length} total</span>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVideos.map((video, index) => {
                const isActive = index === activeVideoIndex;
                const isDone = index < activeVideoIndex;
                return (
                  <div key={video._id}
                    className={`flex items-center transition-all group ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                    <button onClick={() => setActiveVideoIndex(index)}
                      className="flex-1 text-left px-4 py-3 flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : isDone ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"}`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <p className={`text-xs font-semibold leading-snug line-clamp-2 min-w-0 flex-1 ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {video.title}
                      </p>
                      {isActive && <PlayCircle className="w-4 h-4 text-blue-500 shrink-0 animate-pulse" />}
                    </button>
                    {isAdmin && (
                      <div className="flex items-center gap-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingVideo(video); setVideoModalOpen(true); }}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => setDeletingVideo(video)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Upload/Edit Modal */}
      <RecordedVideoModal
        open={videoModalOpen}
        onOpenChange={setVideoModalOpen}
        courseId={courseId}
        subjects={subjects}
        defaultSubjectId={selectedSubjectId}
        editVideo={editingVideo}
        onSuccess={refetchVideos}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingVideo} onOpenChange={v => { if (!v) setDeletingVideo(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Delete Recorded Class
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">"{deletingVideo?.title}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={deletingVideoLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVideo} disabled={deletingVideoLoading} className="bg-red-600 hover:bg-red-700">
              {deletingVideoLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}







// "use client";

// import { useState, useMemo, useEffect } from "react";
// import {
//   Radio, Filter, Plus, Pencil, Trash2, Calendar,
//   Timer, Users, AlertTriangle, X, ChevronLeft,
// } from "lucide-react";

// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";

// import {
//   useGetLiveClassesByCourseQuery,
//   useCreateMeetingMutation,
//   useUpdateMeetingMutation,
//   useDeleteMeetingMutation,
// } from "@/redux/features/zoom/zoom.api";

// import { ILiveClass, ISubjectResolved, liveStatusConfig, statusLabel, formatDateTime } from "@/types/course-view.types";
// import { ZoomEmbed } from "./Zoomembed";

// // ─── Types ─────────────────────────────────────────────────────────────────────

// interface ZoomJoinInfo {
//   meetingNumber: string;
//   password: string;
//   signature: string;
//   sdkKey: string;
//   userName: string;
// }

// // ─── Form State ────────────────────────────────────────────────────────────────

// type LiveFormState = {
//   classTitle: string;
//   topic: string;
//   subjectId: string;
//   startTime: string;
//   duration: number;
//   timezone: string;
//   password: string;
//   status: string;
// };

// // ─── Create / Edit Modal ───────────────────────────────────────────────────────

// interface LiveClassModalProps {
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   courseId: string;
//   subjects: ISubjectResolved[];
//   defaultSubjectId?: string;
//   editClass?: ILiveClass | null;
//   onSuccess: () => void;
// }

// function LiveClassModal({
//   open, onOpenChange, courseId, subjects, defaultSubjectId, editClass, onSuccess,
// }: LiveClassModalProps) {
//   const isEdit = !!editClass;
//   const [createLive, { isLoading: creating }] = useCreateMeetingMutation();
//   const [updateLive, { isLoading: updating }] = useUpdateMeetingMutation();
//   const isLoading = creating || updating;

//   const [form, setForm] = useState<LiveFormState>({
//     classTitle: "", topic: "",
//     subjectId: defaultSubjectId ?? "",
//     startTime: "", duration: 60,
//     timezone: "Asia/Dhaka", password: "", status: "SCHEDULED",
//   });

//   useEffect(() => {
//     if (!open) return;
//     if (isEdit && editClass) {
//       setForm({
//         classTitle: editClass.classTitle,
//         topic: editClass.topic ?? "",
//         subjectId: editClass.subjectId,
//         startTime: editClass.startTime ? new Date(editClass.startTime).toISOString().slice(0, 16) : "",
//         duration: editClass.duration,
//         timezone: editClass.timezone ?? "Asia/Dhaka",
//         password: editClass.password ?? "",
//         status: editClass.status,
//       });
//     } else {
//       setForm({
//         classTitle: "", topic: "",
//         subjectId: defaultSubjectId ?? subjects[0]?._id ?? "",
//         startTime: "", duration: 60,
//         timezone: "Asia/Dhaka", password: "", status: "SCHEDULED",
//       });
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.classTitle.trim() || !form.subjectId || !form.startTime) {
//       toast.error("Please fill all required fields");
//       return;
//     }
//     try {
//       const payload = {
//         courseId, subjectId: form.subjectId,
//         classTitle: form.classTitle, topic: form.topic,
//         startTime: new Date(form.startTime).toISOString(),
//         duration: Number(form.duration),
//         timezone: form.timezone,
//         status: form.status as ILiveClass["status"],
//         ...(form.password && { password: form.password }),
//       };
//       if (isEdit && editClass) {
//         await updateLive({ id: editClass._id, data: payload }).unwrap();
//         toast.success("Live class updated successfully!");
//       } else {
//         await createLive(payload).unwrap();
//         toast.success("Live class created successfully!");
//       }
//       onOpenChange(false);
//       onSuccess();
//     } catch (err: any) {
//       toast.error(err?.data?.message ?? "Something went wrong");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-lg font-bold tracking-wide uppercase">
//             {isEdit ? "Edit Live Class" : "Create Live Class"}
//           </DialogTitle>
//           <DialogDescription className="text-slate-400 text-sm">
//             {isEdit ? "Update the live class details" : "Schedule a new live class via Zoom"}
//           </DialogDescription>
//         </DialogHeader>
//         <Separator />
//         <form onSubmit={handleSubmit} className="space-y-4 pt-1">
//           <div className="space-y-1.5">
//             <Label className="text-xs font-semibold tracking-widest uppercase">
//               Subject <span className="text-red-500">*</span>
//             </Label>
//             <Select value={form.subjectId} onValueChange={v => setForm(f => ({ ...f, subjectId: String(v) }))}>
//               <SelectTrigger>
//                 <span>{subjects.find(s => s._id === form.subjectId)?.title || "Select subject"}</span>
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map(s => <SelectItem key={s._id} value={s._id}>{s.title}</SelectItem>)}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-1.5">
//             <Label className="text-xs font-semibold tracking-widest uppercase">
//               Class Title <span className="text-red-500">*</span>
//             </Label>
//             <Input placeholder="e.g. Biology Full Course - Class 1" value={form.classTitle}
//               onChange={e => setForm(f => ({ ...f, classTitle: e.target.value }))} />
//           </div>

//           <div className="space-y-1.5">
//             <Label className="text-xs font-semibold tracking-widest uppercase">Topic</Label>
//             <Input placeholder="e.g. Cell structure and function" value={form.topic}
//               onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5 col-span-2 sm:col-span-1">
//               <Label className="text-xs font-semibold tracking-widest uppercase">
//                 Start Time <span className="text-red-500">*</span>
//               </Label>
//               <Input type="datetime-local" value={form.startTime}
//                 onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
//             </div>
//             <div className="space-y-1.5 col-span-2 sm:col-span-1">
//               <Label className="text-xs font-semibold tracking-widest uppercase">Duration (min)</Label>
//               <Input type="number" min={15} value={form.duration}
//                 onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
//             </div>
//           </div>

//           <div className="space-y-1.5">
//             <Label className="text-xs font-semibold tracking-widest uppercase">Timezone</Label>
//             <Input value={form.timezone}
//               onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))} />
//           </div>

//           {isEdit && (
//             <div className="space-y-1.5">
//               <Label className="text-xs font-semibold tracking-widest uppercase">Status</Label>
//               <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: String(v) }))}>
//                 <SelectTrigger>
//                   <span>{statusLabel[form.status] ?? form.status}</span>
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="SCHEDULED">Scheduled</SelectItem>
//                   <SelectItem value="LIVE">Live Now</SelectItem>
//                   <SelectItem value="COMPLETED">Completed</SelectItem>
//                   <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <Button type="submit" disabled={isLoading} className="w-full font-bold tracking-widest uppercase">
//             {isLoading ? (
//               <span className="flex items-center gap-2">
//                 <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                 {isEdit ? "Updating..." : "Creating..."}
//               </span>
//             ) : (
//               <span className="flex items-center gap-2">
//                 <Radio className="h-4 w-4" />
//                 {isEdit ? "Update Class" : "Create Live Class"}
//               </span>
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // ─── Live Class Card ───────────────────────────────────────────────────────────

// function LiveClassCard({
//   liveClass, subjectTitle, isAdmin, onEdit, onDelete, onJoin, isJoining,
// }: {
//   liveClass: ILiveClass;
//   subjectTitle: string;
//   isAdmin: boolean;
//   onEdit: () => void;
//   onDelete: () => void;
//   onJoin: () => void;
//   isJoining: boolean;
// }) {
//   const cfg = liveStatusConfig[liveClass.status] ?? liveStatusConfig.SCHEDULED;
//   const isLive = liveClass.status === "LIVE";
//   const canJoin = (isLive || liveClass.status === "SCHEDULED") && !!liveClass.meetingId;

//   return (
//     <div className={`bg-white dark:bg-slate-900 rounded-xl border transition-all hover:shadow-md dark:hover:shadow-slate-800/50 overflow-hidden ${isLive ? "border-emerald-300 dark:border-emerald-700 shadow-sm" : "border-slate-200 dark:border-slate-800"}`}>
//       {isLive && <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-400" />}
//       <div className="p-4 space-y-3">
//         <div className="flex items-center justify-between gap-2">
//           <div className="flex items-center gap-2 flex-wrap">
//             <Badge variant="outline" className={`text-[11px] px-2 py-0.5 font-semibold border ${cfg.color}`}>
//               <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
//               {cfg.label}
//             </Badge>
//             {subjectTitle && (
//               <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
//                 {subjectTitle}
//               </span>
//             )}
//           </div>
//           {isAdmin && (
//             <div className="flex items-center gap-1 shrink-0">
//               <button onClick={onEdit}
//                 className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Edit">
//                 <Pencil className="w-3.5 h-3.5" />
//               </button>
//               <button onClick={onDelete}
//                 className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete">
//                 <Trash2 className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           )}
//         </div>

//         <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{liveClass.classTitle}</h3>
//         {liveClass.topic && (
//           <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{liveClass.topic}</p>
//         )}

//         <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
//           <span className="flex items-center gap-1">
//             <Calendar className="w-3 h-3" />{formatDateTime(liveClass.startTime)}
//           </span>
//           <span className="flex items-center gap-1">
//             <Timer className="w-3 h-3" />{liveClass.duration} min
//           </span>
//           {liveClass.hostEmail && (
//             <span className="flex items-center gap-1">
//               <Users className="w-3 h-3" />{liveClass.hostEmail}
//             </span>
//           )}
//         </div>

//         {canJoin && (
//           <Button
//             onClick={onJoin}
//             disabled={isJoining}
//             size="sm"
//             className={`h-8 text-xs font-bold px-4 gap-1.5 disabled:opacity-60 ${isLive ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
//           >
//             {isJoining ? (
//               <span className="flex items-center gap-1.5">
//                 <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                 Preparing...
//               </span>
//             ) : (
//               <span className="flex items-center gap-1.5">
//                 <Radio className="w-3.5 h-3.5" />
//                 {isLive ? "Join Now" : "Join Class"}
//               </span>
//             )}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Active Meeting View ────────────────────────────────────────────────────────

// function ActiveMeetingView({
//   joinInfo, classTitle, onLeave,
// }: {
//   joinInfo: ZoomJoinInfo;
//   classTitle: string;
//   onLeave: () => void;
// }) {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3">
//         <div className="flex items-center gap-2 min-w-0">
//           <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
//           <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">{classTitle}</h2>
//         </div>
//         <Button variant="outline" size="sm" onClick={onLeave}
//           className="h-8 gap-1.5 text-xs border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950 shrink-0">
//           <X className="w-3.5 h-3.5" /> Leave
//         </Button>
//       </div>
//       <ZoomEmbed
//         meetingNumber={joinInfo.meetingNumber}
//         password={joinInfo.password}
//         signature={joinInfo.signature}
//         sdkKey={joinInfo.sdkKey}
//         userName={joinInfo.userName}
//         onLeave={onLeave}
//       />
//     </div>
//   );
// }

// // ─── Props ─────────────────────────────────────────────────────────────────────

// interface LiveClassesTabProps {
//   courseId: string;
//   subjects: ISubjectResolved[];
//   isAdmin: boolean;
//   userName?: string;
// }

// // ─── Main Component ────────────────────────────────────────────────────────────

// export function LiveClassesTab({ courseId, subjects, isAdmin, userName = "Guest" }: LiveClassesTabProps) {
//   const [liveSubjectId, setLiveSubjectId] = useState<string>("");
//   const [liveModalOpen, setLiveModalOpen] = useState(false);
//   const [editingLive, setEditingLive] = useState<ILiveClass | null>(null);
//   const [deletingLive, setDeletingLive] = useState<ILiveClass | null>(null);
//   const [activeJoinInfo, setActiveJoinInfo] = useState<ZoomJoinInfo | null>(null);
//   const [activeClassTitle, setActiveClassTitle] = useState("");
//   const [joiningId, setJoiningId] = useState<string | null>(null);

//   const [deleteLive, { isLoading: deletingLiveLoading }] = useDeleteMeetingMutation();

//   const { data: liveResponse, isLoading: liveLoading, refetch: refetchLive } =
//     useGetLiveClassesByCourseQuery(courseId, { skip: !courseId });
//   const allLiveClasses: ILiveClass[] = (liveResponse as any)?.data ?? [];

//   useEffect(() => {
//     if (subjects.length > 0 && !liveSubjectId) setLiveSubjectId(subjects[0]._id);
//   }, [subjects, liveSubjectId]);

//   const filteredLiveClasses = useMemo(() =>
//     liveSubjectId ? allLiveClasses.filter(lc => lc.subjectId === liveSubjectId) : allLiveClasses,
//     [allLiveClasses, liveSubjectId]);

//   const getSubjectTitle = (id: string) => subjects.find(s => s._id === id)?.title ?? id;

//   const handleJoin = async (liveClass: ILiveClass) => {
//     if (!liveClass.meetingId) { toast.error("Meeting ID not found"); return; }
//     setJoiningId(liveClass._id);
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/zoom/signature?meetingNumber=${liveClass.meetingId}&role=0`
//       );
//       if (!res.ok) throw new Error("Failed to get signature");
//       const json = await res.json();
//       const signature = json?.data ?? json?.signature;
//       const sdkKey = json?.sdkKey ?? process.env.NEXT_PUBLIC_ZOOM_SDK_KEY ?? "";
//       if (!signature) throw new Error("Signature not received");
//       setActiveJoinInfo({ meetingNumber: liveClass.meetingId, password: liveClass.password ?? "", signature, sdkKey, userName });
//       setActiveClassTitle(liveClass.classTitle);
//     } catch (err: any) {
//       toast.error(err?.message ?? "Failed to join meeting");
//     } finally {
//       setJoiningId(null);
//     }
//   };

//   const handleLeave = () => { setActiveJoinInfo(null); setActiveClassTitle(""); };

//   const handleDeleteLive = async () => {
//     if (!deletingLive) return;
//     try {
//       await deleteLive(deletingLive._id).unwrap();
//       toast.success("Live class deleted successfully");
//       setDeletingLive(null);
//       refetchLive();
//     } catch (err: any) {
//       toast.error(err?.data?.message ?? "Failed to delete");
//     }
//   };

//   // ── Active meeting view ────────────────────────────────────────────────────
//   if (activeJoinInfo) {
//     return (
//       <div>
//         <button onClick={handleLeave}
//           className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3 transition-colors">
//           <ChevronLeft className="w-3.5 h-3.5" /> Back to classes
//         </button>
//         <ActiveMeetingView joinInfo={activeJoinInfo} classTitle={activeClassTitle} onLeave={handleLeave} />
//       </div>
//     );
//   }

//   // ── Class list view ────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-4">

//       {/* Filter row */}
//       <div className="flex items-center gap-3 flex-wrap">
//         <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 shrink-0">
//           <Filter className="w-4 h-4" />
//           <span className="hidden sm:inline">Select Subject</span>
//         </div>
//         <Select value={liveSubjectId} onValueChange={v => setLiveSubjectId(String(v))} disabled={subjects.length === 0}>
//           <SelectTrigger className="w-48 h-9 text-sm">
//             <span>{getSubjectTitle(liveSubjectId) || "Select subject"}</span>
//           </SelectTrigger>
//           <SelectContent>
//             {subjects.map(sub => <SelectItem key={sub._id} value={sub._id}>{sub.title}</SelectItem>)}
//           </SelectContent>
//         </Select>
//         {!liveLoading && filteredLiveClasses.length > 0 && (
//           <span className="text-xs text-slate-400">
//             {filteredLiveClasses.length} class{filteredLiveClasses.length !== 1 ? "es" : ""}
//           </span>
//         )}
//         {isAdmin && (
//           <div className="ml-auto">
//             <Button size="sm" onClick={() => { setEditingLive(null); setLiveModalOpen(true); }}
//               className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
//               <Plus className="w-4 h-4" /> Create Live Class
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       {liveLoading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
//               <Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-3/4" />
//               <Skeleton className="h-4 w-1/2" /><Skeleton className="h-9 w-28 rounded-lg" />
//             </div>
//           ))}
//         </div>
//       ) : filteredLiveClasses.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-24 text-slate-400">
//           <Radio className="w-14 h-14 mb-4 opacity-20" />
//           <p className="text-base font-medium">No live classes found</p>
//           <p className="text-sm mt-1 opacity-70">No live classes scheduled for this subject</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredLiveClasses.map(lc => (
//             <LiveClassCard
//               key={lc._id}
//               liveClass={lc}
//               subjectTitle={getSubjectTitle(lc.subjectId)}
//               isAdmin={isAdmin}
//               onEdit={() => { setEditingLive(lc); setLiveModalOpen(true); }}
//               onDelete={() => setDeletingLive(lc)}
//               onJoin={() => handleJoin(lc)}
//               isJoining={joiningId === lc._id}
//             />
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       <LiveClassModal
//         open={liveModalOpen}
//         onOpenChange={setLiveModalOpen}
//         courseId={courseId}
//         subjects={subjects}
//         defaultSubjectId={liveSubjectId}
//         editClass={editingLive}
//         onSuccess={refetchLive}
//       />

//       <AlertDialog open={!!deletingLive} onOpenChange={v => { if (!v) setDeletingLive(null); }}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="w-5 h-5 text-red-500" /> Delete Live Class
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-slate-900 dark:text-white">"{deletingLive?.classTitle}"</span>?
//               This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2 justify-end mt-2">
//             <AlertDialogCancel disabled={deletingLiveLoading}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeleteLive} disabled={deletingLiveLoading} className="bg-red-600 hover:bg-red-700">
//               {deletingLiveLoading ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }