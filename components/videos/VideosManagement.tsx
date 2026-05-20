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
  getCourseTitle,
} from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Film,
  Play,
  Archive,
  Edit,
  Trash2,
  Plus,
  RotateCcw,
  ExternalLink,
  Eye,
} from "lucide-react";
import {
  useCreateRecordedVideoMutation,
  useDeleteRecordedVideoMutation,
  useGetAllRecordedVideosQuery,
  useUpdateRecordedVideoMutation,
} from "@/redux/features/recordedVideo/recordedVideo.api";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { toast } from "sonner";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

function StatusBadge({ status }: { status: IRecordedVideo["status"] }) {
  const map: Record<
    IRecordedVideo["status"],
    "default" | "secondary" | "outline" | "destructive"
  > = {
    ACTIVE: "default",
    INACTIVE: "secondary",
    ARCHIVED: "outline",
    DELETED: "destructive",
  };
  return <Badge variant={map[status] ?? "outline"}>{status}</Badge>;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm break-all">{children}</span>
    </div>
  );
}

interface VideoDetailSheetProps {
  video: IRecordedVideo | null;
  courses: Array<{ _id: string; title: string }>;
  onClose: () => void;
  onEdit: (video: IRecordedVideo) => void;
}

function VideoDetailSheet({
  video,
  courses,
  onClose,
  onEdit,
}: VideoDetailSheetProps) {
  if (!video) return null;

  return (
    <Sheet open={!!video} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-lg leading-snug">
            {video.title}
          </SheetTitle>
          <SheetDescription>Recorded video details</SheetDescription>
        </SheetHeader>

        <ScrollArea className="max-h-[84vh]">
          {/* Thumbnail preview */}
        {video.thumbnailUrl && (
          <div className="px-4 mb-4 rounded-md overflow-hidden border bg-muted aspect-video">
            <Image
              width={800}
              height={800}
              priority
              quality={90}
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Separator className="mb-4" />

        <div className="divide-y divide-border px-4">
          <DetailRow label="Status">
            <StatusBadge status={video.status} />
          </DetailRow>

          <DetailRow label="Course">
            {getCourseTitle(video.course, courses)}
          </DetailRow>

          <DetailRow label="Description">
            {video.description || (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>

          <DetailRow label="Video URL">
            {video.videoUrl ? (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
              >
                Open video
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>

          {video.thumbnailUrl && (
            <DetailRow label="Thumbnail URL">
              <a
                href={video.thumbnailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
              >
                Open thumbnail
                <ExternalLink className="h-3 w-3" />
              </a>
            </DetailRow>
          )}

          <DetailRow label="Created by">
            {video.createdBy || (
              <span className="text-muted-foreground">—</span>
            )}
          </DetailRow>

          <DetailRow label="Created at">
            {new Date(video.createdAt).toLocaleString()}
          </DetailRow>

          <DetailRow label="Updated at">
            {new Date(video.updatedAt).toLocaleString()}
          </DetailRow>

          {/* <DetailRow label="ID">
            <span className="font-mono text-xs text-muted-foreground">
              {video._id}
            </span>
          </DetailRow> */}
        </div>

        <div className="mt-2 px-4">
          <Button
            className="hover:cursor-pointer w-full bg-indigo-800 hover:bg-indigo-700"
            onClick={() => {
              onClose();
              onEdit(video);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit this video
          </Button>
        </div>
        <ScrollBar orientation="vertical" />
        </ScrollArea>

      </SheetContent>
    </Sheet>
  );
}

function buildVideoColumns(
  courses: Array<{ _id: string; title: string }>,
): TableColumn<IRecordedVideo>[] {
  return [
    {
      header: "Title",
      accessor: "title",
      sortable: true,
      width: "30%",
    },
    {
      header: "Course",
      accessor: "course",
      width: "20%",
      cell: (row: IRecordedVideo) => getCourseTitle(row.course, courses),
    },
    {
      header: "Status",
      accessor: "status",
      width: "12%",
      cell: (row: IRecordedVideo) => <StatusBadge status={row.status} />,
    },
    {
      header: "Created by",
      accessor: "createdBy",
      width: "14%",
      cell: (row: IRecordedVideo) =>
        row.createdBy ? (
          row.createdBy
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      header: "Created at",
      accessor: "createdAt",
      sortable: true,
      width: "14%",
      cell: (row: IRecordedVideo) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
  ];
}

export default function VideosManagement() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { user } = useUser();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<IRecordedVideo | null>(
    null,
  );

  const { data: videosData, isLoading } = useGetAllRecordedVideosQuery({
    page,
    limit: 10,
    status: filters.status,
  });

  const { data: coursesData } = useGetAllCoursesQuery({ page: 1, limit: 100 });

  const [createVideo, { isLoading: isCreating }] =
    useCreateRecordedVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] =
    useUpdateRecordedVideoMutation();
  const [deleteVideo, { isLoading: isDeleting }] =
    useDeleteRecordedVideoMutation();

  const videos: IRecordedVideo[] = videosData?.data ?? [];
  const totalCount: number =
    videosData?.meta?.total ?? videosData?.totalCount ?? 0;
  const courses: ICourse[] = coursesData?.data ?? [];

  const coursesForForm = courses.map((c) => ({ _id: c._id, title: c.title }));

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const openCreate = () => {
    setSelectedVideo(null);
    setIsFormOpen(true);
  };

  const openEdit = (video: IRecordedVideo) => {
    setSelectedVideo(video);
    setIsFormOpen(true);
  };

  const openDetail = (video: IRecordedVideo) => {
    setSelectedVideo(video);
    setIsDetailOpen(true);
  };

  const handleCreateVideo = async (formData: RecordedVideoFormData) => {
    try {
      const createdBy = user?.name || user?.email|| "Unknown";
      await createVideo({ ...formData, createdBy }).unwrap();
      toast.success("Video uploaded successfully");
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to upload video");
    }
  };

  const handleUpdateVideo = async (formData: RecordedVideoFormData) => {
    if (!selectedVideo) return;
    try {
      await updateVideo({ id: selectedVideo._id, data: formData }).unwrap();
      toast.success("Video updated successfully");
      setIsFormOpen(false);
      setSelectedVideo(null);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to update video");
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;
    try {
      await deleteVideo(selectedVideo._id).unwrap();
      toast.success("Video deleted successfully");
      setIsDeleteOpen(false);
      setSelectedVideo(null);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to delete video");
    }
  };

  const activeCount = videos.filter((v) => v.status === "ACTIVE").length;
  const archivedCount = videos.filter((v) => v.status === "ARCHIVED").length;

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
      value: activeCount,
      icon: <Play className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Archived",
      value: archivedCount,
      icon: <Archive className="h-6 w-6" />,
      bgColor: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-600 dark:text-amber-400",
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
          onClick: openCreate,
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
        columns={buildVideoColumns(coursesForForm)}
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
                label: "View details",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => openDetail(video),
              },
              {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => openEdit(video),
              },
              ...(video.isDeleted
                ? [
                    {
                      label: "Restore",
                      icon: <RotateCcw className="h-4 w-4" />,
                      onClick: () => {
                        // wire up restore mutation here when available
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

      <VideoDetailSheet
        video={isDetailOpen ? selectedVideo : null}
        courses={coursesForForm}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedVideo(null);
        }}
        onEdit={openEdit}
      />

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
          key={selectedVideo?._id ?? "new"}
          video={selectedVideo ?? undefined}
          courses={coursesForForm}
          isLoading={isCreating || isUpdating}
          onSubmit={selectedVideo ? handleUpdateVideo : handleCreateVideo}
        />
      </FormDialog>

      {/* Delete confirmation */}
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
