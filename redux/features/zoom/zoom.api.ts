import { baseApi } from "../baseApi";

export interface CreateMeetingPayload {
  courseId: string;
  subjectId: string;
  topic: string;
  startTime: string;
  duration: number;
  timezone?: string;
}

export interface UpdateMeetingPayload {
  status?: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  classTitle?: string;
  courseId?: string;
  subjectId?: string;
  duration?: number;
}

export interface GetMeetingsParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
  sort?: string;
  fields?: string;
}

export interface GetSignatureParams {
  meetingNumber: string;
  role: number;
}

export const zoomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMeeting: builder.mutation<unknown, CreateMeetingPayload>({
      query: (data) => ({
        url: "/zoom/create-meeting",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ZOOM_MEETINGS"],
    }),

    updateMeeting: builder.mutation<
      unknown,
      { id: string; data: UpdateMeetingPayload }
    >({
      query: ({ id, data }) => ({
        url: `/zoom/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["ZOOM_MEETINGS"],
    }),

    getMeetings: builder.query<unknown, GetMeetingsParams>({
      query: (params) => ({
        url: "/zoom/meetings",
        method: "GET",
        params,
      }),
      providesTags: ["ZOOM_MEETINGS"],
    }),

    getSignature: builder.query<{ signature: string }, GetSignatureParams>({
      query: (params) => ({
        url: "/zoom/signature",
        method: "GET",
        params,
      }),
    }),

    softDeleteMeeting: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/zoom/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ZOOM_MEETINGS"],
    }),

    deleteMeeting: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/zoom/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ZOOM_MEETINGS"],
    }),

    getLiveClassesByCourse: builder.query<unknown, string>({
  query: (courseId) => ({
    url: "/zoom/meetings",
    method: "GET",
    params: { courseId, limit: 200 },
  }),
  providesTags: ["ZOOM_MEETINGS"],
}),
  }),
});

export const {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useGetMeetingsQuery,
  useGetSignatureQuery,
  useLazyGetSignatureQuery,
  useSoftDeleteMeetingMutation,
  useDeleteMeetingMutation,
  useGetLiveClassesByCourseQuery,
} = zoomApi;
