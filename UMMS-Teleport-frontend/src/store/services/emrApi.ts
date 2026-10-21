import type { EmrImagesResponse, UploadEmrInput } from "../../types/emr";
import { api } from "./api";

export const emrApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmrImages: builder.query<EmrImagesResponse, string>({
      query: (patientId) => `/emr/images?patientId=${patientId}`,
      providesTags: (_result, _error, patientId) => [
        { type: "Emr", id: patientId },
      ],
    }),
    uploadEmrImage: builder.mutation<unknown, UploadEmrInput>({
      query: (body) => ({
        url: "/emr/upload-image",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Emr", id: arg.patientDbId },
      ],
    }),
  }),
});

export const { useGetEmrImagesQuery, useUploadEmrImageMutation } = emrApi;
