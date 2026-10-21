import { configureStore } from "@reduxjs/toolkit";
import { scanReducer } from "./features/scan/scanSlice";
import { membersReducer } from "./features/members/membersSlice";
import { globalReducer } from "./features/global/globalSlice";
import { videoCallReducer } from "./features/videoCall/videoCallSlice";
import { api } from "./services/api";

export const store = configureStore({
  reducer: {
    scan: scanReducer,
    members: membersReducer,
    global: globalReducer,
    videoCall: videoCallReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
