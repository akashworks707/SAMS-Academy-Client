/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminDataTable } from "@/components/shared/data-table";
import { StatsCard } from "@/components/shared/stats-card";
import { ActionMenu } from "@/components/shared/action-menu";
import { FormDialog } from "@/components/shared/form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { VideoForm } from "@/components/videos/video-form";
import {
  ICourse,
  IRecordedVideo,
  RecordedVideoFormData,
  SearchFilters,
  TableColumn,
} from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Film, Play, Eye, Edit, Trash2, Plus, RotateCcw } from "lucide-react";
import {
  useCreateRecordedVideoMutation,
  useDeleteRecordedVideoMutation,
  useGetAllRecordedVideosQuery,
  useUpdateRecordedVideoMutation,
} from "@/redux/features/recordedVideo/recordedVideo.api";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";

const videoColumns: TableColumn<IRecordedVideo>[] = [
  {
    header: "Title",
    accessor: "title",
    sortable: true,
    width: "25%",
  },
  {
    header: "Course",
    accessor: "courseId",
    width: "15%",
  },
  {
    header: "Duration",
    accessor: "duration",
    width: "12%",
    cell: (data: IRecordedVideo) => {
      const hours = Math.floor(data.duration / 3600);
      const minutes = Math.floor((data.duration % 3600) / 60);
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    },
  },
  {
    header: "Views",
    accessor: "viewCount",
    width: "10%",
  },
  {
    header: "Status",
    accessor: "status",
    width: "12%",
    cell: (data: IRecordedVideo) => (
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
    header: "Uploaded",
    accessor: "uploadedAt",
    width: "12%",
    sortable: true,
    cell: (data: IRecordedVideo) =>
      new Date(data.uploadedAt).toLocaleDateString(),
  },
];

export default function VideosManagement() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<IRecordedVideo | null>(
    null,
  );

  const { data: videosData, isLoading } = useGetAllRecordedVideosQuery({
    page,
    limit: 10,
    status: filters.status,
  });

  const { data: coursesData } = useGetAllCoursesQuery({
    page: 1,
    limit: 100,
  });

  const [createVideo, { isLoading: isCreating }] =
    useCreateRecordedVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] =
    useUpdateRecordedVideoMutation();
  const [deleteVideo, { isLoading: isDeleting }] =
    useDeleteRecordedVideoMutation();

  const videos: IRecordedVideo[] = videosData?.data || [];
  const totalCount = videosData?.totalCount || 0;
  const courses: ICourse[] = coursesData?.data || [];

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleCreateVideo = async (formData: RecordedVideoFormData) => {
    try {
      await createVideo(formData).unwrap();
      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to upload video",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVideo = async (formData: RecordedVideoFormData) => {
    if (!selectedVideo) return;
    try {
      await updateVideo({
        id: selectedVideo._id,
        data: formData,
      }).unwrap();
      toast({
        title: "Success",
        description: "Video updated successfully",
      });
      setIsFormOpen(false);
      setSelectedVideo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update video",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;
    try {
      await deleteVideo(selectedVideo._id).unwrap();
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
      setIsDeleteOpen(false);
      setSelectedVideo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const activeVideos = videos.filter((v) => v.status === "ACTIVE").length;

  const stats = [
    {
      title: "Total Videos",
      value: totalCount,
      icon: <Film className="h-6 w-6" />,
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Active Videos",
      value: activeVideos,
      icon: <Play className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: <Eye className="h-6 w-6" />,
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Videos"
        description="Manage recorded course videos and lectures"
        actionButton={{
          label: "Upload Video",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            setSelectedVideo(null);
            setIsFormOpen(true);
          },
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Table */}
      <AdminDataTable<IRecordedVideo>
        columns={videoColumns}
        data={videos}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={10}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search videos..."
        actionColumn={(video) => (
          <ActionMenu
            items={[
              {
                label: "View",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => {
                  // Handle view - open in modal or new tab
                },
              },
              {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => {
                  setSelectedVideo(video);
                  setIsFormOpen(true);
                },
              },
              ...(video.isDeleted
                ? [
                    {
                      label: "Restore",
                      icon: <RotateCcw className="h-4 w-4" />,
                      onClick: () => {
                        // Handle restore
                      },
                    },
                  ]
                : [
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4" />,
                      variant: "destructive" as const,
                      onClick: () => {
                        setSelectedVideo(video);
                        setIsDeleteOpen(true);
                      },
                    },
                  ]),
            ]}
          />
        )}
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVideo(null);
        }}
        title={selectedVideo ? "Edit Video" : "Upload New Video"}
        description={
          selectedVideo
            ? "Update video details"
            : "Add a new recorded video to the system"
        }
        isLoading={isCreating || isUpdating}
        submitLabel={selectedVideo ? "Update" : "Upload"}
      >
        <VideoForm
          video={selectedVideo || undefined}
          courses={courses.map((c) => ({ _id: c._id, title: c.title }))}
          isLoading={isCreating || isUpdating}
          onSubmit={selectedVideo ? handleUpdateVideo : handleCreateVideo}
        />
      </FormDialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedVideo(null);
        }}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteVideo}
      />
    </div>
  );
}
