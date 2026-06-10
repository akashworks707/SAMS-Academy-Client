// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useState } from "react";
// import { BookOpen, Users, UserCheck, Layers, Search, Edit2, Trash2 } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { StatCard } from "@/components/cards/stat-card";
// import { PageHeader } from "@/components/layout/page-header";

// import {
//   useGetClassesQuery,
//   useSoftDeleteClassMutation,
// } from "@/redux/features/class/class.api";
// import CreateClassModal from "./CreateClassModal";
// import UpdateClassModal from "./UpdateClassModal";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface ClassItem {
//   _id: string;
//   title: string;
//   description?: string;
//   isActive: boolean;
// }

// // ─── Static Stats ─────────────────────────────────────────────────────────────

// const stats = [
//   {
//     title: "Total Classes",
//     value: 56,
//     icon: <BookOpen className="w-6 h-6" />,
//     trend: 8.3,
//     trendDirection: "up" as const,
//     color: "blue" as const,
//     description: "Active classes",
//   },
//   {
//     title: "Active Learning Modules",
//     value: 48,
//     icon: <Layers className="w-6 h-6" />,
//     trend: 5.7,
//     trendDirection: "up" as const,
//     color: "green" as const,
//     description: "Learning modules",
//   },
//   {
//     title: "Total Enrolled Students",
//     value: 1245,
//     icon: <Users className="w-6 h-6" />,
//     trend: 12.5,
//     trendDirection: "up" as const,
//     color: "purple" as const,
//     description: "Across all classes",
//   },
//   {
//     title: "Average Class Size",
//     value: 25,
//     icon: <UserCheck className="w-6 h-6" />,
//     trend: 3.2,
//     trendDirection: "up" as const,
//     color: "orange" as const,
//     description: "Students per class",
//   },
// ];

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function ClassesManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   // ── RTK Query ──
//   const {
//     data: classesData,
//     isLoading,
//     refetch,
//   } = useGetClassesQuery({
//     searchTerm: searchTerm || undefined,
//     limit: 50,
//   });

//   const [softDeleteClass, { isLoading: isDeleting }] = useSoftDeleteClassMutation();

//   const classes = (classesData as { data?: ClassItem[] })?.data ?? [];

//   // ── Filtered by search (client-side fallback) ──
//   const filtered = classes.filter((c) =>
//     c.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const openEditDialog = (classItem: ClassItem) => {
//     setEditingClass(classItem);
//     setIsEditOpen(true);
//   };

//   const openDeleteDialog = (classItem: ClassItem) => {
//     setDeletingClass(classItem);
//     setIsDeleteOpen(true);
//   };

//   const handleDeleteClass = async () => {
//     if (!deletingClass) return;
//     try {
//       await softDeleteClass(deletingClass._id).unwrap();
//       toast.success("Class removed", {
//         description: `"${deletingClass.title}" has been moved to trash.`,
//       });
//       setIsDeleteOpen(false);
//       setDeletingClass(null);
//       refetch();
//     } catch (error: any) {
//       toast.error("Delete failed", {
//         description: error?.data?.message ?? "There was a problem deleting the class.",
//       });
//     }
//   };

//   // ── Render ────────────────────────────────────────────────────────────────

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <PageHeader
//         title="Classes Management"
//         description="Manage all classes and learning modules"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Classes" },
//         ]}
//         action={<CreateClassModal onSuccess={refetch} />}
//       />

//       {/* Stat Cards */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((card, index) => (
//           <StatCard
//             key={index}
//             title={card.title}
//             value={card.value}
//             icon={card.icon}
//             trend={card.trend}
//             trendDirection={card.trendDirection}
//             color={card.color}
//             description={card.description}
//           />
//         ))}
//       </div> */}

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <Input
//           placeholder="Search by class name..."
//           className="pl-9 h-10"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Classes Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//         {isLoading ? (
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
//         ) : filtered.length === 0 ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
//             <BookOpen className="w-12 h-12 mb-3 opacity-30" />
//             <p className="font-medium">No classes found</p>
//             <p className="text-sm mt-1">
//               {searchTerm
//                 ? "Try searching with a different keyword"
//                 : "Create your first class to get started"}
//             </p>
//           </div>
//         ) : (
//           filtered.map((classItem) => (
//             <div
//               key={classItem._id}
//               className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center font-bold text-green-600 dark:text-green-400 text-lg">
//                   {classItem.title.charAt(0).toUpperCase()}
//                 </div>
//                 <Badge
//                   className={
//                     classItem.isActive
//                       ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100"
//                       : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
//                   }
//                 >
//                   <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${classItem.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
//                   {classItem.isActive ? "Active" : "Inactive"}
//                 </Badge>
//               </div>

