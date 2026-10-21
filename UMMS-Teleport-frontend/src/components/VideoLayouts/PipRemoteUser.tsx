/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, forwardRef } from "react";
import { hasVisibleRemoteVideo } from "./remoteVideo";

interface PipRemoteUserProps {
  user: {
    uid: string | number;
    videoTrack?: any;
    audioTrack?: any;
    hasVideo?: boolean;
    hasAudio?: boolean;
  };
  style?: React.CSSProperties;
}

export const PipRemoteUser = forwardRef<HTMLVideoElement, PipRemoteUserProps>(
  ({ user, style }, forwardedRef) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const showVideo = hasVisibleRemoteVideo(user);

    // Merge internal ref with any forwarded ref from the parent
    const setVideoRef = (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLVideoElement | null>
        ).current = el;
      }
    };

    useEffect(() => {
      const el = videoRef.current;
      if (!el || !user.videoTrack || !showVideo) {
        if (el) el.srcObject = null;
        return;
      }

      const track = user.videoTrack;

      const attach = (stream: MediaStream) => {
        if (typeof track.attach === "function") {
          try {
            track.attach(el);
          } catch {
            // ignore
          }
        } else {
          el.srcObject = stream;
        }
        el.muted = true;
        el.play().catch((e) =>
          console.warn("[PipRemoteUser] play() failed:", e),
        );
      };

      try {
        if (typeof track.getOriginalStream === "function") {
          const s: MediaStream = track.getOriginalStream();
          if (s && s.getTracks().length > 0) {
            attach(s);
            return;
          }
        }

        if (track.stream?.getTracks().length > 0) {
          attach(track.stream);
          return;
        }

        const rawTrack: MediaStreamTrack | null =
          typeof track.getTrack === "function"
            ? track.getTrack()
            : (track.track ?? null);
        if (rawTrack && rawTrack.readyState !== "ended") {
          attach(new MediaStream([rawTrack]));
          return;
        }
        console.error("[PipRemoteUser] No usable stream found");
      } catch (e) {
        console.error("[PipRemoteUser] Exception:", e);
      }
    }, [user.videoTrack, showVideo]);

    useEffect(() => {
      const el = audioRef.current;
      if (!el || !user.audioTrack || !user.hasAudio) {
        if (el) el.srcObject = null;
        return;
      }
      const track = user.audioTrack;
      try {
        const getStream = (): MediaStream | null => {
          if (typeof track.getOriginalStream === "function") {
            const s = track.getOriginalStream();
            if (s?.getTracks().length > 0) return s;
          }
          if (track.stream?.getTracks().length > 0) return track.stream;
          const raw =
            typeof track.getTrack === "function"
              ? track.getTrack()
              : (track.track ?? null);
          return raw ? new MediaStream([raw]) : null;
        };
        const s = getStream();
        if (s) {
          el.srcObject = s;
          el.play().catch(() => {});
        }
      } catch (e) {
        console.warn("[PipRemoteUser] Audio attach error:", e);
      }
    }, [user.audioTrack, user.hasAudio]);

    return (
      <div style={{ position: "absolute", inset: 0, ...style }}>
        <video
          ref={setVideoRef}
          data-participant-uid={String(user.uid)}
          autoPlay
          playsInline
          muted
          disableRemotePlayback
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          {...({ "x-webkit-airplay": "deny", "webkit-playsinline": "true" } as any)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: showVideo ? "block" : "none",
            pointerEvents: "none",
          }}
        />
        {!showVideo && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#1a1a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
            }}
          >
            Camera Off
          </div>
        )}
        {user.audioTrack && (
          <audio ref={audioRef} autoPlay style={{ display: "none" }} />
        )}
      </div>
    );
  },
);

PipRemoteUser.displayName = "PipRemoteUser";
