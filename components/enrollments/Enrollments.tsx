// "use client";

// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Edit2,
//   Search,
//   BookOpen,
//   Eye,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
//   Archive,
// } from "lucide-react";
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
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { PageHeader } from "@/components/layout/page-header";

// import {
//   useGetAllEnrollmentsQuery,
//   useSoftDeleteEnrollmentMutation,
// } from "@/redux/features/enrollment/enrollment.api";
// import { useGetCoursesQuery } from "@/redux/features/course/course.api"; // adjust if needed
// import { EnrollmentDetailsModal } from "./EnrollmentDetailsModal";
// import { Pagination } from "../pagination/pagination"; // adjust if needed
// import { CreateEnrollmentModal } from "./CreateEnrollment";
// import { UpdateEnrollmentModal } from "./UpdateEnrollment";

// // ─── Types ─────────────────────────────────────────────────────────────────────

// type SortField = "student" | "course" | "status" | "progress" | "createdAt";
// type SortDir = "asc" | "desc" | null;
// type EnrollmentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

// // ─── Status Badge ───────────────────────────────────────────────────────────────

// function StatusBadge({ status }: { status: EnrollmentStatus }) {
//   const map: Record<EnrollmentStatus, string> = {
//     COMPLETED:
//       "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
//     PENDING:
//       "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
//     FAILED:
//       "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
//     CANCELLED:
//       "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
//   };
//   const dot: Record<EnrollmentStatus, string> = {
//     COMPLETED: "bg-emerald-500",
//     PENDING: "bg-amber-500",
//     FAILED: "bg-red-500",
//     CANCELLED: "bg-slate-400",
//   };
//   return (
//     <Badge variant="outline" className={map[status] ?? ""}>
//       <span
//         className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${dot[status] ?? "bg-slate-400"}`}
//       />
//       {status.charAt(0) + status.slice(1).toLowerCase()}
//     </Badge>
//   );
// }

// // ─── Skeleton Row ───────────────────────────────────────────────────────────────

// function EnrollmentRowSkeleton() {
//   return (
//     <TableRow>
//       <TableCell>
//         <div className="flex items-center gap-3">
//           <Skeleton className="w-9 h-9 rounded-full shrink-0" />
//           <div className="space-y-1.5">
//             <Skeleton className="h-4 w-28" />
//             <Skeleton className="h-3 w-36" />
//           </div>
//         </div>
//       </TableCell>
//       <TableCell><Skeleton className="h-4 w-40" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell>
//         <div className="flex gap-1.5 justify-end">
//           <Skeleton className="h-8 w-8 rounded-md" />
//           <Skeleton className="h-8 w-8 rounded-md" />
//           <Skeleton className="h-8 w-8 rounded-md" />
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// }

// // ─── Sort Icon ──────────────────────────────────────────────────────────────────

// function SortIcon({
//   field,
//   sortField,
//   sortDir,
// }: {
//   field: SortField;
//   sortField: SortField | null;
//   sortDir: SortDir;
// }) {
//   if (sortField !== field)
//     return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
//   return sortDir === "asc" ? (
//     <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
//   ) : (
//     <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />
//   );
// }

// // ─── Progress Bar ───────────────────────────────────────────────────────────────

// function ProgressBar({ value }: { value: number }) {
//   const pct = Math.min(100, Math.max(0, value));
//   return (
//     <div className="flex items-center gap-2 min-w-20">
//       <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
//         <div
//           className="h-full bg-emerald-500 rounded-full transition-all"
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//       <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{pct}%</span>
//     </div>
//   );
// }

// // ─── Main Component ─────────────────────────────────────────────────────────────

// export default function EnrollmentManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [courseFilter, setCourseFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortField, setSortField] = useState<SortField | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>(null);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const [editingEnrollment, setEditingEnrollment] = useState<any | null>(null);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [viewingEnrollment, setViewingEnrollment] = useState<any | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [deletingEnrollment, setDeletingEnrollment] = useState<any | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);

//   const { data, isLoading, refetch } = useGetAllEnrollmentsQuery({
//     searchTerm: searchTerm || undefined,
//     course: courseFilter !== "all" ? courseFilter : undefined,
//     status: statusFilter !== "all" ? statusFilter : undefined,
//     page,
//     limit,
//   });

