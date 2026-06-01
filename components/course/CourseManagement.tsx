/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import {
  Search, BookOpen, Edit2, Trash2, Star, Users,
  Clock, CalendarDays, BadgeCheck, PlayCircle,
  ArrowRight,
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
import { PageHeader } from "@/components/layout/page-header";

import { useGetCoursesQuery, useSoftDeleteCourseMutation } from "@/redux/features/course/course.api";
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

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig = {
  upcoming: { label: "Upcoming", dot: "bg-blue-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-amber-800 backdrop-blur-sm" },
  running: { label: "Running", dot: "bg-emerald-500", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-green-700 border-blue-200 dark:text-green-400 dark:border-amber-800 backdrop-blur-sm" },
  completed: { label: "Completed", dot: "bg-slate-400", badge: "text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-amber-800 backdrop-blur-sm" },
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Skeleton className="w-full h-44" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<CourseItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: coursesData, isLoading, refetch } = useGetCoursesQuery({
    searchTerm: searchTerm || undefined,
    limit: 50,
  });
  const [softDeleteCourse, { isLoading: isDeleting }] = useSoftDeleteCourseMutation();

  const courses = (coursesData as { data?: CourseItem[] })?.data ?? [];
  const { user } = useUser();

  const userRole = user?.role;


  const openEditDialog = (course: CourseItem) => { setEditingCourse(course); setIsEditOpen(true); };
  const openDeleteDialog = (course: CourseItem) => { setDeletingCourse(course); setIsDeleteOpen(true); };

  const handleDelete = async () => {
    if (!deletingCourse) return;
    try {
      await softDeleteCourse(deletingCourse._id).unwrap();
      toast.success("Course Deleted", { description: `"${deletingCourse.title}" Moved to trash` });
      setIsDeleteOpen(false);
      setDeletingCourse(null);
      refetch();
    } catch (error: any) {
      toast.error("Failed to Delete", { description: error?.data?.message ?? "Failed to delete" });
    }
  };

  const getClassName = (cls: CourseItem["class"]) =>
    typeof cls === "object" && cls ? cls.title : "";

  const formatPrice = (regular?: number, discount?: number) => {
    if (!regular && !discount) return null;
    if (discount && regular && discount < regular) {
      return (
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-slate-900 dark:text-white">৳{discount.toLocaleString()}</span>
          <span className="text-xs text-slate-400 line-through">৳{regular.toLocaleString()}</span>
          <span className="text-xs font-semibold text-emerald-600">
            {Math.round(((regular - discount) / regular) * 100)}% Discount
          </span>
        </div>
      );
    }
    return <span className="text-lg font-bold text-slate-900 dark:text-white">৳{(discount || regular)?.toLocaleString()}</span>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Management"
        description="Create And Manage All Courses"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Course Management" },
        ]}
        action={<CreateCourseModal onSuccess={refetch} />}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search with course title..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
        ) : courses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <BookOpen className="w-14 h-14 mb-4 opacity-20" />
            <p className="text-base font-medium">
              {searchTerm ? "No Result Found" : "No Course Found"}
            </p>
            <p className="text-sm mt-1">
              {searchTerm ? `No courses could be found with ${searchTerm}` : "Course found"}
            </p>
          </div>
        ) : (
          courses.map((course) => {
            const status = course.status ?? "upcoming";
            const cfg = statusConfig[status] ?? statusConfig.upcoming;
            const className = getClassName(course.class);

            return (
              <div
                key={course._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-400 dark:border-slate-800 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 h-44">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}

                  {/* Overlay badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    <Badge variant="outline" className={`text-[11px] px-2 py-0.5 border font-medium backdrop-blur-sm ${cfg.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${cfg.dot}`} />
                      {cfg.label}
                    </Badge>
                    {course.isFeatured && (
                      <Badge variant="outline" className="text-[11px] px-2 py-0.5 border font-medium bg-white/90 dark:bg-slate-900/90 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800 backdrop-blur-sm">
                        <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" /> Featured
                      </Badge>
                    )}
                  </div>

                  {course.certificate && (
                    <div className="absolute top-2 right-2">
                      <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center shadow-sm" title="সার্টিফিকেট আছে">
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 border flex flex-col flex-1">

                  {/* Class + batch tag */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {className && (
                      <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                        {className}
                      </span>
                    )}
                    {course.batch && (
                      <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {course.batch}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Description */}
                  {course.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mb-3 mt-auto">
                    {course.totalClasses && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {course.totalClasses} Class
                      </span>
                    )}
                    {course.duration && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {course.duration}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  {(course.regularPrice || course.discountPrice) && (
                    <div className="mb-3">
                      {formatPrice(course.regularPrice, course.discountPrice)}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 ">

                    {userRole === Role.ADMIN && <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-8 cursor-pointer"
                      onClick={() => openEditDialog(course)}
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                      Update
                    </Button>

                    }

                    <Link href={`/dashboard/courses/view-course/${course.slug}`} className="block w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8 w-full cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                        Continue
                      </Button>
                    </Link>
                    {userRole === Role.ADMIN && <Button
                      variant="outline"
                      size="sm"
                      className="px-2.5 h-8 border-red-200 text-red-500 cursor-pointer hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                      onClick={() => openDeleteDialog(course)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    }
                  </div>
                </div>
              </div>
            );
          })
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
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingCourse?.title}
              </span>
              {" "}?
              It will be moved to the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-2">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}