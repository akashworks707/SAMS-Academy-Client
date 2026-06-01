// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useCallback } from "react";
// import { PageHeader } from "@/components/shared/page-header";
// import { AdminDataTable } from "@/components/shared/data-table";
// import { StatsCard } from "@/components/shared/stats-card";
// import { ActionMenu } from "@/components/shared/action-menu";
// import { FormDialog } from "@/components/shared/form-dialog";
// import { ConfirmDialog } from "@/components/shared/confirm-dialog";
// import { EnrollmentForm } from "@/components/enrollments/enrollment-form";
// import {
//   IEnrollment,
//   SearchFilters,
//   TableColumn,
//   ICourse,
// } from "@/types/admin";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Users,
//   CheckCircle,
//   UserCheck,
//   Edit,
//   Trash2,
//   Eye,
//   Plus,
// } from "lucide-react";
// import {
//   useCreateEnrollmentMutation,
//   useDeleteEnrollmentMutation,
//   useGetAllEnrollmentsQuery,
//   useUpdateEnrollmentMutation,
// } from "@/redux/features/enrollment/enrollment.api";
// import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
// import {
//   useGetAllStudentsQuery,
// } from "@/redux/features/user/user.api";
// import { IUser } from "@/types/user";

// const enrollmentColumns: TableColumn<IEnrollment>[] = [
//   {
//     header: "Student ID",
//     accessor: "studentId",
//     width: "15%",
//   },
//   {
//     header: "Course ID",
//     accessor: "courseId",
//     width: "15%",
//   },
//   {
//     header: "Enrollment Date",
//     accessor: "enrollmentDate",
//     width: "15%",
//     sortable: true,
//     cell: (data: IEnrollment) =>
//       new Date(data.enrollmentDate).toLocaleDateString(),
//   },
//   {
//     header: "Status",
//     accessor: "status",
//     width: "15%",
//     cell: (data: IEnrollment) => (
//       <Badge
//         variant={
//           data.status === "ACTIVE"
//             ? "default"
//             : data.status === "COMPLETED"
//               ? "secondary"
//               : data.status === "DROPPED"
//                 ? "destructive"
//                 : "outline"
//         }
//       >
//         {data.status}
//       </Badge>
//     ),
//   },
//   {
//     header: "Grade",
//     accessor: "grade",
//     width: "10%",
//     cell: (data: IEnrollment) => (
//       <span className="font-semibold">{data.grade || "-"}</span>
//     ),
//   },
// ];

// export default function Enrollments() {
//   const { toast } = useToast();
//   const [page, setPage] = useState(1);
//   const [filters, setFilters] = useState<SearchFilters>({});
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [selectedEnrollment, setSelectedEnrollment] =
//     useState<IEnrollment | null>(null);

//   const { data: enrollmentsData, isLoading } = useGetAllEnrollmentsQuery({
//     page,
//     limit: 10,
//     status: filters.status,
//   });

//   const { data: coursesData } = useGetAllCoursesQuery({
//     page: 1,
//     limit: 100,
//   });

//   const [createEnrollment, { isLoading: isCreating }] =
//     useCreateEnrollmentMutation();
//   const [updateEnrollment, { isLoading: isUpdating }] =
//     useUpdateEnrollmentMutation();
//   const [deleteEnrollment, { isLoading: isDeleting }] =
//     useDeleteEnrollmentMutation();

//   const enrollments: IEnrollment[] = enrollmentsData?.data || [];
//   const totalCount = enrollmentsData?.totalCount || 0;
//   const courses = coursesData?.data || [];

//   const { data: studentsData } = useGetAllStudentsQuery({
//     page: 1,
//     limit: 100,
//   });
//   const students: IUser[] = studentsData?.data || [];

//   const handleSearch = useCallback((newFilters: SearchFilters) => {
//     setFilters(newFilters);
//     setPage(1);
//   }, []);

//   const handleCreateEnrollment = async (formData: {
//     student: string;
//     class: string;
//     status?: "PENDING" | "ACTIVE" | "COMPLETED" | "DROPPED";
//     progress?: number;
//   }) => {
//     try {
//       await createEnrollment({
//         student: formData.student,
//         course: formData.class,
//         status: formData.status,
//         progress: formData.progress,
//       }).unwrap();
//       toast({
//         title: "Success",
//         description: "Enrollment created successfully",
//       });
//       setIsFormOpen(false);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.data?.message || "Failed to create enrollment",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleUpdateEnrollment = async (formData: {
//     student: string;
//     class: string;
//     status?: "PENDING" | "ACTIVE" | "COMPLETED" | "DROPPED";
//     progress?: number;
//   }) => {
//     if (!selectedEnrollment) return;
//     try {
//       await updateEnrollment({
//         id: selectedEnrollment._id,
//         data: {
//           student: formData.student,
//           course: formData.class,
//           status: formData.status,
//           progress: formData.progress,
//         },
//       }).unwrap();
//       toast({
//         title: "Success",
//         description: "Enrollment updated successfully",
//       });
//       setIsFormOpen(false);
//       setSelectedEnrollment(null);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.data?.message || "Failed to update enrollment",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteEnrollment = async () => {
//     if (!selectedEnrollment) return;
//     try {
//       await deleteEnrollment(selectedEnrollment._id).unwrap();
//       toast({
//         title: "Success",
//         description: "Enrollment deleted successfully",
//       });
//       setIsDeleteOpen(false);
//       setSelectedEnrollment(null);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.data?.message || "Failed to delete enrollment",
//         variant: "destructive",
//       });
//     }
//   };

