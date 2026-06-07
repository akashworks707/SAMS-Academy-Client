
"use client";

import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Search, GraduationCap, Users, Eye } from "lucide-react";
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

import { useGetAllTeachersQuery, useDeleteUserMutation } from "@/redux/features/user/user.api";
import { CreateTeacherModal } from "./CreateTeacherModal";
import { UpdateTeacherModal } from "./UpdateTeacherModal";
import { TeacherDetailsModal } from "./TeacherDetailsModal";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { Pagination } from "../pagination/pagination";

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function TeacherCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, refetch } = useGetAllTeachersQuery({
    searchTerm: searchTerm || undefined,
    course:
      courseFilter !== "all" ? courseFilter : undefined,
    page,
    limit,
  });
  const { data: CoursesData, isLoading: isCoursesLoading, refetch: refetchCourses } = useGetCoursesQuery({
    searchTerm: searchTerm || undefined,
    limit: 100,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const meta = data?.meta;

  const totalPage = meta?.totalPage || 1;
  const currentPage = meta?.page || page;

  const teachers: any[] = data?.data ?? [];

  const openEditDialog = (teacher: any) => {
    setEditingTeacher(teacher);
    setIsUpdateOpen(true);
  };

  const openDetailsDialog = (teacher: any) => {
    setViewingTeacher(teacher);
    setIsDetailsOpen(true);
  };

  const openDeleteDialog = (teacher: any) => {
    setDeletingTeacher(teacher);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, courseFilter]);

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


        <Select
          value={courseFilter}
          onValueChange={(v) => setCourseFilter(String(v))}
        >
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
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <TeacherCardSkeleton key={i} />)
        ) : teachers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <GraduationCap className="w-12 h-12 mb-4 opacity-30" />
            {searchTerm ? (
              <>
                <p className="text-base font-medium">No results found</p>
                <p className="text-sm mt-1">No teacher found matching &quot;{searchTerm}&quot;</p>
              </>
            ) : (
              <>
                <p className="text-base font-medium">No teachers added yet</p>
                <p className="text-sm mt-1">Click the Add Teacher button to get started</p>
              </>
            )}
          </div>
        ) : (
          teachers.map((teacher) => {
            const profileId = teacher._id;
            const address = teacher.address;
            const hasAddress =
              address &&
              (address.division || address.district || address.thana || address.union);

            return (
              // <div
              //   key={profileId}
              //   className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col"
              // >
              //   {/* Header */}
              //   <div className="flex items-start justify-between mb-4">
              //     {teacher?.picture ? (
              //       <img
              //         src={teacher.picture}
              //         alt={teacher.name}
              //         className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
              //       />
              //     ) : (
              //       <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              //         {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
              //       </div>
              //     )}
              //     <Badge
              //       variant="outline"
              //       className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
              //     >
              //       <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block bg-emerald-500" />
              //       Active
              //     </Badge>
              //   </div>

              //   {/* Name + Designation */}
              //   <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5 truncate">
              //     {teacher?.name ?? "—"}
              //   </h3>
              //   <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              //     {teacher.designation ?? "Teacher"}
              //   </p>

              //   {/* Details */}
              //   <div className="space-y-1.5 text-sm mb-4 flex-1">
              //     <p className="text-slate-600 dark:text-slate-400 truncate">
              //       <span className="font-medium">Email:</span> {teacher?.email ?? "—"}
              //     </p>
              //     <p className="text-slate-600 dark:text-slate-400">
              //       <span className="font-medium">Phone:</span> {teacher?.phone ?? "—"}
              //     </p>
              //     {teacher.qualification && (
              //       <p className="text-slate-600 dark:text-slate-400 truncate">
              //         <span className="font-medium">Qualification:</span> {teacher.qualification}
              //       </p>
              //     )}
              //     {teacher.experience > 0 && (
              //       <p className="text-slate-600 dark:text-slate-400">
              //         <span className="font-medium">Experience:</span> {teacher.experience}{" "}
              //         {teacher.experience === 1 ? "year" : "years"}
              //       </p>
              //     )}
              //     {hasAddress && (
              //       <p className="text-slate-600 dark:text-slate-400 truncate">
              //         <span className="font-medium">Address:</span>{" "}
              //         {[address.thana, address.district].filter(Boolean).join(", ")}
              //       </p>
              //     )}
              //   </div>

              //   {/* Actions */}
              //   <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              //     <Button
              //       variant="outline"
              //       size="sm"
              //       className="flex-1"
              //       onClick={() => openEditDialog(teacher)}
              //     >
              //       <Edit2 className="w-4 h-4 mr-1.5" />
              //       Edit
              //     </Button>
              //     <Button
              //       variant="outline"
              //       size="sm"
              //       className="px-3"
              //       title="View details"
              //       onClick={() => openDetailsDialog(teacher)}
              //     >
              //       <Eye className="w-4 h-4" />
              //     </Button>
              //     <Button
              //       variant="destructive"
              //       size="sm"
              //       className="px-3"
              //       title="Delete"
              //       onClick={() => openDeleteDialog(teacher)}
              //     >
              //       <Trash2 className="w-4 h-4" />
              //     </Button>
              //   </div>
              // </div>

              <div
                key={profileId}
                className="group relative rounded-2xl border border-slate-200/70 dark:border-slate-800 
  bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl 
  shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-3">
                  <div className="flex items-center gap-3">
                    {teacher?.picture ? (
                      <img
                        src={teacher.picture}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 
        flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {teacher?.name?.charAt(0)?.toUpperCase() ?? "T"}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white leading-tight">
                        {teacher?.name ?? "Unknown Teacher"}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {teacher.designation ?? "Subject Teacher"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
    bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 pb-4 space-y-2 text-sm flex-1">
                  <div className="grid grid-cols-1 gap-1 text-slate-600 dark:text-slate-400">
                    <p className="truncate">
                      <span className="text-slate-500">Email:</span> {teacher?.email ?? "—"}
                    </p>

                    <p>
                      <span className="text-slate-500">Phone:</span> {teacher?.phone ?? "—"}
                    </p>

                    {teacher.qualification && (
                      <p className="truncate">
                        <span className="text-slate-500">Qualification:</span> {teacher.qualification}
                      </p>
                    )}

                    {teacher.experience > 0 && (
                      <p>
                        <span className="text-slate-500">Experience:</span>{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {teacher.experience} {teacher.experience === 1 ? "year" : "years"}
                        </span>
                      </p>
                    )}

                  </div>

                </div>


                {/* Footer Actions */}
                <div className="mt-auto border-t border-slate-200/70 dark:border-slate-800 p-3 flex gap-2 bg-slate-50/40 dark:bg-slate-800/20">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
                    onClick={() => openEditDialog(teacher)}
                  >
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl px-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => openDetailsDialog(teacher)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl px-3"
                    onClick={() => openDeleteDialog(teacher)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            );
          })
        )}
      </div>
        <Pagination
          page={currentPage}
          totalPage={totalPage}
          onPageChange={setPage}
        />

      {/* Update Modal */}
      {editingTeacher && (
        <UpdateTeacherModal
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          item={editingTeacher}
          onSuccess={refetch}
        />
      )}

      {/* Details Modal */}
      {viewingTeacher && (
        <TeacherDetailsModal
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          item={viewingTeacher}
        />
      )}

      {/* Delete Confirmation */}
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