//   const { data: coursesData } = useGetCoursesQuery({ limit: 100 });

//   const [softDelete, { isLoading: isDeleting }] = useSoftDeleteEnrollmentMutation();

//   const enrollments: any[] = data?.data ?? [];
//   const meta = data?.meta;
//   const totalPage = meta?.totalPage || 1;

//   const hasActiveFilters = courseFilter !== "all" || statusFilter !== "all";

//   // reset to page 1 on filter/search change
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, courseFilter, statusFilter]);

//   // ── Client-side sort only (filtering is server-side via params) ──
//   const sorted = useMemo(() => {
//     if (!sortField || !sortDir) return enrollments;
//     return [...enrollments].sort((a, b) => {
//       let valA: any;
//       let valB: any;
//       if (sortField === "student") {
//         valA = a.student?.name ?? "";
//         valB = b.student?.name ?? "";
//       } else if (sortField === "course") {
//         valA = a.course?.title ?? "";
//         valB = b.course?.title ?? "";
//       } else {
//         valA = a[sortField] ?? "";
//         valB = b[sortField] ?? "";
//       }
//       const cmp =
//         typeof valA === "number" && typeof valB === "number"
//           ? valA - valB
//           : String(valA).localeCompare(String(valB));
//       return sortDir === "asc" ? cmp : -cmp;
//     });
//   }, [enrollments, sortField, sortDir]);

//   // ── Handlers ──
//   const handleSort = (field: SortField) => {
//     if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
//     if (sortDir === "asc") { setSortDir("desc"); return; }
//     setSortField(null); setSortDir(null);
//   };

//   const clearFilters = () => { setCourseFilter("all"); setStatusFilter("all"); };

//   const openEditDialog = (e: any) => { setEditingEnrollment(e); setIsUpdateOpen(true); };
//   const openDetailsDialog = (e: any) => { setViewingEnrollment(e); setIsDetailsOpen(true); };
//   const openDeleteDialog = (e: any) => { setDeletingEnrollment(e); setIsDeleteOpen(true); };

//   const handleDelete = async () => {
//     if (!deletingEnrollment) return;
//     try {
//       await softDelete(deletingEnrollment._id).unwrap();
//       toast.success("Enrollment archived successfully");
//       setIsDeleteOpen(false);
//       setDeletingEnrollment(null);
//       refetch();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to archive enrollment");
//     }
//   };

//   const SortableTh = ({ field, label }: { field: SortField; label: string }) => (
//     <TableHead
//       className="cursor-pointer select-none whitespace-nowrap"
//       onClick={() => handleSort(field)}
//     >
//       <span className="inline-flex items-center hover:text-slate-900 dark:hover:text-white transition-colors">
//         {label}
//         <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
//       </span>
//     </TableHead>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <PageHeader
//         title="Enrollment Management"
//         description="Manage all course enrollments and track student progress"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Enrollment Management" },
//         ]}
//         action={<CreateEnrollmentModal onSuccess={refetch} />}
//       />

//       {/* Search + Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         {/* Search */}
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <Input
//             placeholder="Search by student name, student ID or transaction ID..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {/* Course Filter */}
//         <Select
//           value={courseFilter}
//           onValueChange={(v) => setCourseFilter(String(v))}
//         >
//           <SelectTrigger className="w-full sm:w-48 sm:shrink-0 h-9 text-sm">
//             <span className="truncate block max-w-40">
//               {courseFilter === "all"
//                 ? "All Courses"
//                 : coursesData?.data?.find((c: any) => c._id === courseFilter)?.title ||
//                   "Select course"}
//             </span>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Courses</SelectItem>
//             {coursesData?.data?.map((course: any) => (
//               <SelectItem key={course._id} value={course._id}>
//                 {course.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Status Filter */}
//         <Select
//           value={statusFilter}
//           onValueChange={(v) => setStatusFilter(String(v))}
//         >
//           <SelectTrigger className="w-full sm:w-36 sm:shrink-0 h-9 text-sm">
//             <span className="truncate block">
//               {statusFilter === "all"
//                 ? "All Statuses"
//                 : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
//             </span>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Statuses</SelectItem>
//             <SelectItem value="COMPLETED">Completed</SelectItem>
//             <SelectItem value="PENDING">Pending</SelectItem>
//             <SelectItem value="FAILED">Failed</SelectItem>
//             <SelectItem value="CANCELLED">Cancelled</SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Clear */}
//         {hasActiveFilters && (
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={clearFilters}
//             title="Clear filters"
//             className="shrink-0"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         )}
//       </div>

