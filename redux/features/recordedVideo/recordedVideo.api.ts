import { baseApi } from "../baseApi";

export const recordedVideoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRecordedVideo: builder.mutation({
      query: (formData) => ({
        url: "/recorded-video/create-recorded-video",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),

    getAllRecordedVideos: builder.query({
      query: (params) => ({
        url: "/recorded-video/all-recorded-videos",
        method: "GET",
        params,
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    getAllTrashRecordedVideos: builder.query({
      query: (params) => ({
        url: "/recorded-video/all-trash-recorded-videos",
        method: "GET",
        params,
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    getSingleRecordedVideo: builder.query({
      query: (id: string) => ({
        url: `/recorded-video/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "RECORDED_VIDEO", id },
      ],
    }),

    updateRecordedVideo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/recorded-video/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "RECORDED_VIDEOS",
        { type: "RECORDED_VIDEO", id },
      ],
    }),

    softDeleteRecordedVideo: builder.mutation({
      query: (id: string) => ({
        url: `/recorded-video/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),

    deleteRecordedVideo: builder.mutation({
      query: (id: string) => ({
        url: `/recorded-video/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),
  }),
});

export const {
  useCreateRecordedVideoMutation,
  useGetAllRecordedVideosQuery,
  useGetAllTrashRecordedVideosQuery,
  useGetSingleRecordedVideoQuery,
  useUpdateRecordedVideoMutation,
  useSoftDeleteRecordedVideoMutation,
  useDeleteRecordedVideoMutation,
} = recordedVideoApi;