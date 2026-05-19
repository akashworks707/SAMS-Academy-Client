import { baseApi } from "../baseApi";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "/course/create-course",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["COURSES"],
    }),

    getMyCourses: builder.query({
      query: () => ({
        url: "/course/my-courses",
        method: "GET",
      }),
      providesTags: ["COURSES"],
    }),

    getAllCourses: builder.query({
      query: (params) => ({
        url: "/course/all-courses",
        method: "GET",
        params,
      }),
      providesTags: ["COURSES"],
    }),

    getAllTrashCourses: builder.query({
      query: (params) => ({
        url: "/course/all-trash-courses",
        method: "GET",
        params,
      }),
      providesTags: ["COURSES"],
    }),

    getSingleCourse: builder.query({
      query: (slug: string) => ({
        url: `/course/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "COURSE", id: slug },
      ],
    }),

    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/course/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "COURSES",
        { type: "COURSE", id },
      ],
    }),

    softDeleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/course/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["COURSES"],
    }),

    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COURSES"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetMyCoursesQuery,
  useGetAllCoursesQuery,
  useGetAllTrashCoursesQuery,
  useGetSingleCourseQuery,
  useUpdateCourseMutation,
  useSoftDeleteCourseMutation,
  useDeleteCourseMutation,
} = courseApi;