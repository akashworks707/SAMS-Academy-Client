
// "use client";

// import React, { useEffect, useState } from "react";
// import { Edit2, Trash2, Search, GraduationCap, Users, Eye } from "lucide-react";
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
// import { PageHeader } from "@/components/layout/page-header";

// import { useGetAllTeachersQuery, useDeleteUserMutation } from "@/redux/features/user/user.api";
// import { CreateTeacherModal } from "./CreateTeacherModal";
// import { UpdateTeacherModal } from "./UpdateTeacherModal";
// import { TeacherDetailsModal } from "./TeacherDetailsModal";
// import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
// import { useGetCoursesQuery } from "@/redux/features/course/course.api";
// import { Pagination } from "../pagination/pagination";

// // ─── Skeleton Card ─────────────────────────────────────────────────────────────

// function TeacherCardSkeleton() {
//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
//       <div className="flex items-start justify-between">
//         <Skeleton className="w-12 h-12 rounded-full" />
//         <Skeleton className="w-16 h-6 rounded-full" />
//       </div>
//       <div className="space-y-2">
//         <Skeleton className="h-5 w-3/4" />
//         <Skeleton className="h-4 w-1/2" />
//       </div>
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-full" />
//         <Skeleton className="h-4 w-2/3" />
//       </div>
//       <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
//         <Skeleton className="h-9 flex-1 rounded-md" />
//         <Skeleton className="h-9 w-9 rounded-md" />
//         <Skeleton className="h-9 w-9 rounded-md" />
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ────────────────────────────────────────────────────────────

// export default function TeacherManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [viewingTeacher, setViewingTeacher] = useState<any | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [courseFilter, setCourseFilter] = useState("all");
//   const [page, setPage] = useState(1);
//   const limit = 9;

//   const { data, isLoading, refetch } = useGetAllTeachersQuery({
//     searchTerm: searchTerm || undefined,
//     course:
//       courseFilter !== "all" ? courseFilter : undefined,
//     page,
//     limit,
//   });
//   const { data: CoursesData, isLoading: isCoursesLoading, refetch: refetchCourses } = useGetCoursesQuery({
//     searchTerm: searchTerm || undefined,
//     limit: 100,
//   });
//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

//   const meta = data?.meta;

//   const totalPage = meta?.totalPage || 1;
//   const currentPage = meta?.page || page;

//   const teachers: any[] = data?.data ?? [];

//   const openEditDialog = (teacher: any) => {
//     setEditingTeacher(teacher);
//     setIsUpdateOpen(true);
//   };

//   const openDetailsDialog = (teacher: any) => {
//     setViewingTeacher(teacher);
//     setIsDetailsOpen(true);
//   };

//   const openDeleteDialog = (teacher: any) => {
//     setDeletingTeacher(teacher);
//     setIsDeleteOpen(true);
//   };

//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, courseFilter]);

//   const handleDelete = async () => {
//     if (!deletingTeacher) return;
//     try {
//       await deleteUser(deletingTeacher._id).unwrap();
//       toast.success("Teacher deleted successfully");
//       setIsDeleteOpen(false);
//       setDeletingTeacher(null);
//       refetch();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete teacher");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <PageHeader
//         title="Teacher Management"
//         description="Manage all teaching staff and control their information"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Teacher Management" },
//         ]}
//         action={<CreateTeacherModal onSuccess={refetch} />}
//       />

//       {/* Search + Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <Input
//             placeholder="Search by name, email or ID..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>


//         <Select
//           value={courseFilter}
//           onValueChange={(v) => setCourseFilter(String(v))}
//         >
//           <SelectTrigger className="w-74! h-9 text-sm">
//             <span>
//               {courseFilter === "all"
//                 ? "All Courses"
//                 : CoursesData?.data?.find((c: any) => c._id === courseFilter)?.title || "Select course"}
//             </span>
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">All Courses</SelectItem>

