// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import React, { useState } from "react";
// import {
//   Search, BookOpen, Edit2, Trash2, Star, Users,
//   Clock, CalendarDays, BadgeCheck, PlayCircle,
//   ArrowRight,
// } from "lucide-react";
// import { toast } from "sonner";

// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription,
//   AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { PageHeader } from "@/components/layout/page-header";

// import { useGetCoursesQuery, useSoftDeleteCourseMutation } from "@/redux/features/course/course.api";
// import { UpdateCourseModal } from "./UpdateCourseModal";
// import { CreateCourseModal } from "./CreateCourseModal";
// import Link from "next/link";
// import { useUser } from "@/context/UserContext";
// import { Role } from "@/types";


// // ─── Types ────────────────────────────────────────────────────────────────────

// interface CourseItem {
//   _id: string;
//   title: string;
//   slug?: string;
//   description?: string;
//   thumbnail?: string;
//   class?: { _id: string; title: string } | string;
//   batch?: string;
//   regularPrice?: number;
//   discountPrice?: number;
//   courseStartDate?: string;
//   courseEndDate?: string;
//   duration?: string;
//   totalClasses?: number;
//   status?: "upcoming" | "running" | "completed";
//   isFeatured?: boolean;
//   isActive?: boolean;
//   certificate?: boolean;
//   ratings?: number;
// }

// // ─── Status config ────────────────────────────────────────────────────────────

// const statusConfig = {
//   upcoming: { label: "Upcoming", dot: "bg-blue-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-amber-800 backdrop-blur-sm" },
//   running: { label: "Running", dot: "bg-emerald-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-green-700 border-blue-200 dark:text-green-400 dark:border-amber-800 backdrop-blur-sm" },
//   completed: { label: "Completed", dot: "bg-slate-400", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-amber-800 backdrop-blur-sm" },
// };

// export const getDashboardBasePath = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
//   switch (role) {
//     case "ADMIN":
//       return "/admin/dashboard";
//     case "TEACHER":
//       return "/teacher/dashboard";
//     case "STUDENT":
//       return "/student/dashboard";
//     default:
//       return "/";
//   }
// };

// // ─── Skeleton Card ────────────────────────────────────────────────────────────

// function CourseCardSkeleton() {
//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//       <Skeleton className="w-full h-44" />
//       <div className="p-4 space-y-3">
//         <Skeleton className="h-5 w-3/4" />
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-2/3" />
//         <div className="flex gap-2 pt-2">
//           <Skeleton className="h-8 flex-1 rounded-lg" />
//           <Skeleton className="h-8 w-8 rounded-lg" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ────────────────────────────────────────────────────────────

// export default function CourseManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [deletingCourse, setDeletingCourse] = useState<CourseItem | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   const { data: coursesData, isLoading, refetch } = useGetCoursesQuery({
//     searchTerm: searchTerm || undefined,
//     limit: 50,
//   });
//   const [softDeleteCourse, { isLoading: isDeleting }] = useSoftDeleteCourseMutation();

//   const courses = (coursesData as { data?: CourseItem[] })?.data ?? [];
//   const { user } = useUser();

//   const userRole = user?.role;
//   if (!userRole) return null;


//   const openEditDialog = (course: CourseItem) => { setEditingCourse(course); setIsEditOpen(true); };
//   const openDeleteDialog = (course: CourseItem) => { setDeletingCourse(course); setIsDeleteOpen(true); };

//   const handleDelete = async () => {
//     if (!deletingCourse) return;
//     try {
//       await softDeleteCourse(deletingCourse._id).unwrap();
//       toast.success("Course Deleted", { description: `"${deletingCourse.title}" Moved to trash` });
//       setIsDeleteOpen(false);
//       setDeletingCourse(null);
//       refetch();
//     } catch (error: any) {
//       toast.error("Failed to Delete", { description: error?.data?.message ?? "Failed to delete" });
//     }
//   };

//   const getClassName = (cls: CourseItem["class"]) =>
//     typeof cls === "object" && cls ? cls.title : "";