//       {/* Active Filter Badges */}
//       {hasActiveFilters && (
//         <div className="flex flex-wrap gap-2">
//           {courseFilter !== "all" && (
//             <Badge
//               variant="secondary"
//               className="gap-1.5 pr-1 cursor-pointer"
//               onClick={() => setCourseFilter("all")}
//             >
//               Course:{" "}
//               {coursesData?.data?.find((c: any) => c._id === courseFilter)?.title ?? courseFilter}
//               <X className="w-3 h-3" />
//             </Badge>
//           )}
//           {statusFilter !== "all" && (
//             <Badge
//               variant="secondary"
//               className="gap-1.5 pr-1 cursor-pointer"
//               onClick={() => setStatusFilter("all")}
//             >
//               Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
//               <X className="w-3 h-3" />
//             </Badge>
//           )}
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-slate-50 dark:bg-slate-800/50">
//                 <SortableTh field="student" label="Student" />
//                 <SortableTh field="course" label="Course" />
//                 <TableHead className="whitespace-nowrap">Transaction ID</TableHead>
//                 <SortableTh field="status" label="Status" />
//                 {/* <SortableTh field="progress" label="Progress" /> */}
//                 <SortableTh field="createdAt" label="Enrolled At" />
//                 <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 Array.from({ length: 6 }).map((_, i) => <EnrollmentRowSkeleton key={i} />)
//               ) : sorted.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7}>
//                     <div className="flex flex-col items-center justify-center py-16 text-slate-400">
//                       <BookOpen className="w-12 h-12 mb-4 opacity-30" />
//                       {searchTerm || hasActiveFilters ? (
//                         <>
//                           <p className="text-base font-medium">No results found</p>
//                           <p className="text-sm mt-1">Try adjusting your search or filters</p>
//                         </>
//                       ) : (
//                         <>
//                           <p className="text-base font-medium">No enrollments yet</p>
//                           <p className="text-sm mt-1">Click the Add Enrollment button to get started</p>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 sorted.map((enrollment) => {
//                   const student = enrollment.student;
//                   const course = enrollment.course;
//                   const enrolledAt = enrollment.createdAt
//                     ? new Date(enrollment.createdAt).toLocaleDateString("en-GB", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })
//                     : "—";

