// import {
//   IRegisterResponse,
//   IUser,
//   IUserApiResponse,
//   IResponse,
//   GetQueryParams,
// } from "@/types/user";
// import { baseApi } from "../baseApi";

import { IUser } from "@/types";
import { baseApi } from "../baseApi";
import { IPaginationMeta, IRegisterResponse } from "@/types/user";


// interface GetAllUsersResponse {
//   success: boolean;
//   data: IUser[];
//   meta: {
//     total: number;
//     totalPage: number;

//     totalStaffs: number;
//     totalFixedSalary: number;
//     totalSalaryByProduct: number;
//     totalSalary: number;
//   };
// }

// export const userApi = baseApi.injectEndpoints({
//   // CREATE USER
//   endpoints: (builder) => ({
//     register: builder.mutation<IResponse<IRegisterResponse>, FormData>({
//       query: (formData) => ({
//         url: "/user/create-user",
//         method: "POST",
//         data: formData,
//       }),
//       invalidatesTags: () => ["USERS"],
//     }),

//     updateUser: builder.mutation<
//       IResponse<IUser>,
//       { id: string; data: FormData }
//     >({
//       query: ({ id, data }) => ({
//         url: `/user/${id}`,
//         method: "PATCH",
//         data: data,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         "USERS",
//         { type: "USER", id },
//       ],
//     }),

//     updateUserPermissions: builder.mutation({
//       query: ({ id, permissions }) => ({
//         url: `/user/${id}/permissions`,
//         method: "PATCH",
//         data: { permissions },
//       }),
//     }),

//     deleteUser: builder.mutation<IResponse<{ id: string }>, string>({
//       query: (id) => ({
//         url: `/user/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, error, id) => ["USERS", { type: "USER", id }],
//     }),

//     getSingleUser: builder.query<IUserApiResponse, string>({
//       query: (id) => ({
//         url: `/user/${id}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, id) => [{ type: "USER", id }],
//     }),

//     getAllUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
//       query: (params) => ({
//         url: "/user/all-users",
//         method: "GET",
//         params: params,
//       }),
//       providesTags: ["USERS"],
//     }),
//     getAllStudents: builder.query<GetAllUsersResponse, GetQueryParams>({
//       query: (params) => ({
//         url: "/user/all-students",
//         method: "GET",
//         params: params,
//       }),
//       providesTags: ["USERS"],
//     }),

//     getMe: builder.query<IUserApiResponse, void>({
//       query: () => ({
//         url: "/user/me",
//         method: "GET",
//       }),

//       providesTags: ["ME", "USER"],
//     }),

//     getAllTrashUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
//       query: (params) => ({
//         url: "/user/all-trash-users",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["USERS"],
//     }),

//     trashUpdateUser: builder.mutation<IResponse<IUser>, { _id: string }>({
//       query: ({ _id }) => ({
//         url: `/user/user-trash/${_id}`,
//         method: "POST",
//       }),
//       invalidatesTags: (result, error, { _id }) => [
//         "USERS",
//         { type: "USER", _id },
//       ],
//     }),
//   }),
// });

// export const {
//   useRegisterMutation,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
//   useGetSingleUserQuery,
//   useUpdateUserPermissionsMutation,
//   useGetAllUsersQuery,
//   useGetAllStudentsQuery,
//   useGetMeQuery,
//   useGetAllTrashUsersQuery,
//   useTrashUpdateUserMutation,
// } = userApi;


// import { baseApi } from "@/redux/api/baseApi";
// 
// ─── Types ────────────────────────────────────────────────────────────────────

// import { baseApi } from "../baseApi";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  role?: string;
}

interface GetAllUsersResponse {
    success: boolean;
    data: IUser[];
    meta: IPaginationMeta;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create user (teacher/student) — FormData
    createUser: builder.mutation<IRegisterResponse, FormData>({
      query: (formData) => ({
        url: "/user/create-user",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["TEACHERS", "STUDENTS"],
    }),

    // Update user by id — FormData
    updateUser: builder.mutation<unknown, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["TEACHERS", "STUDENTS"],
    }),

    // Update own profile
    updateProfile: builder.mutation<unknown, FormData>({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["TEACHERS", "STUDENTS"],
    }),

    // Get current user
    getMe: builder.query<unknown, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),

    // Get all users
    getAllUsers: builder.query<unknown, GetUsersParams | undefined>({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params,
      }),
      providesTags: ["TEACHERS", "STUDENTS"],
    }),

    // Get all teachers
    getAllTeachers: builder.query<GetAllUsersResponse, GetUsersParams | undefined>({
      query: (params) => ({
        url: "/user/all-teachers",
        method: "GET",
        params,
      }),
      providesTags: ["TEACHERS"],
    }),

    // Get all students
    getAllStudents: builder.query<unknown, GetUsersParams | undefined>({
      query: (params) => ({
        url: "/user/all-students",
        method: "GET",
        params,
      }),
      providesTags: ["STUDENTS"],
    }),

    // Get single user
    getSingleUser: builder.query<unknown, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["TEACHERS", "STUDENTS"],
    }),

    // Delete user
    deleteUser: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TEACHERS", "STUDENTS"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useGetMeQuery,
  useGetAllUsersQuery,
  useGetAllTeachersQuery,
  useGetAllStudentsQuery,
  useGetSingleUserQuery,
  useDeleteUserMutation,
} = userApi;