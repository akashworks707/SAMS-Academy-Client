/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminDataTable } from "@/components/shared/data-table";
import { StatsCard } from "@/components/shared/stats-card";
import { ActionMenu } from "@/components/shared/action-menu";
import { FormDialog } from "@/components/shared/form-dialog";
import { ZoomForm } from "@/components/zoom/zoom-form";
import {
  IZoomMeeting,
  ZoomMeetingFormData,
  SearchFilters,
  TableColumn,
  ICourse,
} from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Video, Users, Clock, Eye, Plus, ExternalLink } from "lucide-react";
import {
  useCreateMeetingMutation,
  useGetMeetingsQuery,
} from "@/redux/features/zoom/zoom.api";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";

const meetingColumns: TableColumn<IZoomMeeting>[] = [
  {
    header: "Topic",
    accessor: "topic",
    sortable: true,
    width: "25%",
  },
  {
    header: "Course",
    accessor: "courseId",
    width: "15%",
  },
  {
    header: "Start Time",
    accessor: "startTime",
    width: "18%",
    sortable: true,
    cell: (data: IZoomMeeting) => new Date(data.startTime).toLocaleString(),
  },
  {
    header: "Duration",
    accessor: "duration",
    width: "10%",
    cell: (data: IZoomMeeting) => `${data.duration} min`,
  },
  {
    header: "Participants",
    accessor: "participantCount",
    width: "10%",
    cell: (data: IZoomMeeting) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        {data.participantCount}
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    width: "12%",
    cell: (data: IZoomMeeting) => {
      const statusColors = {
        SCHEDULED: "default",
        IN_PROGRESS: "secondary",
        COMPLETED: "outline",
        CANCELLED: "destructive",
      } as const;
      return (
        <Badge variant={statusColors[data.status] || "default"}>
          {data.status}
        </Badge>
      );
    },
  },
];

export default function ZoomMeetings() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<IZoomMeeting | null>(
    null,
  );

  const { data: meetingsData, isLoading } = useGetMeetingsQuery({
    page,
    limit: 10,
    status: filters.status,
  });

  const { data: coursesData } = useGetAllCoursesQuery({
    page: 1,
    limit: 100,
  });

  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  // const [updateMeeting, { isLoading: isUpdating }] =
  //   useUpdateZoomMeetingMutation();
  // const [deleteMeeting, { isLoading: isDeleting }] =
  //   useDeleteZoomMeetingMutation();

  const meetings: IZoomMeeting[] = meetingsData?.data || [];
  const totalCount = meetingsData?.totalCount || 0;
  const courses: ICourse[] = coursesData?.data || [];

  const mockInstructors = [
    { _id: "1", name: "Dr. John Smith" },
    { _id: "2", name: "Prof. Jane Doe" },
    { _id: "3", name: "Dr. Robert Johnson" },
  ];

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleCreateMeeting = async (formData: ZoomMeetingFormData) => {
    try {
      await createMeeting(formData).unwrap();
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to schedule meeting",
        variant: "destructive",
      });
    }
  };

  // const handleUpdateMeeting = async (formData: ZoomMeetingFormData) => {
  //   if (!selectedMeeting) return;
  //   try {
  //     await updateMeeting({
  //       id: selectedMeeting._id,
  //       data: formData,
  //     }).unwrap();
  //     toast({
  //       title: "Success",
  //       description: "Meeting updated successfully",
  //     });
  //     setIsFormOpen(false);
  //     setSelectedMeeting(null);
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.data?.message || "Failed to update meeting",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleDeleteMeeting = async () => {
  //   if (!selectedMeeting) return;
  //   try {
  //     await deleteMeeting(selectedMeeting._id).unwrap();
  //     toast({
  //       title: "Success",
  //       description: "Meeting deleted successfully",
  //     });
  //     setIsDeleteOpen(false);
  //     setSelectedMeeting(null);
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.data?.message || "Failed to delete meeting",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const scheduledMeetings = meetings.filter(
    (m) => m.status === "SCHEDULED",
  ).length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "COMPLETED",
  ).length;
  const totalParticipants = meetings.reduce(
    (sum, m) => sum + m.participantCount,
    0,
  );

  const stats = [
    {
      title: "Total Meetings",
      value: totalCount,
      icon: <Video className="h-6 w-6" />,
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Scheduled",
      value: scheduledMeetings,
      icon: <Clock className="h-6 w-6" />,
      bgColor: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Completed",
      value: completedMeetings,
      icon: <Video className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Participants",
      value: totalParticipants.toLocaleString(),
      icon: <Users className="h-6 w-6" />,
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Zoom Meetings"
        description="Schedule and manage Zoom meetings for courses"
        actionButton={{
          label: "Schedule Meeting",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            setSelectedMeeting(null);
            setIsFormOpen(true);
          },
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Table */}
      <AdminDataTable<IZoomMeeting>
        columns={meetingColumns}
        data={meetings}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={10}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search meetings..."
        actionColumn={(meeting) => (
          <ActionMenu
            items={[
              {
                label: "Open Meeting",
                icon: <ExternalLink className="h-4 w-4" />,
                onClick: () => {
                  if (meeting.joinUrl) {
                    window.open(meeting.joinUrl, "_blank");
                  }
                },
              },
              {
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {
                  // Handle view
                },
              },
              // {
              //   label: "Edit",
              //   icon: <Edit className="h-4 w-4" />,
              //   onClick: () => {
              //     setSelectedMeeting(meeting);
              //     setIsFormOpen(true);
              //   },
              // },
              // {
              //   label: "Delete",
              //   icon: <Trash2 className="h-4 w-4" />,
              //   variant: "destructive",
              //   onClick: () => {
              //     setSelectedMeeting(meeting);
              //     setIsDeleteOpen(true);
              //   },
              // },
            ]}
          />
        )}
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMeeting(null);
        }}
        title={selectedMeeting ? "Edit Meeting" : "Schedule New Meeting"}
        description={
          selectedMeeting
            ? "Update meeting details"
            : "Create a new Zoom meeting"
        }
        isLoading={isCreating}
        submitLabel={selectedMeeting ? "Update" : "Schedule"}
      >
        <ZoomForm
          meeting={selectedMeeting || undefined}
          courses={courses.map((c) => ({ _id: c._id, title: c.title }))}
          instructors={mockInstructors}
          isLoading={isCreating}
          onSubmit={handleCreateMeeting}
        />
      </FormDialog>

      {/* Delete Confirmation */}
      {/* <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedMeeting(null);
        }}
        title="Delete Meeting"
        description="Are you sure you want to delete this meeting? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteMeeting}
      /> */}
    </div>
  );
}
