import { baseApi } from "../baseApi";

export interface CreateSubjectPayload {
  title: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export interface UpdateSubjectPayload {
  title?: string;
  description?: string;
  code?: string;
  isActive?: boolean;
}

export interface GetSubjectsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  fields?: string;
  isActive?: boolean;
}

export const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubject: builder.mutation<unknown, CreateSubjectPayload>({
      query: (data) => ({
        url: "/subject/create-subject",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SUBJECTS"],
    }),

    updateSubject: builder.mutation<
      unknown,
      { id: string; data: UpdateSubjectPayload }
    >({
      query: ({ id, data }) => ({
        url: `/subject/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["SUBJECTS"],
    }),

    getSubjects: builder.query<unknown, GetSubjectsParams>({
      query: (params) => ({
        url: "/subject/all-subjects",
        method: "GET",
        params,
      }),
      providesTags: ["SUBJECTS"],
    }),

    getTrashSubjects: builder.query<unknown, GetSubjectsParams>({
      query: (params) => ({
        url: "/subject/all-trash-subjects",
        method: "GET",
        params,
      }),
      providesTags: ["SUBJECTS"],
    }),

    getSingleSubject: builder.query<unknown, string>({
      query: (id) => ({
        url: `/subject/${id}`,
        method: "GET",
      }),
      providesTags: ["SUBJECTS"],
    }),

    softDeleteSubject: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/subject/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SUBJECTS"],
    }),

    deleteSubject: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUBJECTS"],
    }),
  }),
});

export const {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useGetSubjectsQuery,
  useGetTrashSubjectsQuery,
  useGetSingleSubjectQuery,
  useSoftDeleteSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
