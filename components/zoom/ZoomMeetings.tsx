/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminDataTable } from "@/components/shared/data-table";
import { StatsCard } from "@/components/shared/stats-card";
import { ActionMenu } from "@/components/shared/action-menu";
import { FormDialog } from "@/components/shared/form-dialog";
import { ZoomForm } from "@/components/zoom/zoom-form";
import { ZoomDetailsModal } from "@/components/zoom/ZoomDetailsModal";
import { ZoomMeetingEmbedModal } from "./ZoomMeetingEmbedModal";
import {
  IZoomMeeting,
  SearchFilters,
  TableColumn,
  ICourse,
} from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, Eye, Plus, Tv2, Edit } from "lucide-react";
import {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useGetMeetingsQuery,
} from "@/redux/features/zoom/zoom.api";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { useGetSubjectsQuery } from "@/redux/features/subjects/subject.api";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { CreateMeetingPayload } from "@/redux/features/zoom/zoom.api";

const meetingColumns: TableColumn<IZoomMeeting>[] = [
  {
    header: "Topic",
    accessor: "topic",
    sortable: true,
    width: "22%",
  },
  {
    header: "Course",
    accessor: "courseId",
    width: "15%",
    cell: (row: IZoomMeeting) => row.classTitle,
  },
  {
    header: "Start Time",
    accessor: "startTime",
    width: "18%",
    sortable: true,
    cell: (row: IZoomMeeting) => new Date(row.startTime).toLocaleString(),
  },
  {
    header: "Duration",
    accessor: "duration",
    width: "10%",
    cell: (row: IZoomMeeting) => `${row.duration} min`,
  },
  {
    header: "Status",
    accessor: "status",
    width: "12%",
    cell: (row: IZoomMeeting) => {
      const map = {
        SCHEDULED: "default",
        LIVE: "secondary",
        COMPLETED: "outline",
        CANCELLED: "destructive",
      } as const;
      return <Badge variant={map[row.status] ?? "default"}>{row.status}</Badge>;
    },
  },
];

export default function ZoomMeetings() {
  const { user } = useUser();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<IZoomMeeting | null>(
    null,
  );

  const {
    data: meetingsData,
    refetch,
    isLoading,
  } = useGetMeetingsQuery({
    page,
    limit: 10,
    status: filters.status,
    searchTerm: filters.search,
  });

  const { data: coursesData } = useGetAllCoursesQuery({ page: 1, limit: 100 });
  const { data: subjectsData } = useGetSubjectsQuery({ page: 1, limit: 100 });

  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] = useUpdateMeetingMutation();

  const meetings: IZoomMeeting[] = (meetingsData as any)?.data ?? [];
  const totalCount: number = (meetingsData as any)?.meta?.total ?? 0;
  const courses: ICourse[] = coursesData?.data ?? [];
  const subjects: Array<{ _id: string; title: string }> =
    (subjectsData as any)?.data ?? [];

  const scheduledCount = meetings.filter(
    (m) => m.status === "SCHEDULED",
  ).length;
  const completedCount = meetings.filter(
    (m) => m.status === "COMPLETED",
  ).length;
  const inLiveCount = meetings.filter(
    (m) => m.status === "LIVE",
  ).length;

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
      value: scheduledCount,
      icon: <Clock className="h-6 w-6" />,
      bgColor: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "In Live",
      value: inLiveCount,
      icon: <Tv2 className="h-6 w-6" />,
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: <Video className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleCreateMeeting = async (formData: CreateMeetingPayload) => {
    try {
      await createMeeting(formData).unwrap();
      toast.success("Meeting scheduled successfully", {
        description: "The Zoom meeting has been created.",
      });
      refetch();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error("Failed to schedule meeting", {
        description: error?.data?.message ?? "Something went wrong",
      });
    }
  };

  const handleUpdateStatus = async (
    meeting: IZoomMeeting,
    status: IZoomMeeting["status"],
  ) => {
    try {
      await updateMeeting({ id: meeting._id, data: { status } }).unwrap();
      toast.success(`Meeting marked as ${status}`);
      refetch();
    } catch (error: any) {
      toast.error("Update failed", {
        description: error?.data?.message ?? "Could not update meeting",
      });
    }
  };

  const embedRole: 0 | 1 =
    user?.role === "ADMIN" || user?.role === "TEACHER" ? 1 : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Zoom Meetings"
        description="Schedule and manage live Zoom sessions — join directly in the browser"
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
        searchPlaceholder="Search meetings…"
        actionColumn={(meeting) => (
          <ActionMenu
            items={[
              {
                label: "Join Meeting",
                icon: <Tv2 className="h-4 w-4" />,
                onClick: () => {
                  setSelectedMeeting(meeting);
                  setIsEmbedOpen(true);
                },
              },
              {
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {
                  setSelectedMeeting(meeting);
                  setIsDetailsOpen(true);
                },
              },
              ...(user?.role === "ADMIN" || user?.role === "TEACHER"
                ? [
                
                    {
                      label: "Mark As Live",
                      icon: <Edit className="h-4 w-4" />,
                      onClick: () => handleUpdateStatus(meeting, "LIVE"),
                      disabled: meeting.status !== "SCHEDULED",
                    },
                    {
                      label: "Mark Completed",
                      icon: <Edit className="h-4 w-4" />,
                      onClick: () => handleUpdateStatus(meeting, "COMPLETED"),
                      disabled: meeting.status === "COMPLETED",
                    },
                    {
                      label: "Cancel Meeting",
                      icon: <Edit className="h-4 w-4" />,
                      variant: "destructive" as const,
                      onClick: () => handleUpdateStatus(meeting, "CANCELLED"),
                      disabled: meeting.status === "CANCELLED",
                    },
                  ]
                : []),
            ]}
          />
        )}
      />

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
        isLoading={isCreating || isUpdating}
        submitLabel={selectedMeeting ? "Update" : "Schedule"}
      >
        <ZoomForm
          meeting={selectedMeeting ?? undefined}
          courses={courses.map((c) => ({ _id: c._id, title: c.title }))}
          subjects={subjects}
          isLoading={isCreating || isUpdating}
          onSubmit={handleCreateMeeting}
        />
      </FormDialog>

      <ZoomDetailsModal
        meeting={selectedMeeting}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedMeeting(null);
        }}
      />

      <ZoomMeetingEmbedModal
        meeting={selectedMeeting}
        isOpen={isEmbedOpen}
        role={embedRole}
      userName={user?.name}
      userEmail={user?.email}
        onClose={() => {
          setIsEmbedOpen(false);
          setSelectedMeeting(null);
        }}
      />
    </div>
  );
}
