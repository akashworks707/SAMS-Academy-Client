import { baseApi } from "../baseApi";

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrollment: builder.mutation({
      query: (data) => ({
        url: "/enrollment/create-enrollment",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ENROLLMENTS"],
    }),

    getAllEnrollments: builder.query({
      query: (params) => ({
        url: "/enrollment/all-enrollments",
        method: "GET",
        params,
      }),
      providesTags: ["ENROLLMENTS"],
    }),

    getAllTrashEnrollments: builder.query({
      query: (params) => ({
        url: "/enrollment/all-trash-enrollments",
        method: "GET",
        params,
      }),
      providesTags: ["ENROLLMENTS"],
    }),

    getSingleEnrollment: builder.query({
      query: (id: string) => ({
        url: `/enrollment/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "ENROLLMENT", id },
      ],
    }),

    updateEnrollment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/enrollment/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "ENROLLMENTS",
        { type: "ENROLLMENT", id },
      ],
    }),

    softDeleteEnrollment: builder.mutation({
      query: (id: string) => ({
        url: `/enrollment/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ENROLLMENTS"],
    }),

    deleteEnrollment: builder.mutation({
      query: (id: string) => ({
        url: `/enrollment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ENROLLMENTS"],
    }),
  }),
});

export const {
  useCreateEnrollmentMutation,
  useGetAllEnrollmentsQuery,
  useGetAllTrashEnrollmentsQuery,
  useGetSingleEnrollmentQuery,
  useUpdateEnrollmentMutation,
  useSoftDeleteEnrollmentMutation,
  useDeleteEnrollmentMutation,
} = enrollmentApi;