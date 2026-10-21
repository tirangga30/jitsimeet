import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:4000/api",

    prepareHeaders: (headers) => {
      return headers;
    },
  }),

  tagTypes: ["Patient", "ProviderAndStaff", "FamilyAndFriends", "Invitation", "Emr"],

  endpoints: () => ({}),
});