//             {CoursesData?.data?.map((course: any) => (
//               <SelectItem key={course._id} value={course._id}>
//                 {course.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {isLoading ? (
//           Array.from({ length: 6 }).map((_, i) => <TeacherCardSkeleton key={i} />)
//         ) : teachers.length === 0 ? (
//           <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
//             <GraduationCap className="w-12 h-12 mb-4 opacity-30" />
//             {searchTerm ? (
//               <>
//                 <p className="text-base font-medium">No results found</p>
//                 <p className="text-sm mt-1">No teacher found matching &quot;{searchTerm}&quot;</p>
//               </>
//             ) : (
//               <>
//                 <p className="text-base font-medium">No teachers added yet</p>
//                 <p className="text-sm mt-1">Click the Add Teacher button to get started</p>
//               </>
//             )}
//           </div>
//         ) : (
//           teachers.map((teacher) => {
//             const profileId = teacher._id;
//             const address = teacher.address;
//             const hasAddress =
//               address &&
//               (address.division || address.district || address.thana || address.union);

//             return (
//               // <div
//               //   key={profileId}
//               //   className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col"
//               // >
//               //   {/* Header */}
//               //   <div className="flex items-start justify-between mb-4">
//               //     {teacher?.picture ? (
//               //       <img
//               //         src={teacher.picture}
//               //         alt={teacher.name}
//               //         className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
//               //       />
//               //     ) : (
//               //       <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
//               //         {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
//               //       </div>
//               //     )}
//               //     <Badge
//               //       variant="outline"
//               //       className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
//               //     >
//               //       <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-emerald-500" />
//               //       Active
//               //     </Badge>
//               //   </div>

//               //   {/* Name + Designation */}
//               //   <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
//               //     {teacher?.name ?? "—"}
//               //   </h3>
//               //   <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
//               //     {teacher.designation ?? "Teacher"}
//               //   </p>

//               //   {/* Details */}
//               //   <div className="space-y-1.5 text-sm mb-4 flex-1">
//               //     <p className="text-slate-600 dark:text-slate-400 truncate">
//               //       <span className="font-medium">Email:</span> {teacher?.email ?? "—"}
//               //     </p>
//               //     <p className="text-slate-600 dark:text-slate-400">
//               //       <span className="font-medium">Phone:</span> {teacher?.phone ?? "—"}
//               //     </p>
//               //     {teacher.qualification && (
//               //       <p className="text-slate-600 dark:text-slate-400 truncate">
//               //         <span className="font-medium">Qualification:</span> {teacher.qualification}
//               //       </p>
//               //     )}
//               //     {teacher.experience > 0 && (
//               //       <p className="text-slate-600 dark:text-slate-400">
//               //         <span className="font-medium">Experience:</span> {teacher.experience}{" "}
//               //         {teacher.experience === 1 ? "year" : "years"}
//               //       </p>
//               //     )}
//               //     {hasAddress && (
//               //       <p className="text-slate-600 dark:text-slate-400 truncate">
//               //         <span className="font-medium">Address:</span>{" "}
//               //         {[address.thana, address.district].filter(Boolean).join(", ")}
//               //       </p>
//               //     )}
//               //   </div>

//               //   {/* Actions */}
//               //   <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
//               //     <Button
//               //       variant="outline"
//               //       size="sm"
//               //       className="flex-1"
//               //       onClick={() => openEditDialog(teacher)}
//               //     >
//               //       <Edit2 className="w-4 h-4 mr-1.5" />
//               //       Edit
//               //     </Button>
//               //     <Button
//               //       variant="outline"
//               //       size="sm"
//               //       className="px-3"
//               //       title="View details"
//               //       onClick={() => openDetailsDialog(teacher)}
//               //     >
//               //       <Eye className="w-4 h-4" />
//               //     </Button>
//               //     <Button
//               //       variant="destructive"
//               //       size="sm"
//               //       className="px-3"
//               //       title="Delete"
//               //       onClick={() => openDeleteDialog(teacher)}
//               //     >
//               //       <Trash2 className="w-4 h-4" />
//               //     </Button>
//               //   </div>
//               // </div>

//               <div
//                 key={profileId}
//                 className="group relative rounded-2xl border border-slate-200/70 dark:border-slate-800 
//   bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl 
//   shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
//               >
//                 {/* Glow effect */}
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

//                 {/* Header */}
//                 <div className="flex items-center justify-between p-5 pb-3">
//                   <div className="flex items-center gap-3">
//                     {teacher?.picture ? (
//                       <img
//                         src={teacher.picture}
//                         alt={teacher.name}
//                         className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 
//         flex items-center justify-center text-white font-bold text-lg shadow-md">
//                         {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
//                       </div>
//                     )}

