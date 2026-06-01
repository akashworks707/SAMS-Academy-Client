
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { BookOpen, Upload, X, Plus, Trash2, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useUpdateCourseMutation } from "@/redux/features/course/course.api";
import { useGetClassesQuery } from "@/redux/features/class/class.api";
import { useGetSubjectsQuery } from "@/redux/features/subjects/subject.api";
import { useGetAllTeachersQuery } from "@/redux/features/user/user.api";

interface SubjectTeacherEntry {
  subjectId: string;
  teacherId: string;
}

interface CourseItem {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  class?: { _id: string; title: string } | string;
  batch?: string;
  regularPrice?: number;
  discountPrice?: number;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  courseStartDate?: string;
  courseEndDate?: string;
  duration?: string;
  totalClasses?: number;
  status?: "upcoming" | "running" | "completed";
  isFeatured?: boolean;
  isActive?: boolean;
  certificate?: boolean;
  // existing subject-teacher mapping from server
  assignSubWithTeacher?: { subject: { _id: string; title: string } | string; teacher: { _id: string; name?: string; fullName?: string } | string }[];
}

interface UpdateCourseModalProps {
  course: CourseItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ─── Schema ────────────────────────────────────────────────────────────────────

const updateCourseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 Character").max(150),
  description: z.string().max(1000).optional(),
  class: z.string().min(1, "Select Class"),
  batch: z.string().optional(),
  regularPrice: z.preprocess(
    (v) => (v !== "" && v !== undefined ? Number(v) : undefined),
    z.number().min(0).optional()
  ),
  discountPrice: z.preprocess(
    (v) => (v !== "" && v !== undefined ? Number(v) : undefined),
    z.number().min(0).optional()
  ),
  enrollmentStartDate: z.string().optional(),
  enrollmentEndDate: z.string().optional(),
  courseStartDate: z.string().optional(),
  courseEndDate: z.string().optional(),
  duration: z.string().optional(),
  totalClasses: z.preprocess(
    (v) => (v !== "" && v !== undefined ? Number(v) : undefined),
    z.number().min(0).optional()
  ),
  status: z.enum(["upcoming", "running", "completed"]).default("upcoming"),
  isFeatured: z.enum(["true", "false"]).default("false"),
  isActive: z.enum(["true", "false"]).default("true"),
  certificate: z.enum(["true", "false"]).default("false"),
});

type UpdateCourseFormValues = z.infer<typeof updateCourseSchema>;

const toDateString = (val?: string) =>
  val ? new Date(val).toISOString().split("T")[0] : "";

// ─── BoolSelect helper ─────────────────────────────────────────────────────────

const BoolSelect = ({ name, control, trueLabel, falseLabel }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger>
          {field.value === "true" ? (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              {trueLabel}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
              {falseLabel}
            </span>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              {trueLabel}
            </span>
          </SelectItem>
          <SelectItem value="false">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
              {falseLabel}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    )}
  />
);

// ─── Main Component ────────────────────────────────────────────────────────────

