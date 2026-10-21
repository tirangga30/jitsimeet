/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef } from "react";
import { hasVisibleRemoteVideo } from "./remoteVideo";

interface RemoteUserProps {
  user: {
    uid: string | number;
    videoTrack?: any;
    audioTrack?: any;
    hasVideo?: boolean;
    hasAudio?: boolean;
  };
  style?: React.CSSProperties;
}

export const RemoteUser = ({ user, style }: RemoteUserProps) => {
  const lastVideoElRef = useRef<HTMLVideoElement | null>(null);
  const lastAudioElRef = useRef<HTMLAudioElement | null>(null);
  const showVideo = hasVisibleRemoteVideo(user);

  const videoRefCallback = useCallback(
    (videoEl: HTMLVideoElement | null) => {
      // 1. Detach old element if present
      if (lastVideoElRef.current && user.videoTrack) {
        try {
          user.videoTrack.detach(lastVideoElRef.current);
        } catch (e) {
          console.warn("Error detaching remote video track:", e);
        }
      }
      // 2. Attach new element if present
      if (videoEl && user.videoTrack && showVideo) {
        try {
          user.videoTrack.attach(videoEl);
          // Track replacement (camera -> desktop) is treated as new playback
          // by mobile browsers. Muted video plus an explicit play call allows
          // the shared content to start without another user gesture.
          videoEl.muted = true;
          void videoEl.play().catch((e) => {
            console.warn("Error starting remote video playback:", e);
          });
        } catch (e) {
          console.warn("Error attaching remote video track:", e);
        }
      }
      lastVideoElRef.current = videoEl;
    },
    [user.videoTrack, showVideo],
  );

  const audioRefCallback = useCallback(
    (audioEl: HTMLAudioElement | null) => {
      // 1. Detach old element if present
      if (lastAudioElRef.current && user.audioTrack) {
        try {
          user.audioTrack.detach(lastAudioElRef.current);
        } catch (e) {
          console.warn("Error detaching remote audio track:", e);
        }
      }
      // 2. Attach new element if present
      if (audioEl && user.audioTrack && user.hasAudio) {
        try {
          user.audioTrack.attach(audioEl);
        } catch (e) {
          console.warn("Error attaching remote audio track:", e);
        }
      }
      lastAudioElRef.current = audioEl;
    },
    [user.audioTrack, user.hasAudio]
  );

  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {user.videoTrack ? (
        <video
          ref={videoRefCallback}
          data-participant-uid={String(user.uid)}
          autoPlay
          playsInline
          muted
          disableRemotePlayback
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            display: showVideo ? "block" : "none",
            pointerEvents: "none",
          }}
        />
      ) : null}
      {!showVideo ? (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#ababab" }} />
      ) : null}
      {user.audioTrack && (
        <audio ref={audioRefCallback} autoPlay style={{ display: "none" }} />
      )}
    </div>
  );
};