//                     <div>
//                       <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">
//                         {teacher?.name ?? "Unknown Teacher"}
//                       </h3>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         {teacher.designation ?? "Subject Teacher"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Status */}
//                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
//     bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
//                     <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                     Active
//                   </div>
//                 </div>

//                 {/* Body */}
//                 <div className="px-5 pb-4 space-y-2 text-sm flex-1">
//                   <div className="grid grid-cols-1 gap-1 text-slate-600 dark:text-slate-400">
//                     <p className="truncate">
//                       <span className="text-slate-500">Email:</span> {teacher?.email ?? "—"}
//                     </p>

//                     <p>
//                       <span className="text-slate-500">Phone:</span> {teacher?.phone ?? "—"}
//                     </p>

//                     {teacher.qualification && (
//                       <p className="truncate">
//                         <span className="text-slate-500">Qualification:</span> {teacher.qualification}
//                       </p>
//                     )}

//                     {teacher.experience > 0 && (
//                       <p>
//                         <span className="text-slate-500">Experience:</span>{" "}
//                         <span className="font-medium text-slate-700 dark:text-slate-300">
//                           {teacher.experience} {teacher.experience === 1 ? "year" : "years"}
//                         </span>
//                       </p>
//                     )}

//                   </div>

//                 </div>


//                 {/* Footer Actions */}
//                 <div className="mt-auto border-t border-slate-200/70 dark:border-slate-800 p-3 flex gap-2 bg-slate-50/40 dark:bg-slate-800/20">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
//                     onClick={() => openEditDialog(teacher)}
//                   >
//                     <Edit2 className="w-4 h-4 mr-1.5" />
//                     Edit
//                   </Button>

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="rounded-xl px-3 hover:bg-slate-100 dark:hover:bg-slate-800"
//                     onClick={() => openDetailsDialog(teacher)}
//                   >
//                     <Eye className="w-4 h-4" />
//                   </Button>

//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     className="rounded-xl px-3"
//                     onClick={() => openDeleteDialog(teacher)}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>

//               </div>
//             );
//           })
//         )}
//       </div>
//         <Pagination
//           page={currentPage}
//           totalPage={totalPage}
//           onPageChange={setPage}
//         />

//       {/* Update Modal */}
//       {editingTeacher && (
//         <UpdateTeacherModal
//           open={isUpdateOpen}
//           onOpenChange={setIsUpdateOpen}
//           item={editingTeacher}
//           onSuccess={refetch}
//         />
//       )}

//       {/* Details Modal */}
//       {viewingTeacher && (
//         <TeacherDetailsModal
//           open={isDetailsOpen}
//           onOpenChange={setIsDetailsOpen}
//           item={viewingTeacher}
//         />
//       )}

//       {/* Delete Confirmation */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <strong>{deletingTeacher?.name}</strong>? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// ------------------------------------------------------

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Edit2,
//   Trash2,
//   Search,
//   GraduationCap,
//   Eye,
//   ChevronUp,
//   ChevronDown,
//   ChevronsUpDown,
//   X,
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
//   useGetAllTeachersQuery,
//   useDeleteUserMutation,
// } from "@/redux/features/user/user.api";
// import { CreateTeacherModal } from "./CreateTeacherModal";
// import { UpdateTeacherModal } from "./UpdateTeacherModal";
// import { TeacherDetailsModal } from "./TeacherDetailsModal";
// import { useGetCoursesQuery } from "@/redux/features/course/course.api";
// import { Pagination } from "../pagination/pagination";
// import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";

// // ─── Types ──────────────────────────────────────────────────────────────────────

// type SortField = "name" | "phone" | "designation" | "qualification" | "experience";
// type SortDir = "asc" | "desc" | null;

// // ─── Skeleton Row ────────────────────────────────────────────────────────────────

// function TeacherRowSkeleton() {
//   return (
//     <TableRow>
//       <TableCell>
//         <div className="flex items-center gap-3">
//           <Skeleton className="w-9 h-9 rounded-full shrink-0" />
//           <div className="space-y-1.5">
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-3 w-44" />
//           </div>
//         </div>
//       </TableCell>
//       <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-28" /></TableCell>
//       <TableCell><Skeleton className="h-4 w-12" /></TableCell>
//       <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
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

