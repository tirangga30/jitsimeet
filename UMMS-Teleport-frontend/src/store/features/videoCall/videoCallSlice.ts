import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface ChatMessage {
  sender: string;
  text: string;
  timestamp: number;
  eventType?: "image-uploaded";
  isOwn?: boolean;
}

export interface JitsiParticipant {
  id: string;
  name: string;
  hasAudio: boolean;
  hasVideo: boolean;
  participantType: "patient" | "provider" | "family";
}

interface VideoCallState {
  micOn: boolean;
  cameraOn: boolean;
  isScreenSharing: boolean;
  appId: string;
  channel: string;
  token: string;
  calling: boolean;
  participants: JitsiParticipant[];
  participantCount: number;
  chatMessages: ChatMessage[];
  meetingDuration: string;
}

const initialState: VideoCallState = {
  micOn: true,
  cameraOn: true,
  isScreenSharing: false,
  appId: "",
  channel: "",
  token: "",
  calling: false,
  participants: [],
  participantCount: 1,
  chatMessages: [],
  meetingDuration: "00:00:00",
};

export const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    handleMicOn: (state, action: PayloadAction<boolean>) => {
      state.micOn = action.payload;
    },
    handleCameraOn: (state, action: PayloadAction<boolean>) => {
      state.cameraOn = action.payload;
    },
    handleScreenSharing: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharing = action.payload;
    },
    handleJoinVideoCall: (
      state,
      action: PayloadAction<{
        appId: string;
        token: string;
        channel: string;
        calling: boolean;
      }>,
    ) => {
      state.appId = action.payload.appId;
      state.token = action.payload.token;
      state.channel = action.payload.channel;
      state.calling = action.payload.calling;
    },
    handleSetParticipants: (state, action: PayloadAction<JitsiParticipant[]>) => {
      state.participants = action.payload;
    },
    handleSetParticipantCount: (state, action: PayloadAction<number>) => {
      state.participantCount = action.payload;
    },
    handleAddChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    setMeetingDuration: (state, action: PayloadAction<string>) => {
      state.meetingDuration = action.payload;
    },
    resetState: (state) => {
      state.calling = false;
      state.cameraOn = true;
      state.micOn = true;
      state.isScreenSharing = false;
      state.participants = [];
      state.participantCount = 1;
      state.chatMessages = [];
      state.meetingDuration = "00:00:00";
    },
  },
});

export const videoCallActions = videoCallSlice.actions;

export const selectMicOn = (state: RootState) => state.videoCall.micOn;
export const selectCameraOn = (state: RootState) => state.videoCall.cameraOn;
export const selectIsScreenSharing = (state: RootState) => state.videoCall.isScreenSharing;
export const selectCalling = (state: RootState) => state.videoCall.calling;
export const selectJitsiParticipants = (state: RootState) => state.videoCall.participants;
export const selectParticipantCount = (state: RootState) =>
  state.videoCall.participantCount;
export const selectChatMessages = (state: RootState) => state.videoCall.chatMessages;
export const selectMeetingDuration = (state: RootState) => state.videoCall.meetingDuration;

export const videoCallReducer = videoCallSlice.reducer;
