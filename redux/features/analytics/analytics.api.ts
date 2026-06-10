
import { baseApi } from "../baseApi";

export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllAnalytics: builder.query({
            query: (params) => ({
                url: "/analytics/all-analytics",
                method: "GET",
                params,
            }),
            providesTags: ["PAYMENTS"],
        })  
    }),
});

export const {
    useGetAllAnalyticsQuery
} = analyticsApi;