"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Search,
  Users,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  useGetAllStudentsQuery,
  useDeleteUserMutation,
} from "@/redux/features/user/user.api";
import { CreateStudentModal } from "./CreateStudentModal";
import { UpdateStudentModal } from "./UpdateStudentModal";
import { StudentDetailsModal } from "./StudentDetailsModal";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { Pagination } from "../pagination/pagination";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortField = "name" | "phone" | "section" | "course" | "class";
type SortDir = "asc" | "desc" | null;

// ─── Skeleton Row ───────────────────────────────────────────────────────────────

function StudentRowSkeleton() {
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
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
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

// ─── Sort Icon ──────────────────────────────────────────────────────────────────

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
  return sortDir === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5 ml-1 text-emerald-500" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-500" />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<any | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useGetAllStudentsQuery({
    searchTerm: searchTerm || undefined,
    course:
      courseFilter !== "all" ? courseFilter : undefined,
    page,
    limit,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: CoursesData, isLoading: isCoursesLoading, refetch: refetchCourses } = useGetCoursesQuery({
    searchTerm: searchTerm || undefined,
    limit: 100,
  });
  const meta = data?.meta;

  const totalPage = meta?.totalPage || 1;

  const students: any[] = data?.data ?? [];

  const hasActiveFilters = courseFilter !== "all" || classFilter !== "all";

  useEffect(() => {
    setPage(1);
  }, [searchTerm, courseFilter, classFilter]);

  // ── Handlers ──
  const handleSort = (field: SortField) => {
    if (sortField !== field) { setSortField(field); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortField(null); setSortDir(null);
  };

  const clearFilters = () => { setCourseFilter("all"); setClassFilter("all"); };

  const openEditDialog = (student: any) => { setEditingStudent(student); setIsUpdateOpen(true); };
  const openDetailsDialog = (student: any) => { setViewingStudent(student); setIsDetailsOpen(true); };
  const openDeleteDialog = (student: any) => { setDeletingStudent(student); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    try {
      await deleteUser(deletingStudent._id).unwrap();
      toast.success("Student deleted successfully");
      setIsDeleteOpen(false);
      setDeletingStudent(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete student");
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
        title="Student Management"
        description="Manage all students and control their information"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Student Management" },
        ]}
        action={<CreateStudentModal onSuccess={refetch} />}
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

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
            className="shrink-0"
          >
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
                <SortableTh field="name" label="Student" />
                <SortableTh field="phone" label="Phone" />
                <TableHead className="whitespace-nowrap">Guardian</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <StudentRowSkeleton key={i} />)
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Users className="w-12 h-12 mb-4 opacity-30" />
                      {searchTerm || hasActiveFilters ? (
                        <>
                          <p className="text-base font-medium">No results found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </>
                      ) : (
                        <>
                          <p className="text-base font-medium">No students added yet</p>
                          <p className="text-sm mt-1">Click the Add Student button to get started</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Name + Email */}
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
                            {student?.email ?? "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                      {student?.phone ?? "—"}
                    </TableCell>

                    <TableCell>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-35">
                          {student?.guardianName ?? "—"}
                        </p>
                        {student?.guardianPhone && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {student.guardianPhone}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student?.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${student?.isActive ? "bg-emerald-500" : "bg-red-500"
                            }`}
                        />
                        {student?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          title="View details"
                          onClick={() => openDetailsDialog(student)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          title="Edit student"
                          onClick={() => openEditDialog(student)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          title="Delete student"
                          onClick={() => openDeleteDialog(student)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            page={page}
            totalPage={totalPage}
            onPageChange={setPage}
          />
        </div>

        {/* Footer */}
        {!isLoading && students.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {students.length}
              </span>{" "}
              student{students.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </p>
            {data?.meta?.totalPage && data.meta.totalPage > 1 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page 1 of {data.meta.totalPage}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {editingStudent && (
        <UpdateStudentModal
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          item={editingStudent}
          onSuccess={refetch}
        />
      )}

      {/* Details Modal */}
      {viewingStudent && (
        <StudentDetailsModal
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          item={viewingStudent}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingStudent?.name}</strong>? This action cannot be
              undone.
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