import { IClass } from "./class.types";
import { ISubject } from "./subject.types";
import { IUser } from "./user.types";

export interface IReview {
  user: string;

  rating: number;

  comment: string;

  date: Date;
}

export interface ICourse {
  _id: string;
  title: string;

  slug?: string;

  description?: string;

  thumbnail?: string;

  class: IClass | string;

  batch?: string;

  assignSubWithTeacher: {
    subject: ISubject | string;
    teacher: IUser | string;
  }[];

  regularPrice?: number;

  discountPrice?: number;

  enrollmentStartDate?: Date;

  enrollmentEndDate?: Date;

  courseStartDate?: Date;

  courseEndDate?: Date;

  duration?: string;

  totalClasses?: number;

  certificate?: boolean;

  status?: "upcoming" | "running" | "completed";

  ratings?: number;

  reviews?: IReview[];

  isFeatured?: boolean;

  isDeleted?: boolean;

  isActive?: boolean;
}