"use client";

import React from "react";
import { useGetAllCoursesQuery } from "@/redux/features/course/course.api";
import { useGetAllEnrollmentsQuery } from "@/redux/features/enrollment/enrollment.api";
import { useGetAllRecordedVideosQuery } from "@/redux/features/recordedVideo/recordedVideo.api";
import { useGetMeetingsQuery } from "@/redux/features/zoom/zoom.api";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Film,
  Video,
  Eye,
  Clock,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import {
  ICourse,
  IEnrollment,
  IRecordedVideo,
  IZoomMeeting,
} from "@/types/admin";

export default function DashboardOverview() {
  const { data: coursesData } = useGetAllCoursesQuery({
    page: 1,
    limit: 100,
  });

  const { data: enrollmentsData } = useGetAllEnrollmentsQuery({
    page: 1,
    limit: 100,
  });

  const { data: videosData } = useGetAllRecordedVideosQuery({
    page: 1,
    limit: 100,
  });

  const { data: meetingsData } = useGetMeetingsQuery({
    page: 1,
    limit: 100,
  });

  const courses: ICourse[] = coursesData?.data || [];
  const enrollments: IEnrollment[] = enrollmentsData?.data || [];
  const videos: IRecordedVideo[] = videosData?.data || [];
  const meetings: IZoomMeeting[] = meetingsData?.data || [];

  const stats = [
    {
      title: "Total Courses",
      value: coursesData?.totalCount || 0,
      icon: <BookOpen className="h-6 w-6" />,
      trend: { value: 12, isPositive: true },
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Enrollments",
      value: enrollments.filter((e) => e.status === "ACTIVE").length,
      icon: <UserCheck className="h-6 w-6" />,
      trend: { value: 8, isPositive: true },
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Course Videos",
      value: videosData?.totalCount || 0,
      icon: <Film className="h-6 w-6" />,
      trend: { value: 15, isPositive: true },
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Zoom Meetings",
      value: meetingsData?.totalCount || 0,
      icon: <Video className="h-6 w-6" />,
      trend: { value: 5, isPositive: false },
      bgColor: "bg-orange-50 dark:bg-orange-950",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const recentActivityCards = [
    {
      title: "Active Courses",
      value: courses.filter((c) => c.status === "ACTIVE").length,
      total: courses.length,
      icon: <BookOpen className="h-6 w-6" />,
      href: "/admin/courses",
    },
    {
      title: "Student Enrollments",
      value: enrollments.length,
      total: enrollmentsData?.totalCount,
      icon: <Users className="h-6 w-6" />,
      href: "/admin/enrollments",
    },
    {
      title: "Total Views",
      value: videos.reduce((sum, v) => sum + Number(v?.viewCount ?? 0), 0),
      total: "video views",
      icon: <Eye className="h-6 w-6" />,
      href: "/admin/videos",
    },
    {
      title: "Scheduled Meetings",
      value: meetings.filter((m) => m.status === "SCHEDULED").length,
      total: meetings.length,
      icon: <Clock className="h-6 w-6" />,
      href: "/admin/zoom",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to the Sams Academy Admin Dashboard"
      />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivityCards.map((card, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-muted w-fit text-muted-foreground">
                  {card.icon}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">
                  {typeof card.total === "number"
                    ? `of ${card.total}`
                    : card.total}
                </p>
              </div>
              <Link href={card.href}>
                <Button variant="outline" size="sm" className="w-full">
                  View All
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Courses</h3>
            <Link href="/admin/courses">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.enrollmentCount} students
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    course.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  }`}
                >
                  {course.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Meetings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
            <Link href="/admin/zoom">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {meetings.slice(0, 5).map((meeting) => (
              <div
                key={meeting._id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{meeting.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(meeting.startTime).toLocaleDateString()} •{" "}
                    {meeting.participantCount} participants
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    meeting.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      : meeting.status === "COMPLETED"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  }`}
                >
                  {meeting.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
