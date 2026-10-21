import { api } from "./api";

export type ActiveInvitation = {
  inviteBatchId: string;
  roomId: string;
  meetingUrl: string;
  status: "waiting" | "accepted" | "concluded" | "expired";
};

export const invitationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActiveInvitation: builder.query<ActiveInvitation, string>({
      query: (patientId) => ({
        url: "/invitations/active",
        params: { patientId },
      }),
      providesTags: ["Invitation"],
    }),
    createInvitation: builder.mutation<
      { success: boolean; inviteBatchId: string; roomId: string; meetingUrl: string; data?: unknown },
      Record<string, unknown>
    >({
      query: (body) => ({
        url: "/invitations/create",
        method: "POST",
        body,
      }),

      invalidatesTags: (_result, _error, arg) => [
        { type: "Patient", id: arg.patientId as string },
        "Invitation",
      ],
    }),

    concludeMeeting: builder.mutation<
      { success: boolean; message: string },
      { inviteBatchId: string }
    >({
      query: (body) => ({
        url: "/invitations/conclude",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Patient", "Invitation"],
    }),

    leaveMeeting: builder.mutation<
      { success: boolean; message: string },
      { inviteId: string }
    >({
      query: (body) => ({
        url: "/invitations/leave",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Patient"],
    }),
  }),
});

export const {
  useGetActiveInvitationQuery,
  useCreateInvitationMutation,
  useConcludeMeetingMutation,
  useLeaveMeetingMutation,
} = invitationApi;
