import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USERS", "USER", "ME", "ZOOM_MEETINGS",
    "RECORDED_VIDEOS","RECORDED_VIDEO",
    "ENROLLMENTS", "ENROLLMENT",
    "COURSES",
    "COURSE",
    "SUBJECTS",
    "CLASSES",
    "STUDENTS",
    "TEACHERS"
  
  
  
  ],
  endpoints: () => ({}),
});
