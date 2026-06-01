export enum RecordedVideoStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export interface ICourseRecordedVideo {
  _id: string;
  course: string;
  subject: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  status: RecordedVideoStatus;
  createdBy?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}