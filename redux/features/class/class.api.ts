import { baseApi } from "../baseApi";

export interface CreateClassPayload {
  title: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateClassPayload {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface GetClassesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  fields?: string;
  isActive?: boolean;
}

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClass: builder.mutation<unknown, CreateClassPayload>({
      query: (data) => ({
        url: "/class/create-class",
        method: "POST",
        data,
      }),
      invalidatesTags: ["CLASSES"],
    }),

    updateClass: builder.mutation<unknown, { id: string; data: UpdateClassPayload }>({
      query: ({ id, data }) => ({
        url: `/class/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["CLASSES"],
    }),

    getClasses: builder.query<unknown, GetClassesParams>({
      query: (params) => ({
        url: "/class/all-classes",
        method: "GET",
        params,
      }),
      providesTags: ["CLASSES"],
    }),

    getTrashClasses: builder.query<unknown, GetClassesParams>({
      query: (params) => ({
        url: "/class/all-trash-classes",
        method: "GET",
        params,
      }),
      providesTags: ["CLASSES"],
    }),

    getSingleClass: builder.query<unknown, string>({
      query: (id) => ({
        url: `/class/${id}`,
        method: "GET",
      }),
      providesTags: ["CLASSES"],
    }),

    softDeleteClass: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/class/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["CLASSES"],
    }),

    deleteClass: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CLASSES"],
    }),
  }),
});

export const {
  useCreateClassMutation,
  useUpdateClassMutation,
  useGetClassesQuery,
  useGetTrashClassesQuery,
  useGetSingleClassQuery,
  useSoftDeleteClassMutation,
  useDeleteClassMutation,
} = classApi;