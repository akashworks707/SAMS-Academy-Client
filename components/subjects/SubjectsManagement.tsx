// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useState } from "react";
// import { Plus, Edit2, Trash2, Search, BookOpen } from "lucide-react";
// import { toast } from "sonner";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { PageHeader } from "@/components/layout/page-header";
// import {
//   useGetSubjectsQuery,
//   useSoftDeleteSubjectMutation,
// } from "@/redux/features/subjects/subject.api";
// import CreateSubjectModal from "./CreateSubjectModal";
// import UpdateSubjectModal from "./UpdateSubjectModal";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface SubjectItem {
//   _id: string;
//   title: string;
//   code?: string;
//   description?: string;
//   isActive: boolean;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function SubjectsManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null);
//   const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   // ── RTK Query ──
//   const {
//     data: subjectsData,
//     isLoading: isSubjectsLoading,
//     refetch,
//   } = useGetSubjectsQuery({
//     searchTerm: searchTerm || undefined,
//     limit: 50,
//   });

//   const [softDeleteSubject, { isLoading: isDeleting }] = useSoftDeleteSubjectMutation();

//   const subjects = (subjectsData as { data?: SubjectItem[] })?.data ?? [];

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const openEditDialog = (subject: SubjectItem) => {
//     setEditingSubject(subject);
//     setIsEditOpen(true);
//   };

//   const handleDeleteSubject = async () => {
//     if (!deletingSubject) return;
//     try {
//       await softDeleteSubject(deletingSubject._id).unwrap();
//       toast.success("Subject removed", {
//         description: `"${deletingSubject.title}" has been moved to trash.`,
//       });
//       setIsDeleteOpen(false);
//       setDeletingSubject(null);
//       refetch();
//     } catch (error: any) {
//       toast.error("Delete failed", {
//         description: error?.data?.message ?? "There was a problem deleting the subject.",
//       });
//     }
//   };

//   const openDeleteDialog = (subject: SubjectItem) => {
//     setDeletingSubject(subject);
//     setIsDeleteOpen(true);
//   };

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Subjects Management"
//         description="Manage all subjects and curricula"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Subjects" },
//         ]}
//         action={<CreateSubjectModal onSuccess={refetch} />}
//       />

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <Input
//           placeholder="Search by name or code..."
//           className="pl-9 h-10"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Subjects Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//         {isSubjectsLoading ? (
//           Array.from({ length: 6 }).map((_, i) => (
//             <div
//               key={i}
//               className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
//                 <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
//               </div>
//               <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
//               <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
//               <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mt-4" />
//             </div>
//           ))
//         ) : subjects.length === 0 ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
//             <BookOpen className="w-12 h-12 mb-3 opacity-30" />
//             <p className="font-medium">No subjects found</p>
//             <p className="text-sm mt-1">
//               {searchTerm
//                 ? "Try searching with a different keyword"
//                 : "Create your first subject to get started"}
//             </p>
//           </div>
//         ) : (
//           subjects.map((subject) => (
//             <div
//               key={subject._id}
//               className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-lg">
//                   {subject.title.charAt(0).toUpperCase()}
//                 </div>
//                 <Badge
//                   className={
//                     subject.isActive
//                       ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100"
//                       : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
//                   }
//                 >
//                   {subject.isActive ? "Active" : "Inactive"}
//                 </Badge>
//               </div>

//               <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
//                 {subject.title}
//               </h3>

//               {subject.code && (
//                 <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
//                   {subject.code}
//                 </p>
//               )}

//               {subject.description && (
//                 <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
//                   {subject.description}
//                 </p>
//               )}

//               <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 text-xs h-8"
//                   onClick={() => openEditDialog(subject)}
//                 >
//                   <Edit2 className="w-3.5 h-3.5 mr-1.5" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
//                   onClick={() => openDeleteDialog(subject)}
//                 >
//                   <Trash2 className="w-3.5 h-3.5 mr-1.5" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Update Modal */}
//       {editingSubject && (
//         <UpdateSubjectModal
//           subject={editingSubject}
//           open={isEditOpen}
//           onOpenChange={(val) => {
//             setIsEditOpen(val);
//             if (!val) setEditingSubject(null);
//           }}
//           onSuccess={refetch}
//         />
//       )}

//       {/* Delete Confirmation */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Subject</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-slate-900 dark:text-white">
//                 {deletingSubject?.title}
//               </span>
//               ? It will be moved to trash.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2 justify-end mt-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeleteSubject}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }




/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  DollarSign,
  Layers,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";

import {
  useGetSubjectsQuery,
  useSoftDeleteSubjectMutation,
} from "@/redux/features/subjects/subject.api";
import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";
import CreateSubjectModal from "./CreateSubjectModal";
import UpdateSubjectModal from "./UpdateSubjectModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubjectItem {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

// ─── Stat Card Skeleton ───────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-24 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: "emerald" | "blue" | "violet" | "amber";
}) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: "text-emerald-600 dark:text-emerald-400",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-600 dark:text-blue-400",
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-900/20",
      icon: "text-violet-600 dark:text-violet-400",
      text: "text-violet-600 dark:text-violet-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: "text-amber-600 dark:text-amber-400",
      text: "text-amber-600 dark:text-amber-400",
    },
  };
  const c = colorMap[color];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {sub && <p className={`text-xs mt-1 ${c.text}`}>{sub}</p>}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubjectsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const hasDateFilter = !!(startDate || endDate);

  // ── RTK Query ──
  const analyticsParams = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAllAnalyticsQuery(analyticsParams);

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    refetch,
  } = useGetSubjectsQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });

  const [softDeleteSubject, { isLoading: isDeleting }] =
    useSoftDeleteSubjectMutation();

  const subjects = (subjectsData as { data?: SubjectItem[] })?.data ?? [];

  // ── Derived analytics ──
  const stats = analyticsData?.data?.stats;
  const totalRevenue =
    analyticsData?.data?.revenue?.totalRevenue?.totalRevenue ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const clearDateFilter = () => { setStartDate(""); setEndDate(""); };

  const openEditDialog = (subject: SubjectItem) => {
    setEditingSubject(subject);
    setIsEditOpen(true);
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;
    try {
      await softDeleteSubject(deletingSubject._id).unwrap();
      toast.success("Subject removed", {
        description: `"${deletingSubject.title}" has been moved to trash.`,
      });
      setIsDeleteOpen(false);
      setDeletingSubject(null);
      refetch();
    } catch (error: any) {
      toast.error("Delete failed", {
        description:
          error?.data?.message ?? "There was a problem deleting the subject.",
      });
    }
  };

  const openDeleteDialog = (subject: SubjectItem) => {
    setDeletingSubject(subject);
    setIsDeleteOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects Management"
        description="Manage all subjects and curricula"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Subjects" },
        ]}
        action={<CreateSubjectModal onSuccess={refetch} />}
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date filter row */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
            Filter stats by date:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="date"
              className="h-9 w-40 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-slate-400 text-sm">to</span>
            <Input
              type="date"
              className="h-9 w-40 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {hasDateFilter && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={clearDateFilter}
                title="Clear date filter"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {isAnalyticsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Subjects"
              value={stats?.totalSubjects ?? 0}
              sub={`${stats?.totalClasses ?? 0} total classes`}
              icon={BookOpen}
              color="blue"
            />
            <StatCard
              label="Total Courses"
              value={stats?.totalCourses ?? 0}
              sub={`${stats?.totalActiveCourses ?? 0} active · ${stats?.runningCourses ?? 0} running`}
              icon={Layers}
              color="violet"
            />
            <StatCard
              label="Total Teachers"
              value={stats?.totalTeachers ?? 0}
              sub={`${stats?.totalStudents ?? 0} students enrolled`}
              icon={GraduationCap}
              color="amber"
            />
            <StatCard
              label="Total Revenue"
              value={`৳${totalRevenue.toLocaleString()}`}
              sub={`${stats?.totalTransactions ?? 0} transactions`}
              icon={DollarSign}
              color="emerald"
            />
          </>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name or code..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isSubjectsLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mt-4" />
            </div>
          ))
        ) : subjects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No subjects found</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "Try searching with a different keyword"
                : "Create your first subject to get started"}
            </p>
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject._id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                  {subject.title.charAt(0).toUpperCase()}
                </div>
                <Badge
                  className={
                    subject.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  {subject.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
                {subject.title}
              </h3>

              {subject.code && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                  {subject.code}
                </p>
              )}

              {subject.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {subject.description}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => openEditDialog(subject)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => openDeleteDialog(subject)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Modal */}
      {editingSubject && (
        <UpdateSubjectModal
          subject={editingSubject}
          open={isEditOpen}
          onOpenChange={(val) => {
            setIsEditOpen(val);
            if (!val) setEditingSubject(null);
          }}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingSubject?.title}
              </span>
              ? It will be moved to trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubject}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}