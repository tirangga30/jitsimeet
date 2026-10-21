import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface GlobalState {
  layout: "grid" | "list";
  panel: "chat" | "participants" | "more" | "none";
  showUploadModel: boolean;
  showPardonInterruptionModal: boolean;
  isEndCall: boolean;
  showAudioVideoModal: boolean;
}

const initialState: GlobalState = {
  layout: "grid",
  panel: "none",
  showUploadModel: false,
  showPardonInterruptionModal: false,
  isEndCall: false,
  showAudioVideoModal: false,
};

export const globalSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    handleVideolayout: (state, action: PayloadAction<"grid" | "list">) => {
      state.layout = action.payload;
    },
    handleShowPanel: (
      state,
      action: PayloadAction<"chat" | "participants" | "more" | "none">,
    ) => {
      state.panel = action.payload;
    },
    handleShowUploadModel: (state, action: PayloadAction<boolean>) => {
      state.showUploadModel = action.payload;
    },
    handleShowPardonInterruptionModal: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.showPardonInterruptionModal = action.payload;
    },
    handleResetState: (state) => {
      state.layout = "grid";
      state.panel = "none";
      state.isEndCall = false;
    },
    handleEndCall: (state, action: PayloadAction<boolean>) => {
      state.isEndCall = action.payload;
    },
    handleShowAudioVideoModal: (state, action: PayloadAction<boolean>) => {
      state.showAudioVideoModal = action.payload;
    },
  },
});

export const globalActions = globalSlice.actions;

export const selectLayout = (state: RootState) => state.global.layout;
export const selectpanel = (state: RootState) => state.global.panel;
export const selectShowUploadModel = (state: RootState) =>
  state.global.showUploadModel;
export const selectShowPardonInterruptionModal = (state: RootState) =>
  state.global.showPardonInterruptionModal;
export const SelectIsEndCall = (state: RootState) => state.global.isEndCall;
export const selectShowAudioVideoModal = (state: RootState) => state.global.showAudioVideoModal;

export const globalReducer = globalSlice.reducer;