// // ─── Sort Icon ───────────────────────────────────────────────────────────────────

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

// // ─── Main Component ──────────────────────────────────────────────────────────────

// export default function TeacherManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [courseFilter, setCourseFilter] = useState("all");
//   const [sortField, setSortField] = useState<SortField | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>(null);

//   const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [viewingTeacher, setViewingTeacher] = useState<any | null>(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const {data:analyticsData} = useGetAllAnalyticsQuery({})
//   console.log("Analytics Data", analyticsData)

//   const { data, isLoading, refetch } = useGetAllTeachersQuery({
//     searchTerm: searchTerm || undefined,
//     course: courseFilter !== "all" ? courseFilter : undefined,
//     page,
//     limit,
//   });
//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
//   const { data: CoursesData } = useGetCoursesQuery({
//     limit: 100,
//   });

//   const meta = data?.meta;
//   const totalPage = meta?.totalPage || 1;
//   const teachers: any[] = data?.data ?? [];
//   const hasActiveFilters = courseFilter !== "all";

//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, courseFilter]);

//   // ── Handlers ──
//   const handleSort = (field: SortField) => {
//     if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
//     if (sortDir === "asc") { setSortDir("desc"); return; }
//     setSortField(null); setSortDir(null);
//   };

//   const clearFilters = () => setCourseFilter("all");

//   const openEditDialog = (teacher: any) => { setEditingTeacher(teacher); setIsUpdateOpen(true); };
//   const openDetailsDialog = (teacher: any) => { setViewingTeacher(teacher); setIsDetailsOpen(true); };
//   const openDeleteDialog = (teacher: any) => { setDeletingTeacher(teacher); setIsDeleteOpen(true); };

//   const handleDelete = async () => {
//     if (!deletingTeacher) return;
//     try {
//       await deleteUser(deletingTeacher._id).unwrap();
//       toast.success("Teacher deleted successfully");
//       setIsDeleteOpen(false);
//       setDeletingTeacher(null);
//       refetch();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to delete teacher");
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
//         title="Teacher Management"
//         description="Manage all teaching staff and control their information"
//         breadcrumbs={[
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Teacher Management" },
//         ]}
//         action={<CreateTeacherModal onSuccess={refetch} />}
//       />

//       {/* Search + Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <Input
//             placeholder="Search by name, email or ID..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <Select
//           value={courseFilter}
//           onValueChange={(v) => setCourseFilter(String(v))}
//         >
//           <SelectTrigger className="w-74! h-9 text-sm">
//             <span>
//               {courseFilter === "all"
//                 ? "All Courses"
//                 : CoursesData?.data?.find((c: any) => c._id === courseFilter)?.title || "Select course"}
//             </span>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Courses</SelectItem>
//             {CoursesData?.data?.map((course: any) => (
//               <SelectItem key={course._id} value={course._id}>
//                 {course.title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

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

