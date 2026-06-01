import { baseApi } from "../baseApi";
import { IResponse } from "@/types";
import { RecordedVideoStatus } from "@/types/admin";
import { ICourseRecordedVideo } from "@/types/recorded-video.api";
import { IPaginationMeta } from "@/types/user";

// ─── Request / Response shapes ─────────────────────────────────────────────────

export interface CreateRecordedVideoPayload {
  course: string;
  subject: string;
  title: string;
  description?: string;
  videoUrl: string;
  status?: RecordedVideoStatus;
}

export interface UpdateRecordedVideoPayload
  extends Partial<CreateRecordedVideoPayload> {}

export interface GetRecordedVideosParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  course?: string;
  subject?: string;
  status?: RecordedVideoStatus;
}

export interface GetAllRecordedVideosResponse {
  success: boolean;
  data: ICourseRecordedVideo[];
  meta: IPaginationMeta;
}

// ─── API slice ─────────────────────────────────────────────────────────────────

export const recordedVideoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ── Create ──────────────────────────────────────────────────────────────────
    createRecordedVideo: builder.mutation<
      IResponse<ICourseRecordedVideo>,
      FormData
    >({
      query: (formData) => ({
        url: "/recorded-video/create-recorded-video",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Get all (active) ────────────────────────────────────────────────────────
    getRecordedVideos: builder.query<
      GetAllRecordedVideosResponse,
      GetRecordedVideosParams
    >({
      query: (params) => ({
        url: "/recorded-video/all-recorded-videos",
        method: "GET",
        params,
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Get all videos for a specific course ────────────────────────────────────
    getRecordedVideosByCourse: builder.query<
      GetAllRecordedVideosResponse,
      string // courseId
    >({
      query: (courseId) => ({
        url: "/recorded-video/all-recorded-videos",
        method: "GET",
        params: { course: courseId, limit: 200 },
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Get all videos for a course filtered by subject ─────────────────────────
    getRecordedVideosByCourseAndSubject: builder.query<
      GetAllRecordedVideosResponse,
      { courseId: string; subjectId: string }
    >({
      query: ({ courseId, subjectId }) => ({
        url: "/recorded-video/all-recorded-videos",
        method: "GET",
        params: { course: courseId, subject: subjectId, limit: 200 },
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Get trash ───────────────────────────────────────────────────────────────
    getTrashRecordedVideos: builder.query<
      GetAllRecordedVideosResponse,
      GetRecordedVideosParams
    >({
      query: (params) => ({
        url: "/recorded-video/all-trash-recorded-videos",
        method: "GET",
        params,
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Get single ──────────────────────────────────────────────────────────────
    getSingleRecordedVideo: builder.query<
      IResponse<ICourseRecordedVideo>,
      string // id
    >({
      query: (id) => ({
        url: `/recorded-video/${id}`,
        method: "GET",
      }),
      providesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Update ──────────────────────────────────────────────────────────────────
    updateRecordedVideo: builder.mutation<
      IResponse<ICourseRecordedVideo>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/recorded-video/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Soft delete ─────────────────────────────────────────────────────────────
    softDeleteRecordedVideo: builder.mutation<
      IResponse<{ id: string }>,
      string // id
    >({
      query: (id) => ({
        url: `/recorded-video/soft-delete/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),

    // ── Hard delete ─────────────────────────────────────────────────────────────
    deleteRecordedVideo: builder.mutation<
      IResponse<{ id: string }>,
      string // id
    >({
      query: (id) => ({
        url: `/recorded-video/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RECORDED_VIDEOS"],
    }),
  }),
});

export const {
  useCreateRecordedVideoMutation,
  useGetRecordedVideosQuery,
  useGetRecordedVideosByCourseQuery,
  useGetRecordedVideosByCourseAndSubjectQuery,
  useGetTrashRecordedVideosQuery,
  useGetSingleRecordedVideoQuery,
  useUpdateRecordedVideoMutation,
  useSoftDeleteRecordedVideoMutation,
  useDeleteRecordedVideoMutation,
} = recordedVideoApi;