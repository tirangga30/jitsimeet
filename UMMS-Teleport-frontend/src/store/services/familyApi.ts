import type { FamilyAndFriends } from "../../types/patients";
import { api } from "./api";

export const familyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFamilyFriends: builder.mutation<
      FamilyAndFriends,
      Omit<FamilyAndFriends, "id" | "invite" | "inviteId">
    >({
      query: (body) => ({
        url: "/family-friends",
        method: "POST",
        body,
      }),
    }),

    updateFamilyFriends: builder.mutation<
      FamilyAndFriends,
      {
        id: string;
        patientId: string;
        body: Partial<FamilyAndFriends>;
      }
    >({
      query: ({ id, body }) => ({
        url: `/family-friends/${id}`,
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
  useCreateFamilyFriendsMutation,
  useUpdateFamilyFriendsMutation,
  //   useDeleteProviderMutation,
} = familyApi;
