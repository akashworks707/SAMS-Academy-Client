
import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPayments: builder.query({
            query: (params) => ({
                url: "/payment/all-payments",
                method: "GET",
                params,
            }),
            providesTags: ["PAYMENTS"],
        }),
        getSinglePayment: builder.query({
            query: (id: string) => ({
                url: `/payment/${id}`,
                method: "GET",
            }),
            providesTags: ["PAYMENTS"],
        }),
        adminUpdatePayment: builder.mutation({
            query: ({ id, data }: { id: string; data: any }) => ({
                url: `/payment/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: ["PAYMENTS"],
        }),
        deletePayment: builder.mutation({
            query: (id: string) => ({
                url: `/payment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PAYMENTS"],
        }),
    }),
});

export const {
    useGetAllPaymentsQuery,
    useGetSinglePaymentQuery,
    useAdminUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentApi;