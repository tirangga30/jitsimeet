interface RemoteVideoState {
  videoTrack?: {
    videoType?: string;
    getVideoType?: () => string;
  } | null;
  hasVideo?: boolean;
}

export const hasVisibleRemoteVideo = (user: RemoteVideoState) => {
  const isScreenShare =
    user.videoTrack?.videoType === "desktop" ||
    user.videoTrack?.getVideoType?.() === "desktop";

  return Boolean(user.videoTrack) && (Boolean(user.hasVideo) || isScreenShare);
};
