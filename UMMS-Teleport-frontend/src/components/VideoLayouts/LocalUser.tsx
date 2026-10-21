/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";

interface LocalUserProps {
  style?: React.CSSProperties;
  videoTrack?: any;
  cameraOn?: boolean;
  isScreenSharing?: boolean;
  micOn?: boolean;
}

export const LocalUser = ({ style, videoTrack, cameraOn, isScreenSharing }: LocalUserProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showVideo = !!videoTrack && (cameraOn || isScreenSharing);

  useEffect(() => {
    const el = videoRef.current;
    if (el && showVideo) {
      videoTrack.attach(el);
    }
    return () => {
      if (videoTrack && el) {
        try {
          videoTrack.detach(el);
        } catch (e) {
          console.warn("Error detaching local video track:", e);
        }
      }
    };
  }, [videoTrack, showVideo]);

  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#ababab" }} />
      )}
    </div>
  );
};