//   const formatPrice = (regular?: number, discount?: number) => {
//     if (!regular && !discount) return null;
//     if (discount && regular && discount < regular) {
//       return (
//         <div className="flex items-baseline gap-1.5">
//           <span className="text-lg font-bold text-slate-900 dark:text-white">৳{discount.toLocaleString()}</span>
//           <span className="text-xs text-slate-400 line-through">৳{regular.toLocaleString()}</span>
//           <span className="text-xs font-semibold text-emerald-600">
//             {Math.round(((regular - discount) / regular) * 100)}% Discount
//           </span>
//         </div>
//       );
//     }
//     return <span className="text-lg font-bold text-slate-900 dark:text-white">৳{(discount || regular)?.toLocaleString()}</span>;
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Course Management"
//         description="Create And Manage All Courses"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Course Management" },
//         ]}
//         action={<CreateCourseModal onSuccess={refetch} />}
//       />

//       {/* Search */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//         <Input
//           placeholder="Search with course title..."
//           className="pl-9 h-10"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Course Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//         {isLoading ? (
//           Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
//         ) : courses.length === 0 ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
//             <BookOpen className="w-14 h-14 mb-4 opacity-20" />
//             <p className="text-base font-medium">
//               {searchTerm ? "No Result Found" : "No Course Found"}
//             </p>
//             <p className="text-sm mt-1">
//               {searchTerm ? `No courses could be found with ${searchTerm}` : "Course found"}
//             </p>
//           </div>
//         ) : (
//           courses.map((course) => {
//             const status = course.status ?? "upcoming";
//             const cfg = statusConfig[status] ?? statusConfig.upcoming;
//             const className = getClassName(course.class);

//             return (
//               <div
//                 key={course._id}
//                 className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-400 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col group"
//               >
//                 {/* Thumbnail */}
//                 <div className="relative overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 h-44">
//                   {course.thumbnail ? (
//                     <img
//                       src={course.thumbnail}
//                       alt={course.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <PlayCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
//                     </div>
//                   )}

//                   {/* Overlay badges */}
//                   <div className="absolute top-2 left-2 flex flex-col gap-1.5">
//                     <Badge variant="outline" className={`text-[11px] px-2 py-0.5 border font-medium backdrop-blur-sm ${cfg.badge}`}>
//                       <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
//                       {cfg.label}
//                     </Badge>
//                     {course.isFeatured && (
//                       <Badge variant="outline" className="text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800 backdrop-blur-sm">
//                         <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" /> Featured
//                       </Badge>
//                     )}
//                   </div>

//                   {course.certificate && (
//                     <div className="absolute top-2 right-2">
//                       <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-sm" title="সার্টিফিকেট আছে">
//                         <BadgeCheck className="w-4 h-4 text-emerald-500" />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Card body */}
//                 <div className="p-4 border flex flex-col flex-1">

//                   {/* Class + batch tag */}
//                   <div className="flex items-center gap-1.5 mb-2 flex-wrap">
//                     {className && (
//                       <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
//                         {className}
//                       </span>
//                     )}
//                     {course.batch && (
//                       <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
//                         {course.batch}
//                       </span>
//                     )}
//                   </div>

//                   {/* Title */}
//                   <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
//                     {course.title}
//                   </h3>

//                   {/* Description */}
//                   {/* {course.description && (
//                     <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
//                       {course.description}
//                     </p>
//                   )} */}

//                   {/* Meta info */}
//                   <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-3 mt-auto">
//                     {course.totalClasses && (
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-3 h-3" /> {course.totalClasses} Class
//                       </span>
//                     )}
//                     {course.duration && (
//                       <span className="flex items-center gap-1">
//                         <CalendarDays className="w-3 h-3" /> {course.duration}
//                       </span>
//                     )}
//                   </div>

//                   {/* Price */}
//                   {(course.regularPrice || course.discountPrice) && (
//                     <div className="mb-3">
//                       {formatPrice(course.regularPrice, course.discountPrice)}
//                     </div>
//                   )}

//                   {/* Action buttons */}
//                   <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 ">

//                     {userRole === Role.ADMIN && <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1 text-xs h-8 cursor-pointer"
//                       onClick={() => openEditDialog(course)}
//                     >
//                       <Edit2 className="w-3.5 h-3.5 mr-1.5" />
//                       Update
//                     </Button>