//       {/* Table */}
//       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-slate-50 dark:bg-slate-800/50">
//                 <SortableTh field="name" label="Teacher" />
//                 <SortableTh field="phone" label="Phone" />
//                 <SortableTh field="designation" label="Designation" />
//                 <SortableTh field="qualification" label="Qualification" />
//                 <SortableTh field="experience" label="Experience" />
//                 <TableHead className="whitespace-nowrap">Status</TableHead>
//                 <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {isLoading ? (
//                 Array.from({ length: 6 }).map((_, i) => <TeacherRowSkeleton key={i} />)
//               ) : teachers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7}>
//                     <div className="flex flex-col items-center justify-center py-16 text-slate-400">
//                       <GraduationCap className="w-12 h-12 mb-4 opacity-30" />
//                       {searchTerm || hasActiveFilters ? (
//                         <>
//                           <p className="text-base font-medium">No results found</p>
//                           <p className="text-sm mt-1">Try adjusting your search or filters</p>
//                         </>
//                       ) : (
//                         <>
//                           <p className="text-base font-medium">No teachers added yet</p>
//                           <p className="text-sm mt-1">Click the Add Teacher button to get started</p>
//                         </>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 teachers.map((teacher) => (
//                   <TableRow
//                     key={teacher._id}
//                     className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
//                   >
//                     {/* Name + Email */}
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         {teacher?.picture ? (
//                           <img
//                             src={teacher.picture}
//                             alt={teacher.name}
//                             className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
//                           />
//                         ) : (
//                           <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
//                             {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
//                           </div>
//                         )}
//                         <div className="min-w-0">
//                           <p className="font-medium text-slate-900 dark:text-white truncate max-w-40">
//                             {teacher?.name ?? "—"}
//                           </p>
//                           <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-40">
//                             {teacher?.email ?? "—"}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-sm">
//                       {teacher?.phone ?? "—"}
//                     </TableCell>

//                     <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
//                       {teacher?.designation ?? "—"}
//                     </TableCell>

//                     <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
//                       <span className="truncate max-w-36 block">
//                         {teacher?.qualification ?? "—"}
//                       </span>
//                     </TableCell>

//                     <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
//                       {teacher?.experience > 0
//                         ? `${teacher.experience} yr${teacher.experience !== 1 ? "s" : ""}`
//                         : "—"}
//                     </TableCell>

//                     <TableCell>
//                       <Badge
//                         variant="outline"
//                         className={
//                           teacher?.isActive
//                             ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
//                             : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
//                         }
//                       >
//                         <span
//                           className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${
//                             teacher?.isActive ? "bg-emerald-500" : "bg-red-500"
//                           }`}
//                         />
//                         {teacher?.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex gap-1.5 justify-end">
//                         <Button
//                           variant="outline"
//                           size="icon"
//                           className="h-8 w-8"
//                           title="View details"
//                           onClick={() => openDetailsDialog(teacher)}
//                         >
//                           <Eye className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="icon"
//                           className="h-8 w-8"
//                           title="Edit teacher"
//                           onClick={() => openEditDialog(teacher)}
//                         >
//                           <Edit2 className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="icon"
//                           className="h-8 w-8"
//                           title="Delete teacher"
//                           onClick={() => openDeleteDialog(teacher)}
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>

//           <Pagination
//             page={page}
//             totalPage={totalPage}
//             onPageChange={setPage}
//           />
//         </div>

//         {/* Footer */}
//         {!isLoading && teachers.length > 0 && (
//           <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Showing{" "}
//               <span className="font-semibold text-slate-700 dark:text-slate-300">
//                 {teachers.length}
//               </span>{" "}
//               teacher{teachers.length !== 1 ? "s" : ""}
//               {hasActiveFilters && " (filtered)"}
//             </p>
//             {data?.meta?.totalPage && data.meta.totalPage > 1 && (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Page {page} of {data.meta.totalPage}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Update Modal */}
//       {editingTeacher && (
//         <UpdateTeacherModal
//           open={isUpdateOpen}
//           onOpenChange={setIsUpdateOpen}
//           item={editingTeacher}
//           onSuccess={refetch}
//         />
//       )}

//       {/* Details Modal */}
//       {viewingTeacher && (
//         <TeacherDetailsModal
//           open={isDetailsOpen}
//           onOpenChange={setIsDetailsOpen}
//           item={viewingTeacher}
//         />
//       )}

//       {/* Delete Confirmation */}
//       <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete{" "}
//               <strong>{deletingTeacher?.name}</strong>? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <div className="flex gap-2">
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


// --------------------------------------------------------

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Edit2,
  Trash2,
  Search,
  GraduationCap,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  DollarSign,
  Users,
  BookOpen,
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
  useGetAllTeachersQuery,
  useDeleteUserMutation,
} from "@/redux/features/user/user.api";
import { CreateTeacherModal } from "./CreateTeacherModal";
import { UpdateTeacherModal } from "./UpdateTeacherModal";
import { TeacherDetailsModal } from "./TeacherDetailsModal";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { Pagination } from "../pagination/pagination";
import { useGetAllAnalyticsQuery } from "@/redux/features/analytics/analytics.api";

// ─── Types ──────────────────────────────────────────────────────────────────────

// profile fields  → client-side sort
type ProfileSortField = "name" | "phone" | "designation" | "experience";
// analytics fields → server-side sort (passed to backend)
type AnalyticsSortField = "perClassSalary" | "totalClasses" | "totalRevenue";
type SortField = ProfileSortField | AnalyticsSortField;
type SortDir = "asc" | "desc" | null;

const ANALYTICS_SORT_FIELDS: AnalyticsSortField[] = [
  "perClassSalary",
  "totalClasses",
  "totalRevenue",
];

// ─── Skeleton Row ────────────────────────────────────────────────────────────────

function TeacherRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
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

// ─── Stat Card ───────────────────────────────────────────────────────────────────

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

// ─── Sort Icon ───────────────────────────────────────────────────────────────────

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField | null;
  sortDir: SortDir;
}) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
    : <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />;
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // analytics sort params — only for analytics fields
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

  const { data, isLoading, refetch } = useGetAllTeachersQuery({
    searchTerm: searchTerm || undefined,
    course: courseFilter !== "all" ? courseFilter : undefined,
    page,
    limit,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: CoursesData } = useGetCoursesQuery({ limit: 100 });

  // ── Derived analytics ──
  const stats = analyticsData?.data?.stats;
  const teacherSummary = analyticsData?.data?.revenue?.teacherRevenue?.[0]?.summary?.[0];
  const courseSummary = analyticsData?.data?.revenue?.courseRevenue?.summary;
  const totalRevenue = analyticsData?.data?.revenue?.totalRevenue?.totalRevenue ?? 0;

  const teacherRevenueMap = useMemo(() => {
    const map: Record<string, { perClassSalary: number; totalClasses: number; totalRevenue: number }> = {};
    (analyticsData?.data?.revenue?.teacherRevenue?.[0]?.teachers ?? []).forEach((t: any) => {
      map[t.teacherId] = {
        perClassSalary: t.perClassSalary,
        totalClasses: t.totalClasses,
        totalRevenue: t.totalRevenue,
      };
    });
    return map;
  }, [analyticsData]);

  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;
  const teachers: any[] = data?.data ?? [];

  const hasActiveFilters = courseFilter !== "all";
  const hasDateFilter = !!(startDate || endDate);

  useEffect(() => { setPage(1); }, [searchTerm, courseFilter]);

  // ── Sort handler ──
  const handleSort = (field: SortField) => {
    if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortField(null); setSortDir(null);
  };

  // client-side sort for profile fields only
  const sortedTeachers = useMemo(() => {
    if (!sortField || !sortDir || isAnalyticsSort) return teachers;

    return [...teachers].sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";

      if (typeof aVal === "number" && typeof bVal === "number")
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [teachers, sortField, sortDir, isAnalyticsSort]);

  // analytics sort → backend already returned sorted; just align by order
  const displayTeachers = useMemo(() => {
    if (!isAnalyticsSort || !sortField || !sortDir) return sortedTeachers;

    const analyticsOrder = (analyticsData?.data?.revenue?.teacherRevenue?.[0]?.teachers ?? [])
      .map((t: any) => t.teacherId);

    const inMap = sortedTeachers.filter((t) => analyticsOrder.includes(t._id));
    const notInMap = sortedTeachers.filter((t) => !analyticsOrder.includes(t._id));

    inMap.sort((a, b) => analyticsOrder.indexOf(a._id) - analyticsOrder.indexOf(b._id));

    return [...inMap, ...notInMap];
  }, [sortedTeachers, isAnalyticsSort, sortField, sortDir, analyticsData]);

  // ── Misc handlers ──
  const clearFilters = () => setCourseFilter("all");
  const clearDateFilter = () => { setStartDate(""); setEndDate(""); };

  const openEditDialog = (t: any) => { setEditingTeacher(t); setIsUpdateOpen(true); };
  const openDetailsDialog = (t: any) => { setViewingTeacher(t); setIsDetailsOpen(true); };
  const openDeleteDialog = (t: any) => { setDeletingTeacher(t); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    try {
      await deleteUser(deletingTeacher._id).unwrap();
      toast.success("Teacher deleted successfully");
      setIsDeleteOpen(false);
      setDeletingTeacher(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete teacher");
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
        title="Teacher Management"
        description="Manage all teaching staff and control their information"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Teacher Management" },
        ]}
        action={<CreateTeacherModal onSuccess={refetch} />}
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
              label="Total Teacher Revenue"
              value={`৳${(teacherSummary?.totalRevenue ?? 0).toLocaleString()}`}
              sub={`${teacherSummary?.totalClasses ?? 0} classes conducted`}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              label="Total Teachers"
              value={stats?.totalTeachers ?? 0}
              sub={`${teacherSummary?.totalTeachers ?? 0} with completed classes`}
              icon={GraduationCap}
              color="blue"
            />
            <StatCard
              label="Total Students"
              value={stats?.totalStudents ?? 0}
              sub={`${stats?.totalEnrollments ?? 0} total enrollments`}
              icon={Users}
              color="violet"
            />
            <StatCard
              label="Total Courses"
              value={stats?.totalCourses ?? 0}
              sub={`৳${totalRevenue.toLocaleString()} overall revenue`}
              icon={BookOpen}
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
            placeholder="Search by name, email or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={courseFilter} onValueChange={(v) => setCourseFilter(String(v))}>
          <SelectTrigger className="w-74! h-9 text-sm">
            <span>
              {courseFilter === "all"
                ? "All Courses"
                : CoursesData?.data?.find((c: any) => c._id === courseFilter)?.title || "Select course"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {CoursesData?.data?.map((course: any) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
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
                <SortableTh field="name" label="Teacher" />
                <SortableTh field="phone" label="Phone" />
                <SortableTh field="designation" label="Designation" />
                {/* <SortableTh field="qualification" label="Qualification" /> */}
                <SortableTh field="experience" label="Experience" />
                <SortableTh field="perClassSalary" label="Salary/Class" />
                <SortableTh field="totalClasses" label="Total Classes" />
                <SortableTh field="totalRevenue" label="Total Revenue" />
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <TeacherRowSkeleton key={i} />)
              ) : displayTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <GraduationCap className="w-12 h-12 mb-4 opacity-30" />
                      {searchTerm || hasActiveFilters ? (
                        <>
                          <p className="text-base font-medium">No results found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-medium">No teachers added yet</p>
                          <p className="text-sm mt-1">Click the Add Teacher button to get started</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayTeachers.map((teacher) => {
                  const rev = teacherRevenueMap[teacher._id];
                  return (
                    <TableRow
                      key={teacher._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {teacher?.picture ? (
                            <img
                              src={teacher.picture}
                              alt={teacher.name}
                              className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate max-w-40">
                              {teacher?.name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-40">
                              {teacher?.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                        {teacher?.phone ?? "—"}
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
                        {teacher?.designation ?? "—"}
                      </TableCell>

                      {/* <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
                        <span className="truncate max-w-36 block">
                          {teacher?.qualification ?? "—"}
                        </span>
                      </TableCell> */}

                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                        {teacher?.experience > 0
                          ? `${teacher.experience} yr${teacher.experience !== 1 ? "s" : ""}`
                          : "—"}
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                        {rev ? `৳${rev.perClassSalary.toLocaleString()}` : "—"}
                      </TableCell>

                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm text-center">
                        {rev ? rev.totalClasses : "—"}
                      </TableCell>

                      <TableCell className="text-sm font-medium">
                        {rev ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ৳{rev.totalRevenue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            teacher?.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }
                        >
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${teacher?.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                          {teacher?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-1.5 justify-end">
                          <Button variant="outline" size="icon" className="h-8 w-8" title="View details" onClick={() => openDetailsDialog(teacher)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8" title="Edit teacher" onClick={() => openEditDialog(teacher)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8" title="Delete teacher" onClick={() => openDeleteDialog(teacher)}>
                            <Trash2 className="w-3.5 h-3.5" />
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

        {!isLoading && displayTeachers.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {displayTeachers.length}
              </span>{" "}
              teacher{displayTeachers.length !== 1 ? "s" : ""}
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

      {editingTeacher && (
        <UpdateTeacherModal
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          item={editingTeacher}
          onSuccess={refetch}
        />
      )}

      {viewingTeacher && (
        <TeacherDetailsModal
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          item={viewingTeacher}
        />
      )}

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingTeacher?.name}</strong>? This action cannot be undone.
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