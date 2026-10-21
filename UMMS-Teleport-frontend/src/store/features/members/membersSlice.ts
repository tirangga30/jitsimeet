import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { MembersType } from "../../../types/members";

interface MembersState {
  unInviteMembers: MembersType[];
  invitedMembers: MembersType[];
  callType: "provider" | "family";
  inviteBatchId?: string;
  roomId?: string;
  meetingUrl?: string;
  inviteStatus?: "waiting" | "accepted" | "expired";
}

const initialState: MembersState = {
  unInviteMembers: [],
  invitedMembers: [],
  callType: "family",
  inviteBatchId: "",
  roomId: "",
  meetingUrl: "",
  inviteStatus: "waiting",
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    handleInvitedMembers: (
      state,
      action: PayloadAction<{
        invitedMembers: MembersType[];
        unInvitedMembers: MembersType[];
      }>,
    ) => {
      state.invitedMembers = action.payload.invitedMembers;
      state.unInviteMembers = action.payload.unInvitedMembers;
    },
    setMeetingMeta: (
      state,
      action: PayloadAction<{
        inviteBatchId: string;
        roomId: string;
        meetingUrl: string;
        inviteStatus: "waiting" | "accepted" | "expired" | undefined;
      }>,
    ) => {
      state.inviteBatchId = action.payload.inviteBatchId;
      state.roomId = action.payload.roomId;
      state.meetingUrl = action.payload.meetingUrl;
      state.inviteStatus = action.payload.inviteStatus;
    },
    setCallType: (state, action: PayloadAction<"provider" | "family">) => {
      state.callType = action.payload;
    },
    resetState: (state) => {
      state.invitedMembers = [];
      state.inviteBatchId = "";
      state.roomId = "";
      state.meetingUrl = "";
      state.inviteStatus = "waiting";
    },
  },
});

export const membersActions = membersSlice.actions;

export const selectInvitedMembers = (state: RootState) =>
  state.members.invitedMembers;
export const selectUnInvitedMembers = (state: RootState) =>
  state.members.unInviteMembers;
export const selectCallType = (state: RootState) => state.members.callType;
export const selectInviteBatchId = (state: RootState) =>
  state.members.inviteBatchId;
export const selectMeetingUrl = (state: RootState) => state.members.meetingUrl;
export const selectInviteStatus = (state: RootState) =>
  state.members.inviteStatus;

export const membersReducer = membersSlice.reducer;