//                     }

//                     <Link
//                       href={`${getDashboardBasePath(userRole)}/courses/view-course/${course.slug}`}
//                       className="block w-full">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex-1 text-xs h-8 w-full cursor-pointer"
//                       >
//                         <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
//                         Continue
//                       </Button>
//                     </Link>
//                     {userRole === Role.ADMIN && <Button
//                       variant="outline"
//                       size="sm"
//                       className="px-2.5 h-8 border-red-200 text-red-500 cursor-pointer hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
//                       onClick={() => openDeleteDialog(course)}
//                       title="Delete"
//                     >
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </Button>
//                     }
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Update Modal */}
//       {editingCourse && (
//         <UpdateCourseModal
//           course={editingCourse}
//           open={isEditOpen}
//           onOpenChange={(val) => { setIsEditOpen(val); if (!val) setEditingCourse(null); }}
//           onSuccess={refetch}
//         />
//       )}

//       {/* Delete Confirmation */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Course</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-slate-900 dark:text-white">
//                 {deletingCourse?.title}
//               </span>
//               {" "}?
//               It will be moved to the trash.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2 justify-end mt-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }




"use client";

import React, { useState, useMemo } from "react";
import {
  Search, BookOpen, Edit2, Trash2, Star, Clock,
  CalendarDays, BadgeCheck, PlayCircle, ArrowRight,
  ChevronUp, ChevronDown, ChevronsUpDown, X,
  DollarSign, Users, TrendingUp, BarChart3,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";

import { useGetCoursesQuery, useSoftDeleteCourseMutation } from "@/redux/features/course/course.api";
import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";
import { UpdateCourseModal } from "./UpdateCourseModal";
import { CreateCourseModal } from "./CreateCourseModal";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Role } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  class?: { _id: string; title: string } | string;
  batch?: string;
  regularPrice?: number;
  discountPrice?: number;
  courseStartDate?: string;
  courseEndDate?: string;
  duration?: string;
  totalClasses?: number;
  status?: "upcoming" | "running" | "completed";
  isFeatured?: boolean;
  isActive?: boolean;
  certificate?: boolean;
  ratings?: number;
}

// profile fields → client-side sort
type ProfileSortField = "title" | "batch" | "status" | "totalClasses" | "duration" | "regularPrice";
// analytics fields → server-side sort
type AnalyticsSortField = "totalRevenue" | "totalStudents";
type SortField = ProfileSortField | AnalyticsSortField;
type SortDir = "asc" | "desc" | null;

