/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminDataTable } from "@/components/shared/data-table";
import { StatsCard } from "@/components/shared/stats-card";
import { ActionMenu } from "@/components/shared/action-menu";
import { FormDialog } from "@/components/shared/form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CourseForm } from "@/components/courses/course-form";
import {
  ICourse,
  CourseFormData,
  SearchFilters,
  TableColumn,
} from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
  useUpdateCourseMutation,
} from "@/redux/features/course/course.api";

const courseColumns: TableColumn<ICourse>[] = [
  {
    header: "Course Title",
    accessor: "title",
    sortable: true,
    width: "25%",
  },
  {
    header: "Code",
    accessor: "code",
    width: "10%",
  },
  {
    header: "Credits",
    accessor: "credits",
    width: "10%",
  },
  {
    header: "Students",
    accessor: "enrollmentCount",
    width: "15%",
    cell: (data: ICourse) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        {data.enrollmentCount}
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    width: "15%",
    cell: (data: ICourse) => (
      <Badge
        variant={
          data.status === "ACTIVE"
            ? "default"
            : data.status === "INACTIVE"
              ? "secondary"
              : "outline"
        }
      >
        {data.status}
      </Badge>
    ),
  },
  {
    header: "Created",
    accessor: "createdAt",
    width: "15%",
    cell: (data: ICourse) => new Date(data.createdAt).toLocaleDateString(),
  },
];

export default function CoursesPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const { data: coursesData, isLoading } = useGetAllCoursesQuery({
    page,
    limit: 10,
    search: filters.search,
    status: filters.status,
  });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const courses = coursesData?.data || [];
  const totalCount = coursesData?.totalCount || 0;

  const mockInstructors = [
    { _id: "1", name: "Dr. John Smith" },
    { _id: "2", name: "Prof. Jane Doe" },
    { _id: "3", name: "Dr. Robert Johnson" },
  ];

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleCreateCourse = async (formData: CourseFormData) => {
    try {
      await createCourse(formData).unwrap();
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to create course",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCourse = async (formData: CourseFormData) => {
    if (!selectedCourse) return;
    try {
      await updateCourse({
        id: selectedCourse._id,
        data: formData,
      }).unwrap();
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
      setIsFormOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse._id).unwrap();
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
      setIsDeleteOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Total Courses",
      value: totalCount,
      icon: <BookOpen className="h-6 w-6" />,
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Courses",
      value: courses.filter((c: ICourse) => c.status === "ACTIVE").length,
      icon: <TrendingUp className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Courses"
        description="Manage all courses offered in the academy"
        actionButton={{
          label: "Add Course",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            setSelectedCourse(null);
            setIsFormOpen(true);
          },
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Table */}
      <AdminDataTable<ICourse>
        columns={courseColumns}
        data={courses}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={10}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search courses..."
        actionColumn={(course) => (
          <ActionMenu
            items={[
              {
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {
                  // Handle view
                },
              },
              {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => {
                  setSelectedCourse(course);
                  setIsFormOpen(true);
                },
              },
              {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                variant: "destructive",
                onClick: () => {
                  setSelectedCourse(course);
                  setIsDeleteOpen(true);
                },
              },
            ]}
          />
        )}
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCourse(null);
        }}
        title={selectedCourse ? "Edit Course" : "Create New Course"}
        description={
          selectedCourse
            ? "Update course details"
            : "Add a new course to the system"
        }
        isLoading={isCreating || isUpdating}
        submitLabel={selectedCourse ? "Update" : "Create"}
      >
        <CourseForm
          course={selectedCourse || undefined}
          instructors={mockInstructors}
          isLoading={isCreating || isUpdating}
          onSubmit={selectedCourse ? handleUpdateCourse : handleCreateCourse}
        />
      </FormDialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedCourse(null);
        }}
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteCourse}
      />
    </div>
  );
}