//   const activeEnrollments = enrollments.filter(
//     (e) => e.status === "ACTIVE",
//   ).length;
//   const completedEnrollments = enrollments.filter(
//     (e) => e.status === "COMPLETED",
//   ).length;

//   const stats = [
//     {
//       title: "Total Enrollments",
//       value: totalCount,
//       icon: <Users className="h-6 w-6" />,
//       bgColor: "bg-blue-50 dark:bg-blue-950",
//       textColor: "text-blue-600 dark:text-blue-400",
//     },
//     {
//       title: "Active Enrollments",
//       value: activeEnrollments,
//       icon: <UserCheck className="h-6 w-6" />,
//       bgColor: "bg-green-50 dark:bg-green-950",
//       textColor: "text-green-600 dark:text-green-400",
//     },
//     {
//       title: "Completed",
//       value: completedEnrollments,
//       icon: <CheckCircle className="h-6 w-6" />,
//       bgColor: "bg-emerald-50 dark:bg-emerald-950",
//       textColor: "text-emerald-600 dark:text-emerald-400",
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       <PageHeader
//         title="Enrollments"
//         description="Manage student course enrollments"
//         actionButton={{
//           label: "Add Enrollment",
//           icon: <Plus className="h-4 w-4" />,
//           onClick: () => {
//             setSelectedEnrollment(null);
//             setIsFormOpen(true);
//           },
//         }}
//       />

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {stats.map((stat, idx) => (
//           <StatsCard key={idx} {...stat} />
//         ))}
//       </div>

//       {/* Table */}
//       <AdminDataTable<IEnrollment>
//         columns={enrollmentColumns}
//         data={enrollments}
//         isLoading={isLoading}
//         totalCount={totalCount}
//         currentPage={page}
//         pageSize={10}
//         onPageChange={setPage}
//         onSearch={handleSearch}
//         searchPlaceholder="Search enrollments..."
//         actionColumn={(enrollment) => (
//           <ActionMenu
//             items={[
//               {
//                 label: "View Details",
//                 icon: <Eye className="h-4 w-4" />,
//                 onClick: () => {
//                   // Handle view
//                 },
//               },
//               {
//                 label: "Edit",
//                 icon: <Edit className="h-4 w-4" />,
//                 onClick: () => {
//                   setSelectedEnrollment(enrollment);
//                   setIsFormOpen(true);
//                 },
//               },
//               {
//                 label: "Delete",
//                 icon: <Trash2 className="h-4 w-4" />,
//                 variant: "destructive",
//                 onClick: () => {
//                   setSelectedEnrollment(enrollment);
//                   setIsDeleteOpen(true);
//                 },
//               },
//             ]}
//           />
//         )}
//       />

//       {/* Form Dialog */}
//       <FormDialog
//         isOpen={isFormOpen}
//         onClose={() => {
//           setIsFormOpen(false);
//           setSelectedEnrollment(null);
//         }}
//         title={selectedEnrollment ? "Edit Enrollment" : "Create New Enrollment"}
//         description={
//           selectedEnrollment
//             ? "Update enrollment details"
//             : "Enroll a student in a course"
//         }
//         isLoading={isCreating || isUpdating}
//         submitLabel={selectedEnrollment ? "Update" : "Create"}
//       >
//         <EnrollmentForm
//           enrollment={selectedEnrollment || undefined}
//           students={students.map((student) => ({
//             _id: student?._id ?? "",
//             name: student.name ?? "",
//           }))}
//           courses={courses.map((c: ICourse) => ({
//             _id: c._id,
//             title: c.title,
//           }))}
//           isLoading={isCreating || isUpdating}
//           onSubmit={
//             selectedEnrollment ? handleUpdateEnrollment : handleCreateEnrollment
//           }
//         />
//       </FormDialog>

//       {/* Delete Confirmation */}
//       <ConfirmDialog
//         isOpen={isDeleteOpen}
//         onClose={() => {
//           setIsDeleteOpen(false);
//           setSelectedEnrollment(null);
//         }}
//         title="Delete Enrollment"
//         description="Are you sure you want to delete this enrollment? This action cannot be undone."
//         confirmLabel="Delete"
//         isDangerous
//         isLoading={isDeleting}
//         onConfirm={handleDeleteEnrollment}
//       />
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

export default function Enrollments() {

  return (
    <div className="space-y-8">

      Enrollment page
    </div>
  );
}
