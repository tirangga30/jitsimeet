import type { ProviderAndStaff } from "../../types/patients";
import { api } from "./api";

export const providerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // createPatient: builder.mutation<Patient, Partial<Patient>>({
    //   query: (body) => ({
    //     url: "/patients",
    //     method: "POST",
    //     body,
    //   }),

    //   invalidatesTags: ["Patient"],
    // }),
    getProviders: builder.query<ProviderAndStaff[], void>({
      query: () => `/providers`,
    }),

    updateProvider: builder.mutation<
      ProviderAndStaff,
      {
        id: string;
        patientId: string;
        body: Partial<ProviderAndStaff>;
      }
    >({
      query: ({ id, body }) => ({
        url: `/providers/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Patient", id: arg.patientId },
      ],
    }),

    // deletePatient: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `/patients/${id}`,
    //     method: "DELETE",
    //   }),

    //   invalidatesTags: ["Patient"],
    // }),
  }),
});

export const {
  useGetProvidersQuery,
  useUpdateProviderMutation,
  //   useDeleteProviderMutation,
} = providerApi;
