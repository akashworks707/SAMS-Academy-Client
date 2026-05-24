// import { baseApi } from "../baseApi";

// export const courseApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     createCourse: builder.mutation({
//       query: (formData) => ({
//         url: "/course/create-course",
//         method: "POST",
//         data: formData,
//       }),
//       invalidatesTags: ["COURSES"],
//     }),

//     getMyCourses: builder.query({
//       query: () => ({
//         url: "/course/my-courses",
//         method: "GET",
//       }),
//       providesTags: ["COURSES"],
//     }),

//     getAllCourses: builder.query({
//       query: (params) => ({
//         url: "/course/all-courses",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["COURSES"],
//     }),

//     getAllTrashCourses: builder.query({
//       query: (params) => ({
//         url: "/course/all-trash-courses",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["COURSES"],
//     }),

//     getSingleCourse: builder.query({
//       query: (slug: string) => ({
//         url: `/course/${slug}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, slug) => [
//         { type: "COURSE", id: slug },
//       ],
//     }),

//     updateCourse: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/course/${id}`,
//         method: "PATCH",
//         data,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         "COURSES",
//         { type: "COURSE", id },
//       ],
//     }),

//     softDeleteCourse: builder.mutation({
//       query: (id: string) => ({
//         url: `/course/soft-delete/${id}`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["COURSES"],
//     }),

//     deleteCourse: builder.mutation({
//       query: (id: string) => ({
//         url: `/course/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["COURSES"],
//     }),
//   }),
// });

// export const {
//   useCreateCourseMutation,
//   useGetMyCoursesQuery,
//   useGetAllCoursesQuery,
//   useGetAllTrashCoursesQuery,
//   useGetSingleCourseQuery,
//   useUpdateCourseMutation,
//   useSoftDeleteCourseMutation,
//   useDeleteCourseMutation,
// } = courseApi;

import { baseApi } from "../baseApi";

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

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {}

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
    createCourse: builder.mutation<unknown, FormData>({
      query: (formData) => ({
        url: "/course/create-course",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["COURSES"],
    }),

    updateCourse: builder.mutation<unknown, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/course/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["COURSES"],
    }),

    getCourses: builder.query<unknown, GetCoursesParams>({
      query: (params) => ({
        url: "/course/all-courses",
        method: "GET",
        params,
      }),
      providesTags: ["COURSES"],
    }),

    getTrashCourses: builder.query<unknown, GetCoursesParams>({
      query: (params) => ({
        url: "/course/all-trash-courses",
        method: "GET",
        params,
      }),
      providesTags: ["COURSES"],
    }),

    getSingleCourse: builder.query<unknown, string>({
      query: (slug) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      providesTags: ["COURSES"],
    }),

    getMyCourses: builder.query<unknown, void>({
      query: () => ({
        url: "/course/my-courses",
        method: "GET",
      }),
      providesTags: ["COURSES"],
    }),

    softDeleteCourse: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/course/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["COURSES"],
    }),

    deleteCourse: builder.mutation<unknown, string>({
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