//               <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
//                 {classItem.title}
//               </h3>

//               {classItem.description && (
//                 <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
//                   {classItem.description}
//                 </p>
//               )}

//               <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 text-xs h-8"
//                   onClick={() => openEditDialog(classItem)}
//                 >
//                   <Edit2 className="w-3.5 h-3.5 mr-1.5" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
//                   onClick={() => openDeleteDialog(classItem)}
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
//       {editingClass && (
//         <UpdateClassModal
//           classItem={editingClass}
//           open={isEditOpen}
//           onOpenChange={(val) => {
//             setIsEditOpen(val);
//             if (!val) setEditingClass(null);
//           }}
//           onSuccess={refetch}
//         />
//       )}

//       {/* Delete Confirmation */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Class</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-slate-900 dark:text-white">
//                 {deletingClass?.title}
//               </span>
//               ? It will be moved to trash.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2 justify-end mt-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeleteClass}
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
  BookOpen,
  Users,
  UserCheck,
  Layers,
  Search,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  GraduationCap,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/layout/page-header";

import {
  useGetClassesQuery,
  useSoftDeleteClassMutation,
} from "@/redux/features/class/class.api";
import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";
import CreateClassModal from "./CreateClassModal";
import UpdateClassModal from "./UpdateClassModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassItem {
  _id: string;
  title: string;
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

export default function ClassesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const hasDateFilter = !!(startDate || endDate);

  // ── RTK Query ──
  const analyticsParams = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAllAnalyticsQuery(analyticsParams);

  const {
    data: classesData,
    isLoading,
    refetch,
  } = useGetClassesQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });

  const [softDeleteClass, { isLoading: isDeleting }] = useSoftDeleteClassMutation();

  const classes = (classesData as { data?: ClassItem[] })?.data ?? [];

  const filtered = classes.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Derived analytics ──
  const stats = analyticsData?.data?.stats;
  const totalRevenue = analyticsData?.data?.revenue?.totalRevenue?.totalRevenue ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const clearDateFilter = () => { setStartDate(""); setEndDate(""); };

  const openEditDialog = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (classItem: ClassItem) => {
    setDeletingClass(classItem);
    setIsDeleteOpen(true);
  };

  const handleDeleteClass = async () => {
    if (!deletingClass) return;
    try {
      await softDeleteClass(deletingClass._id).unwrap();
      toast.success("Class removed", {
        description: `"${deletingClass.title}" has been moved to trash.`,
      });
      setIsDeleteOpen(false);
      setDeletingClass(null);
      refetch();
    } catch (error: any) {
      toast.error("Delete failed", {
        description: error?.data?.message ?? "There was a problem deleting the class.",
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Classes Management"
        description="Manage all classes and learning modules"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Classes" },
        ]}
        action={<CreateClassModal onSuccess={refetch} />}
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
              label="Total Classes"
              value={stats?.totalClasses ?? 0}
              sub={`${stats?.totalSubjects ?? 0} total subjects`}
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
              label="Total Students"
              value={stats?.totalStudents ?? 0}
              sub={`${stats?.totalEnrollments ?? 0} total enrollments`}
              icon={Users}
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
          placeholder="Search by class name..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
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
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No classes found</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "Try searching with a different keyword"
                : "Create your first class to get started"}
            </p>
          </div>
        ) : (
          filtered.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center font-bold text-green-600 dark:text-green-400 text-lg">
                  {classItem.title.charAt(0).toUpperCase()}
                </div>
                <Badge
                  className={
                    classItem.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
                      classItem.isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {classItem.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
                {classItem.title}
              </h3>

              {classItem.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {classItem.description}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => openEditDialog(classItem)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => openDeleteDialog(classItem)}
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
      {editingClass && (
        <UpdateClassModal
          classItem={editingClass}
          open={isEditOpen}
          onOpenChange={(val) => {
            setIsEditOpen(val);
            if (!val) setEditingClass(null);
          }}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingClass?.title}
              </span>
              ? It will be moved to trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
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