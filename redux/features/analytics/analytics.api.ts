
import { baseApi } from "../baseApi";


interface TeacherAnalyticsParams {
    teacherId: string;
    startDate?: string;
    endDate?: string;
    granularity?: "day" | "week" | "month" | "year";
}

export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnalytics: builder.query({
            query: (params) => ({
                url: "/analytics/all-analytics",
                method: "GET",
                params,
            }),
            providesTags: ["PAYMENTS"],
        }),
        getTeacherAnalytics: builder.query({
            query: (params) => ({
                url: `/analytics/teacher`,
                params,
            }),
        }),
    }),
});

export const {
    useGetAllAnalyticsQuery,
    useGetTeacherAnalyticsQuery
} = analyticsApi;