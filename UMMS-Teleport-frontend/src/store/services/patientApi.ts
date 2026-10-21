import type { Patient } from "../../types/patients";
import { api } from "./api";

type UpdatePatientBody = Partial<Omit<Patient, "providers" | "families">> & {
  providerIds?: string[];
  familyIds?: string[];
};

export const patientApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<Patient[], void>({
      query: () => "/patient",

      providesTags: ["Patient"],
    }),

    getPatient: builder.query<Patient, string>({
      query: (id) => `/patients/${id}`,

      providesTags: (_result, _error, id) => [{ type: "Patient", id }],
    }),

    // createPatient: builder.mutation<Patient, Partial<Patient>>({
    //   query: (body) => ({
    //     url: "/patients",
    //     method: "POST",
    //     body,
    //   }),

    //   invalidatesTags: ["Patient"],
    // }),

    updatePatient: builder.mutation<
      Patient,
      {
        id: string;
        body: UpdatePatientBody;
      }
    >({
      query: ({ id, body }) => ({
        url: `/patients/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Patient", id: arg.id },
        "Patient",
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
  useGetPatientsQuery,
  useGetPatientQuery,
  //   useCreatePatientMutation,
  useUpdatePatientMutation,
  //   useDeletePatientMutation,
} = patientApi;
