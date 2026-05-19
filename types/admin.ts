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

export interface IEnrollment {
  _id: string;
  studentId: string;
  courseId: string;
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

export interface IRecordedVideo {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  videoUrl: string;
  duration: number;
  uploadedAt: string;
  instructor?: string;
  viewCount: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecordedVideoFormData {
  title: string;
  description: string;
  courseId: string;
  videoUrl: string;
  duration: number;
  instructor?: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

export interface IZoomMeeting {
  _id: string;
  meetingId: number;
  topic: string;
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
  description?: string;
  startTime: string;
  duration: number;
  courseId: string;
  instructorId: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

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
