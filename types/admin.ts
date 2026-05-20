/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICourse {
  _id: string;
  title: string;
  description: string;
  code: string;
  credits: number;
  instructorId: string;
  studentCount: number;
  enrollmentCount: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  code: string;
  credits: number;
  instructorId: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

// Enrollment Types
export interface IEnrollment {
  _id: string;
  studentId: string;
  courseId: string;
  student: {
    _id: string;
    name: string;
  };
  progress: number;
  course: ICourse;
  class?: string;
  enrollmentDate: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "DROPPED";
  grade?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentFormData {
  studentId: string;
  courseId: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "DROPPED";
  grade?: string;
}

export interface RecordedVideoFormData {
  title: string;
  description: string;
  course: string;
  videoUrl: string;
  duration: number;
  instructor?: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

// Zoom Meeting Types
export interface IZoomMeeting {
  _id: string;
  meetingId: number;
  topic: string;
  hostEmail?: string;
  hostId?: string;
  startUrl?: string;
  timezone?: string;
  password?: string;
  classTitle: string;
  description?: string;
  startTime: string;
  duration: number;
  joinUrl: string;
  courseId: string;
  instructorId: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  recordingUrl?: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ZoomMeetingFormData {
  topic: string;
  title: string;
  description?: string;
  startTime: string;
  duration: number;
  courseId: string;
  instructorId: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

// Table Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  totalCount?: number;
  page?: number;
  limit?: number;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (data: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

export interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "secondary";
}

// Stats Types
export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

// Filter Types
export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SearchFilters {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export type RecordedVideoStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ARCHIVED"
  | "DELETED";

export interface IRecordedVideo {
  _id: string;
  course: string | { _id: string; title: string };
  title: string;
  description: string;
  viewCount?: number;
  videoUrl: string;
  thumbnailUrl?: string;
  status: RecordedVideoStatus;
  createdBy?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecordedVideoFormData {
  title: string;
  description: string;
  course: string;
  videoUrl: string;
  thumbnailUrl?: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

export function getCourseId(course: IRecordedVideo["course"]): string {
  if (!course) return "";
  return typeof course === "string" ? course : course._id;
}

export function getCourseTitle(
  course: IRecordedVideo["course"],
  courses: Array<{ _id: string; title: string }>,
): string {
  if (!course) return "—";
  if (typeof course === "object" && course.title) return course.title;
  const found = courses.find((c) => c._id === course);
  return found?.title ?? (typeof course === "string" ? course : "—");
}