const ANALYTICS_SORT_FIELDS: AnalyticsSortField[] = ["totalRevenue", "totalStudents"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig = {
  upcoming: { label: "Upcoming", dot: "bg-blue-500", cls: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
  running: { label: "Running", dot: "bg-emerald-500", cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400" },
  completed: { label: "Completed", dot: "bg-slate-400", cls: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400" },
};

export const getDashboardBasePath = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
  switch (role) {
    case "ADMIN": return "/admin/dashboard";
    case "TEACHER": return "/teacher/dashboard";
    case "STUDENT": return "/student/dashboard";
    default: return "/";
  }
};

const getClassName = (cls: CourseItem["class"]) =>
  typeof cls === "object" && cls ? cls.title : "";

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function CourseRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableCell key={i}><Skeleton className="h-4 w-16" /></TableCell>
      ))}
      <TableCell>
        <div className="flex gap-1.5 justify-end">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: "emerald" | "blue" | "violet" | "amber";
}) {
  const colorMap = {
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400" },
    violet: { bg: "bg-violet-50 dark:bg-violet-900/20", icon: "text-violet-600 dark:text-violet-400", text: "text-violet-600 dark:text-violet-400" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400" },
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

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, sortField, sortDir }: {
  field: SortField; sortField: SortField | null; sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-blue-500" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-blue-500" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<CourseItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { user } = useUser();
  const userRole = user?.role;
  if (!userRole) return null;

  const isAnalyticsSort = sortField
    ? (ANALYTICS_SORT_FIELDS as string[]).includes(sortField)
    : false;

  const analyticsParams = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(isAnalyticsSort && sortField && { sortBy: sortField }),
    ...(isAnalyticsSort && sortDir && { sortOrder: sortDir }),
  };

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAllAnalyticsQuery(analyticsParams);

    console.log("all analytics data in course management", analyticsData)

  const { data: coursesData, isLoading, refetch } = useGetCoursesQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });
  const [softDeleteCourse, { isLoading: isDeleting }] = useSoftDeleteCourseMutation();

  // ── Derived analytics ──
  const courseSummary = analyticsData?.data?.revenue?.courseRevenue?.summary;
  const totalRevenue = analyticsData?.data?.revenue?.totalRevenue?.totalRevenue ?? 0;

  // courseId → revenue/students map
  const courseRevenueMap = useMemo(() => {
    const map: Record<string, { totalRevenue: number; totalStudents: number }> = {};
    (analyticsData?.data?.revenue?.courseRevenue?.courses ?? []).forEach((c: any) => {
      map[c.courseId] = {
        totalRevenue: c.totalRevenue,
        totalStudents: c.totalStudents,
      };
    });
    return map;
  }, [analyticsData]);

  const allCourses: CourseItem[] = (coursesData as { data?: CourseItem[] })?.data ?? [];

  const hasActiveFilters = statusFilter !== "all";
  const hasDateFilter = !!(startDate || endDate);

  // client-side status filter
  const filtered = useMemo(() => {
    if (statusFilter === "all") return allCourses;
    return allCourses.filter((c) => (c.status ?? "upcoming") === statusFilter);
  }, [allCourses, statusFilter]);

  // sort logic
  const displayCourses = useMemo(() => {
    if (!sortField || !sortDir) return filtered;

    // analytics sort → reorder by backend-returned analytics order
    if (isAnalyticsSort) {
      const analyticsOrder = (analyticsData?.data?.revenue?.courseRevenue?.courses ?? [])
        .map((c: any) => c.courseId);

      const inMap = filtered.filter((c) => analyticsOrder.includes(c._id));
      const notInMap = filtered.filter((c) => !analyticsOrder.includes(c._id));

      inMap.sort(
        (a, b) => analyticsOrder.indexOf(a._id) - analyticsOrder.indexOf(b._id)
      );

      return [...inMap, ...notInMap];
    }

    // profile sort → client-side
    return [...filtered].sort((a, b) => {
      const aVal: any = a[sortField as ProfileSortField] ?? "";
      const bVal: any = b[sortField as ProfileSortField] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number")
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortField, sortDir, isAnalyticsSort, analyticsData]);

  // ── Handlers ──
  const handleSort = (field: SortField) => {
    if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortField(null); setSortDir(null);
  };

  const clearFilters = () => setStatusFilter("all");
  const clearDateFilter = () => { setStartDate(""); setEndDate(""); };

  const openEditDialog = (c: CourseItem) => { setEditingCourse(c); setIsEditOpen(true); };
  const openDeleteDialog = (c: CourseItem) => { setDeletingCourse(c); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!deletingCourse) return;
    try {
      await softDeleteCourse(deletingCourse._id).unwrap();
      toast.success("Course Deleted", { description: `"${deletingCourse.title}" moved to trash` });
      setIsDeleteOpen(false);
      setDeletingCourse(null);
      refetch();
    } catch (error: any) {
      toast.error("Failed to Delete", { description: error?.data?.message ?? "Failed to delete" });
    }
  };

  const SortableTh = ({ field, label }: { field: SortField; label: string }) => (
    <TableHead
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
        {label}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </span>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Create and manage all courses"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Course Management" },
        ]}
        action={<CreateCourseModal onSuccess={refetch} />}
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date filter */}
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
              label="Total Course Revenue"
              value={`৳${(courseSummary?.totalRevenue ?? 0).toLocaleString()}`}
              sub={`${courseSummary?.totalCourses ?? 0} revenue-generating courses`}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              label="Total Students"
              value={courseSummary?.totalStudents ?? 0}
              sub="Enrolled with completed payment"
              icon={Users}
              color="blue"
            />
            <StatCard
              label="Total Courses"
              value={courseSummary?.totalCourses ?? 0}
              sub="With at least one enrollment"
              icon={BookOpen}
              color="violet"
            />
            <StatCard
              label="Overall Revenue"
              value={`৳${totalRevenue.toLocaleString()}`}
              sub={`${analyticsData?.data?.totalRevenue?.totalTransactions ?? 0} transactions`}
              icon={TrendingUp}
              color="amber"
            />
          </>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by course title..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(String(v))}
          >
          <SelectTrigger className="w-44! h-9 text-sm">
            <span>
              {statusFilter === "all"
                ? "All Statuses"
                : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} title="Clear filters" className="shrink-0">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <SortableTh field="title" label="Course" />
                <SortableTh field="batch" label="Batch" />
                <SortableTh field="status" label="Status" />
                <SortableTh field="totalClasses" label="Classes" />
                <SortableTh field="duration" label="Duration" />
                <SortableTh field="regularPrice" label="Price" />
                <SortableTh field="totalStudents" label="Students" />
                <SortableTh field="totalRevenue" label="Revenue" />
                <TableHead className="whitespace-nowrap">Badges</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <CourseRowSkeleton key={i} />)
              ) : displayCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                      {searchTerm || hasActiveFilters ? (
                        <>
                          <p className="text-base font-medium">No results found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-medium">No courses added yet</p>
                          <p className="text-sm mt-1">Click the Add Course button to get started</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayCourses.map((course) => {
                  const status = course.status ?? "upcoming";
                  const cfg = statusConfig[status] ?? statusConfig.upcoming;
                  const className = getClassName(course.class);
                  const price = course.discountPrice ?? course.regularPrice;
                  const rev = courseRevenueMap[course._id];

                  return (
                    <TableRow
                      key={course._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Thumbnail + Title */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PlayCircle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate max-w-52 text-sm">
                              {course.title}
                            </p>
                            {className && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {className}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Batch */}
                      <TableCell>
                        {course.batch ? (
                          <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                            {course.batch}
                          </span>
                        ) : <span className="text-slate-400">—</span>}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant="outline" className={cfg.cls}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
                          {cfg.label}
                        </Badge>
                      </TableCell>

                      {/* Classes */}
                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                        {course.totalClasses ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {course.totalClasses}
                          </span>
                        ) : "—"}
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                        {course.duration ? (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            {course.duration}
                          </span>
                        ) : "—"}
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        {price ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              ৳{price.toLocaleString()}
                            </span>
                            {course.discountPrice && course.regularPrice &&
                              course.discountPrice < course.regularPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  ৳{course.regularPrice.toLocaleString()}
                                </span>
                              )}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </TableCell>

                      {/* Students (analytics) */}
                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                        {rev ? (
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                            {rev.totalStudents}
                          </span>
                        ) : <span className="text-slate-400">—</span>}
                      </TableCell>

                      {/* Revenue (analytics) */}
                      <TableCell className="text-sm font-medium">
                        {rev ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ৳{rev.totalRevenue.toLocaleString()}
                          </span>
                        ) : <span className="text-slate-400">—</span>}
                      </TableCell>

                      {/* Badges */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {course.isFeatured && (
                            <span title="Featured">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            </span>
                          )}
                          {course.certificate && (
                            <span title="Certificate">
                              <BadgeCheck className="w-4 h-4 text-emerald-500" />
                            </span>
                          )}
                          {!course.isFeatured && !course.certificate && (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-1.5 justify-end">
                          <Link href={`${getDashboardBasePath(userRole)}/courses/view-course/${course.slug}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8" title="View course">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          {userRole === Role.ADMIN && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                title="Edit course"
                                onClick={() => openEditDialog(course)}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                title="Delete course"
                                onClick={() => openDeleteDialog(course)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        {!isLoading && displayCourses.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {displayCourses.length}
              </span>{" "}
              course{displayCourses.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {editingCourse && (
        <UpdateCourseModal
          course={editingCourse}
          open={isEditOpen}
          onOpenChange={(val) => { setIsEditOpen(val); if (!val) setEditingCourse(null); }}
          onSuccess={refetch}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingCourse?.title}</strong>? It will be moved to the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}