export function UpdateCourseModal({ course, open, onOpenChange, onSuccess }: UpdateCourseModalProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Subject-Teacher entries
  const [subjectTeacherList, setSubjectTeacherList] = useState<SubjectTeacherEntry[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const { data: classesData } = useGetClassesQuery({ limit: 100 });
  const classes = (classesData as { data?: { _id: string; title: string }[] })?.data ?? [];

  const { data: subjectsData } = useGetSubjectsQuery({
    searchTerm: subjectSearch || undefined,
    limit: 50,
  });
  const subjects = (subjectsData as { data?: { _id: string; title: string }[] })?.data ?? [];

  const { data: teachersData } = useGetAllTeachersQuery(
    teacherSearch ? { searchTerm: teacherSearch } : undefined
  );
  const teachers: any[] = teachersData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateCourseFormValues>({
    resolver: zodResolver(updateCourseSchema) as any,
  });

  // ─── Populate form on open ───────────────────────────────────────────────────

  useEffect(() => {
    if (open && course) {
      const classId =
        typeof course.class === "object" && course.class
          ? course.class._id
          : course.class ?? "";

      reset({
        title: course.title,
        description: course.description ?? "",
        class: classId,
        batch: course.batch ?? "",
        regularPrice: course.regularPrice,
        discountPrice: course.discountPrice,
        enrollmentStartDate: toDateString(course.enrollmentStartDate),
        enrollmentEndDate: toDateString(course.enrollmentEndDate),
        courseStartDate: toDateString(course.courseStartDate),
        courseEndDate: toDateString(course.courseEndDate),
        duration: course.duration ?? "",
        totalClasses: course.totalClasses,
        status: course.status ?? "upcoming",
        isFeatured: course.isFeatured ? "true" : "false",
        isActive: course.isActive ? "true" : "false",
        certificate: course.certificate ? "true" : "false",
      });

      setThumbnailPreview(course.thumbnail ?? null);
      setThumbnailFile(null);

      // Populate existing subject-teacher mappings
      if (course.assignSubWithTeacher && course.assignSubWithTeacher.length > 0) {
        const mapped: SubjectTeacherEntry[] = course.assignSubWithTeacher.map((st) => ({
          subjectId:
            typeof st.subject === "object" && st.subject ? st.subject._id : String(st.subject),
          teacherId:
            typeof st.teacher === "object" && st.teacher ? st.teacher._id : String(st.teacher),
        }));
        setSubjectTeacherList(mapped);
      } else {
        setSubjectTeacherList([]);
      }

      setSelectedSubject("");
      setSelectedTeacher("");
    }
  }, [open, course, reset]);

  // ─── Thumbnail ───────────────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Maximum image size 2MB");
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleClose = () => {
    clearThumbnail();
    onOpenChange(false);
  };

  // ─── Subject-Teacher helpers ─────────────────────────────────────────────────

  const getSubjectTitle = (id: string) => {
    // first check loaded subjects
    const fromList = subjects.find((s) => s._id === id)?.title;
    if (fromList) return fromList;
    // fallback: try to get from existing course data
    if (course.assignSubWithTeacher) {
      const found = course.assignSubWithTeacher.find(
        (st) => (typeof st.subject === "object" ? st.subject._id : st.subject) === id
      );
      if (found && typeof found.subject === "object" && found.subject) return found.subject.title;
    }
    return id;
  };

  const getTeacherName = (id: string) => {
    const t = teachers.find((t) => t._id === id);
    if (t) return t.name ?? t.fullName ?? id;
    // fallback from existing course data
    if (course.assignSubWithTeacher) {
      const found = course.assignSubWithTeacher.find(
        (st) => (typeof st.teacher === "object" ? st.teacher._id : st.teacher) === id
      );
      if (found && typeof found.teacher === "object" && found.teacher) {
        return found.teacher.name ?? found.teacher.fullName ?? id;
      }
    }
    return id;
  };

  const addSubjectTeacher = () => {
    if (!selectedSubject || !selectedTeacher) {
      toast.error("Select subject and teacher");
      return;
    }
    const alreadyExists = subjectTeacherList.some((e) => e.subjectId === selectedSubject);
    if (alreadyExists) {
      toast.error("Subject already selected");
      return;
    }
    setSubjectTeacherList((prev) => [
      ...prev,
      { subjectId: selectedSubject, teacherId: selectedTeacher },
    ]);
    setSelectedSubject("");
    setSelectedTeacher("");
  };

  const removeSubjectTeacher = (subjectId: string) => {
    setSubjectTeacherList((prev) => prev.filter((e) => e.subjectId !== subjectId));
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (data: UpdateCourseFormValues) => {
    try {
      const formData = new FormData();
      const payload = {
        title: data.title,
        ...(data.description && { description: data.description }),
        class: data.class,
        ...(data.batch && { batch: data.batch }),
        ...(data.regularPrice !== undefined && { regularPrice: data.regularPrice }),
        ...(data.discountPrice !== undefined && { discountPrice: data.discountPrice }),
        ...(data.enrollmentStartDate && { enrollmentStartDate: data.enrollmentStartDate }),
        ...(data.enrollmentEndDate && { enrollmentEndDate: data.enrollmentEndDate }),
        ...(data.courseStartDate && { courseStartDate: data.courseStartDate }),
        ...(data.courseEndDate && { courseEndDate: data.courseEndDate }),
        ...(data.duration && { duration: data.duration }),
        ...(data.totalClasses !== undefined && { totalClasses: data.totalClasses }),
        status: data.status,
        isFeatured: data.isFeatured === "true",
        isActive: data.isActive === "true",
        certificate: data.certificate === "true",
        // subject-teacher mapping (always send, even if empty to allow removal)
        assignSubWithTeacher: subjectTeacherList.map((e) => ({
          subject: e.subjectId,
          teacher: e.teacherId,
        })),
      };
      formData.append("data", JSON.stringify(payload));
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      await updateCourse({ id: course._id, data: formData }).unwrap();
      toast.success("Course updated successfully!");
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">Update Course</DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Update course information
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">Thumbnail</Label>
            {thumbnailPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="destructive" type="button" size="sm" onClick={clearThumbnail} className="gap-1">
                    <X className="h-4 w-4" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="update-course-thumbnail"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 h-36 cursor-pointer transition-all"
              >
                <Upload className="h-7 w-7 text-slate-300" />
                <p className="text-sm text-slate-500">Upload new thumbnail</p>
                <input
                  id="update-course-thumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          <Separator />

          {/* Main Info */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Main Info</p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="uc-title" className="text-xs font-semibold tracking-widest uppercase">
                  Course Title <span className="text-red-500">*</span>
                </Label>
                <Input id="uc-title" {...register("title")} />
                {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uc-desc" className="text-xs font-semibold tracking-widest uppercase">Description</Label>
                <Textarea id="uc-desc" rows={3} {...register("description")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold tracking-widest uppercase">
                    Class <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="class"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          {field.value
                            ? <span>{classes.find((c) => c._id === field.value)?.title ?? "Selected"}</span>
                            : <span className="text-muted-foreground">Select Class</span>}
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls._id} value={cls._id}>{cls.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.class && <p className="text-xs text-red-400">{errors.class.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="uc-batch" className="text-xs font-semibold tracking-widest uppercase">Batch</Label>
                  <Input id="uc-batch" {...register("batch")} />
                </div>
              </div>
            </div>
          </div>
          <Separator />

          {/* Subject and Teacher */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              Select subject and teacher
            </p>

            {/* Add row */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end mb-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-widest uppercase">Subject</Label>
                <Select value={selectedSubject} onValueChange={(val) => setSelectedSubject(val ?? "")}
>
                  <SelectTrigger>
                    {selectedSubject
                      ? <span>{getSubjectTitle(selectedSubject)}</span>
                      : <span className="text-muted-foreground">Select Subject</span>}
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 pb-1">
                      <Input
                        placeholder="Search Subject..."
                        className="h-8 text-xs"
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    {subjects.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400">No subject found</div>
                    ) : (
                      subjects.map((sub) => (
                        <SelectItem key={sub._id} value={sub._id}>{sub.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-widest uppercase">Teacher</Label>
                <Select value={selectedTeacher}onValueChange={(val) => setSelectedTeacher(val ?? "")}
>
                  <SelectTrigger>
                    {selectedTeacher
                      ? <span>{getTeacherName(selectedTeacher)}</span>
                      : <span className="text-muted-foreground">Select Teacher</span>}
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 pb-1">
                      <Input
                        placeholder="Search Teacher..."
                        className="h-8 text-xs"
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    {teachers.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-slate-400">No teacher found</div>
                    ) : (
                      teachers.map((teacher) => (
                        <SelectItem key={teacher._id} value={teacher._id}>
                          {teacher.name ?? teacher.fullName ?? teacher._id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 px-3 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                onClick={addSubjectTeacher}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Added list */}
            {subjectTeacherList.length > 0 ? (
              <div className="space-y-2 mt-2">
                {subjectTeacherList.map((entry) => (
                  <div
                    key={entry.subjectId}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <Badge
                        variant="outline"
                        className="text-[11px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 truncate max-w-35"
                      >
                        {getSubjectTitle(entry.subjectId)}
                      </Badge>
                      <span className="text-xs text-slate-400 shrink-0">→</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {getTeacherName(entry.teacherId)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 shrink-0"
                      onClick={() => removeSubjectTeacher(entry.subjectId)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mt-1">
                No subject has been added yet
              </p>
            )}
          </div>
          <Separator />

          {/* Fee */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Main Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="uc-regular" className="text-xs font-semibold tracking-widest uppercase">Regular Fee (Taka)</Label>
                <Input id="uc-regular" type="number" min={0} {...register("regularPrice")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uc-discount" className="text-xs font-semibold tracking-widest uppercase">Discount Fee (Taka)</Label>
                <Input id="uc-discount" type="number" min={0} {...register("discountPrice")} />
              </div>
            </div>
          </div>
          <Separator />

          {/* Date */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Date and Time</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Enrollment Start</Label><Input type="date" {...register("enrollmentStartDate")} /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Enrollment End</Label><Input type="date" {...register("enrollmentEndDate")} /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Course Start</Label><Input type="date" {...register("courseStartDate")} /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Course End</Label><Input type="date" {...register("courseEndDate")} /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Duration</Label><Input placeholder="Ex: 6 months" {...register("duration")} /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Total Class</Label><Input type="number" min={0} {...register("totalClasses")} /></div>
            </div>
          </div>
          <Separator />

          {/* Settings */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">Settings</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-widest uppercase">Course Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        {field.value === "upcoming" && <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />Upcoming</span>}
                        {field.value === "running" && <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Running</span>}
                        {field.value === "completed" && <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />Completed</span>}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />Upcoming</span></SelectItem>
                        <SelectItem value="running"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Running</span></SelectItem>
                        <SelectItem value="completed"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />Complete</span></SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Active Status</Label><BoolSelect name="isActive" control={control} trueLabel="Active" falseLabel="Inactive" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Featured Course</Label><BoolSelect name="isFeatured" control={control} trueLabel="Yes" falseLabel="No" /></div>
              <div className="space-y-1.5"><Label className="text-xs font-semibold tracking-widest uppercase">Certificate</Label><BoolSelect name="certificate" control={control} trueLabel="Yes" falseLabel="No" /></div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 cursor-pointer font-bold tracking-widest uppercase disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Course Updating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Update Course
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}