
import { IResponse } from "@/types";
import { baseApi } from "../baseApi";
import { ICourse } from "@/types/course.types";
import { IPaginationMeta } from "@/types/user";

export interface CreateCoursePayload {
  title: string;
  description?: string;
  class: string;
  batch?: string;
  regularPrice?: number;
  discountPrice?: number;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  courseStartDate?: string;
  courseEndDate?: string;
  duration?: string;
  totalClasses?: number;
  certificate?: boolean;
  status?: "upcoming" | "running" | "completed";
  isFeatured?: boolean;
  isActive?: boolean;
  assignSubWithTeacher?: { subject: string; teacher: string }[];
}

export interface GetAllCourseResponse {
  success: boolean;
  data: ICourse[];
  meta: IPaginationMeta;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> { }

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  fields?: string;
  isActive?: boolean;
  status?: string;
}



export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<IResponse<ICourse>, FormData>({
      query: (formData) => ({
        url: "/course/create-course",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["COURSES"],
    }),

    updateCourse: builder.mutation<IResponse<ICourse>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/course/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["COURSES"],
    }),

    getCourses: builder.query<GetAllCourseResponse, GetCoursesParams>({
      query: (params) => ({
        url: "/course/all-courses",
        method: "GET",
        params,
      }),
      providesTags: ["COURSES"],
    }),

    getTrashCourses: builder.query<GetAllCourseResponse, GetCoursesParams>({
      query: (params) => ({
        url: "/course/all-trash-courses",
        method: "GET",
        params,
      }),
      providesTags: ["COURSES"],
    }),

    getSingleCourse: builder.query<ICourse, string>({
      query: (slug) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      providesTags: ["COURSES"],
    }),

    getMyCourses: builder.query<GetAllCourseResponse, void>({
      query: () => ({
        url: "/course/my-courses",
        method: "GET",
      }),
      providesTags: ["COURSES"],
    }),

    softDeleteCourse: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/course/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["COURSES"],
    }),

    deleteCourse: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COURSES"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCoursesQuery,
  useGetTrashCoursesQuery,
  useGetSingleCourseQuery,
  useGetMyCoursesQuery,
  useSoftDeleteCourseMutation,
  useDeleteCourseMutation,
} = courseApi;