//                   return (
//                     <TableRow
//                       key={enrollment._id}
//                       className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
//                     >
//                       {/* Student */}
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           {student?.picture ? (
//                             <img
//                               src={student.picture}
//                               alt={student.name}
//                               className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
//                             />
//                           ) : (
//                             <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
//                               {student?.name?.charAt(0)?.toUpperCase() ?? "S"}
//                             </div>
//                           )}
//                           <div className="min-w-0">
//                             <p className="font-medium text-slate-900 dark:text-white truncate max-w-40">
//                               {student?.name ?? "—"}
//                             </p>
//                             <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-40">
//                               {student?.studentId ?? student?.email ?? "—"}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>

//                       {/* Course */}
//                       <TableCell>
//                         <div className="flex items-center gap-2 min-w-0">
//                           {course?.thumbnail ? (
//                             <img
//                               src={course.thumbnail}
//                               alt={course.title}
//                               className="w-8 h-8 rounded object-cover shrink-0"
//                             />
//                           ) : (
//                             <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
//                               <BookOpen className="w-4 h-4 text-slate-400" />
//                             </div>
//                           )}
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-40">
//                               {course?.title ?? "—"}
//                             </p>
//                             {course?.batch && (
//                               <p className="text-xs text-slate-500 dark:text-slate-400">
//                                 {course.batch}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </TableCell>

//                       {/* Transaction ID */}
//                       <TableCell>
//                         <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
//                           {enrollment.transactionId ?? "—"}
//                         </span>
//                       </TableCell>

//                       {/* Status */}
//                       <TableCell>
//                         <StatusBadge status={enrollment.status} />
//                       </TableCell>

//                       {/* Progress */}
//                       {/* <TableCell>
//                         <ProgressBar value={enrollment.progress ?? 0} />
//                       </TableCell> */}

//                       {/* Enrolled At */}
//                       <TableCell className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
//                         {enrolledAt}
//                       </TableCell>

//                       {/* Actions */}
//                       <TableCell>
//                         <div className="flex gap-1.5 justify-end">
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-8 w-8"
//                             title="View details"
//                             onClick={() => openDetailsDialog(enrollment)}
//                           >
//                             <Eye className="w-3.5 h-3.5" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-8 w-8"
//                             title="Edit enrollment"
//                             onClick={() => openEditDialog(enrollment)}
//                           >
//                             <Edit2 className="w-3.5 h-3.5" />
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="icon"
//                             className="h-8 w-8"
//                             title="Archive enrollment"
//                             onClick={() => openDeleteDialog(enrollment)}
//                           >
//                             <Archive className="w-3.5 h-3.5" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>

//           <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />
//         </div>

//         {/* Footer */}
//         {!isLoading && sorted.length > 0 && (
//           <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Showing{" "}
//               <span className="font-semibold text-slate-700 dark:text-slate-300">
//                 {sorted.length}
//               </span>{" "}
//               enrollment{sorted.length !== 1 ? "s" : ""}
//               {hasActiveFilters && " (filtered)"}
//             </p>
//             {totalPage > 1 && (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Page {page} of {totalPage}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Update Modal */}
//       {editingEnrollment && (
//         <UpdateEnrollmentModal
//           open={isUpdateOpen}
//           onOpenChange={setIsUpdateOpen}
//           item={editingEnrollment}
//           onSuccess={refetch}
//         />
//       )}

//       {/* Details Modal */}
//       {viewingEnrollment && (
//         <EnrollmentDetailsModal
//           open={isDetailsOpen}
//           onOpenChange={setIsDetailsOpen}
//           item={viewingEnrollment}
//         />
//       )}

//       {/* Archive Confirmation */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Archive Enrollment</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to archive the enrollment for{" "}
//               <strong>{deletingEnrollment?.student?.name}</strong> in{" "}
//               <strong>{deletingEnrollment?.course?.title}</strong>? The record
//               will be moved to trash and can be restored later.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
//             >
//               {isDeleting ? "Archiving..." : "Archive"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }




"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Edit2,
  Search,
  BookOpen,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  Archive,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";

import {
  useGetAllEnrollmentsQuery,
  useSoftDeleteEnrollmentMutation,
} from "@/redux/features/enrollment/enrollment.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";
import { EnrollmentDetailsModal } from "./EnrollmentDetailsModal";
import { Pagination } from "../pagination/pagination";
import { CreateEnrollmentModal } from "./CreateEnrollment";
import { UpdateEnrollmentModal } from "./UpdateEnrollment";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortField = "student" | "course" | "status" | "progress" | "createdAt";
type SortDir = "asc" | "desc" | null;
type EnrollmentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

// ─── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const map: Record<EnrollmentStatus, string> = {
    COMPLETED:  "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    PENDING:    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    FAILED:     "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
    CANCELLED:  "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
  };
  const dot: Record<EnrollmentStatus, string> = {
    COMPLETED: "bg-emerald-500",
    PENDING:   "bg-amber-500",
    FAILED:    "bg-red-500",
    CANCELLED: "bg-slate-400",
  };
  return (
    <Badge variant="outline" className={map[status] ?? ""}>
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${dot[status] ?? "bg-slate-400"}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── Skeleton Row ───────────────────────────────────────────────────────────────

function EnrollmentRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
    blue:    { bg: "bg-blue-50 dark:bg-blue-900/20",       icon: "text-blue-600 dark:text-blue-400",       text: "text-blue-600 dark:text-blue-400"       },
    violet:  { bg: "bg-violet-50 dark:bg-violet-900/20",   icon: "text-violet-600 dark:text-violet-400",   text: "text-violet-600 dark:text-violet-400"   },
    amber:   { bg: "bg-amber-50 dark:bg-amber-900/20",     icon: "text-amber-600 dark:text-amber-400",     text: "text-amber-600 dark:text-amber-400"     },
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

// ─── Sort Icon ──────────────────────────────────────────────────────────────────

function SortIcon({ field, sortField, sortDir }: {
  field: SortField; sortField: SortField | null; sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />;
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function EnrollmentManagement() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField]       = useState<SortField | null>(null);
  const [sortDir, setSortDir]           = useState<SortDir>(null);
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [page, setPage]                 = useState(1);
  const limit = 10;

  const [editingEnrollment, setEditingEnrollment]   = useState<any | null>(null);
  const [isUpdateOpen, setIsUpdateOpen]             = useState(false);
  const [viewingEnrollment, setViewingEnrollment]   = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen]           = useState(false);
  const [deletingEnrollment, setDeletingEnrollment] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen]             = useState(false);

  const analyticsParams = {
    ...(startDate && { startDate }),
    ...(endDate   && { endDate }),
  };

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useGetAllAnalyticsQuery(analyticsParams);

  const { data, isLoading, refetch } = useGetAllEnrollmentsQuery({
    searchTerm: searchTerm || undefined,
    course: courseFilter !== "all" ? courseFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit,
  });

  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });
  const [softDelete, { isLoading: isDeleting }] = useSoftDeleteEnrollmentMutation();

  // ── Derived analytics ──
  const stats           = analyticsData?.data?.stats;
  const enrollmentSummary = analyticsData?.data?.enrollments?.summary;
  const totalRevenue    = analyticsData?.data?.revenue?.totalRevenue?.totalRevenue ?? 0;

  const enrollments: any[] = data?.data ?? [];
  const meta      = data?.meta;
  const totalPage = meta?.totalPage || 1;

  const hasActiveFilters = courseFilter !== "all" || statusFilter !== "all";
  const hasDateFilter    = !!(startDate || endDate);

  useEffect(() => { setPage(1); }, [searchTerm, courseFilter, statusFilter]);

  // ── Client-side sort ──
  const sorted = useMemo(() => {
    if (!sortField || !sortDir) return enrollments;
    return [...enrollments].sort((a, b) => {
      let valA: any;
      let valB: any;
      if (sortField === "student") {
        valA = a.student?.name ?? "";
        valB = b.student?.name ?? "";
      } else if (sortField === "course") {
        valA = a.course?.title ?? "";
        valB = b.course?.title ?? "";
      } else {
        valA = a[sortField] ?? "";
        valB = b[sortField] ?? "";
      }
      const cmp =
        typeof valA === "number" && typeof valB === "number"
          ? valA - valB
          : String(valA).localeCompare(String(valB));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [enrollments, sortField, sortDir]);

  // ── Handlers ──
  const handleSort = (field: SortField) => {
    if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
    if (sortDir === "asc")   { setSortDir("desc");                      return; }
    setSortField(null); setSortDir(null);
  };

  const clearFilters    = () => { setCourseFilter("all"); setStatusFilter("all"); };
  const clearDateFilter = () => { setStartDate(""); setEndDate(""); };

  const openEditDialog    = (e: any) => { setEditingEnrollment(e);  setIsUpdateOpen(true);  };
  const openDetailsDialog = (e: any) => { setViewingEnrollment(e);  setIsDetailsOpen(true); };
  const openDeleteDialog  = (e: any) => { setDeletingEnrollment(e); setIsDeleteOpen(true);  };

  const handleDelete = async () => {
    if (!deletingEnrollment) return;
    try {
      await softDelete(deletingEnrollment._id).unwrap();
      toast.success("Enrollment archived successfully");
      setIsDeleteOpen(false);
      setDeletingEnrollment(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to archive enrollment");
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
      {/* Page Header */}
      <PageHeader
        title="Enrollment Management"
        description="Manage all course enrollments and track student progress"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Enrollment Management" },
        ]}
        action={<CreateEnrollmentModal onSuccess={refetch} />}
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
              label="Total Enrollments"
              value={enrollmentSummary?.totalEnrollments ?? stats?.totalEnrollments ?? 0}
              sub={`${enrollmentSummary?.overallCompletionRate ?? 0}% completion rate`}
              icon={Users}
              color="blue"
            />
            <StatCard
              label="Completed Enrollments"
              value={enrollmentSummary?.totalCompleted ?? stats?.completedEnrollments ?? 0}
              sub={`${enrollmentSummary?.totalActive ?? 0} currently active`}
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              label="Total Students"
              value={stats?.totalStudents ?? 0}
              sub={`${stats?.totalCourses ?? 0} courses available`}
              icon={TrendingUp}
              color="violet"
            />
            <StatCard
              label="Total Revenue"
              value={`৳${totalRevenue.toLocaleString()}`}
              sub={`${analyticsData?.data?.revenue?.totalRevenue?.totalTransactions ?? 0} transactions`}
              icon={DollarSign}
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
            placeholder="Search by student name, student ID or transaction ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={courseFilter} onValueChange={(v) => setCourseFilter(String(v))}>
          <SelectTrigger className="w-full sm:w-48 sm:shrink-0 h-9 text-sm">
            <span className="truncate block max-w-40">
              {courseFilter === "all"
                ? "All Courses"
                : coursesData?.data?.find((c: any) => c._id === courseFilter)?.title || "Select course"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {coursesData?.data?.map((course: any) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(String(v))}>
          <SelectTrigger className="w-full sm:w-36 sm:shrink-0 h-9 text-sm">
            <span className="truncate block">
              {statusFilter === "all"
                ? "All Statuses"
                : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="icon" onClick={clearFilters} title="Clear filters" className="shrink-0">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {courseFilter !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1 cursor-pointer" onClick={() => setCourseFilter("all")}>
              Course: {coursesData?.data?.find((c: any) => c._id === courseFilter)?.title ?? courseFilter}
              <X className="w-3 h-3" />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1 cursor-pointer" onClick={() => setStatusFilter("all")}>
              Status: {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
              <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <SortableTh field="student"   label="Student"     />
                <SortableTh field="course"    label="Course"      />
                <TableHead className="whitespace-nowrap">Transaction ID</TableHead>
                <SortableTh field="status"    label="Status"      />
                <SortableTh field="createdAt" label="Enrolled At" />
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <EnrollmentRowSkeleton key={i} />)
              ) : sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                      {searchTerm || hasActiveFilters ? (
                        <>
                          <p className="text-base font-medium">No results found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-medium">No enrollments yet</p>
                          <p className="text-sm mt-1">Click the Add Enrollment button to get started</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((enrollment) => {
                  const student = enrollment.student;
                  const course  = enrollment.course;
                  const enrolledAt = enrollment.createdAt
                    ? new Date(enrollment.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : "—";

                  return (
                    <TableRow
                      key={enrollment._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {student?.picture ? (
                            <img
                              src={student.picture}
                              alt={student.name}
                              className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {student?.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate max-w-40">
                              {student?.name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-40">
                              {student?.studentId ?? student?.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Course */}
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          {course?.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-8 h-8 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-40">
                              {course?.title ?? "—"}
                            </p>
                            {course?.batch && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {course.batch}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Transaction ID */}
                      <TableCell>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                          {enrollment.transactionId ?? "—"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={enrollment.status} />
                      </TableCell>

                      {/* Enrolled At */}
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {enrolledAt}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-1.5 justify-end">
                          <Button variant="outline" size="icon" className="h-8 w-8" title="View details" onClick={() => openDetailsDialog(enrollment)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" title="Edit enrollment" onClick={() => openEditDialog(enrollment)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8" title="Archive enrollment" onClick={() => openDeleteDialog(enrollment)}>
                            <Archive className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />
        </div>

        {/* Footer */}
        {!isLoading && sorted.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {sorted.length}
              </span>{" "}
              enrollment{sorted.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </p>
            {totalPage > 1 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page {page} of {totalPage}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {editingEnrollment && (
        <UpdateEnrollmentModal
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          item={editingEnrollment}
          onSuccess={refetch}
        />
      )}

      {/* Details Modal */}
      {viewingEnrollment && (
        <EnrollmentDetailsModal
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          item={viewingEnrollment}
        />
      )}

      {/* Archive Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive the enrollment for{" "}
              <strong>{deletingEnrollment?.student?.name}</strong> in{" "}
              <strong>{deletingEnrollment?.course?.title}</strong>? The record will be moved to trash and can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Archiving..." : "Archive"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}