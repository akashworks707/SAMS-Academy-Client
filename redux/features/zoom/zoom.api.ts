import { baseApi } from "../baseApi";

export const zoomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (data) => ({
        url: "/zoom/create-meeting",
        method: "POST",
        data,
      }),
    }),

    getSignature: builder.query({
      query: (params) => ({
        url: "/zoom/signature",
        method: "GET",
        params,
      }),
    }),

    getMeetings: builder.query({
      query: () => ({
        url: "/zoom/meetings",
        method: "GET",
      }),
      providesTags: ["ZOOM_MEETINGS"],
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useGetSignatureQuery,
  useGetMeetingsQuery,
} = zoomApi;