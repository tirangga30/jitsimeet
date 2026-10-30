/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCalling,
  selectCameraOn,
  selectIsScreenSharing,
  selectMicOn,
  videoCallActions,
} from "../store/features/videoCall/videoCallSlice";
import { selectCallType } from "../store/features/members/membersSlice";
import {
  jitsiConferenceRef,
  localCameraTrackRef,
  screenShareActionRef,
  setLocalCameraTrackRef,
  setLocalMicrophoneTrackRef,
} from "../utils/jitsiApi";
import { errorMessage } from "../utils/toasters";

export interface JitsiTrack {
  isLocal: () => boolean;
  getType: () => "audio" | "video";
  getParticipantId: () => string;
  isMuted: () => boolean;
  mute: () => Promise<void>;
  unmute: () => Promise<void>;
  dispose: () => Promise<void>;
  getTrack: () => MediaStreamTrack;
  track?: MediaStreamTrack;
  stream?: MediaStream;
  getOriginalStream?: () => MediaStream;
  videoType?: string;
  getVideoType?: () => string;
  switchCamera?: () => Promise<void>;

  addEventListener: (
    _event: string,
    _callback: (..._args: any[]) => void,
  ) => void;
  stop?: () => void;
}

export interface JitsiParticipant {
  getId: () => string;
  getDisplayName: () => string;
  getTracks: () => JitsiTrack[];
  getProperty?: (_name: string) => string | undefined;
}

export interface JitsiConference {
  myUserId: () => string;
  getParticipants: () => JitsiParticipant[];
  getParticipantById: (_id: string) => JitsiParticipant | undefined;
  sendCommand: (_name: string, _values: { value: string }) => void;
  addCommandListener: (
    _name: string,
    _callback: (_values: { value: string }) => void,
  ) => void;
  removeTrack: (_track: JitsiTrack) => Promise<void>;
  addTrack: (_track: JitsiTrack) => Promise<void>;
  leave: () => Promise<void>;

  on: (_event: string, _callback: (..._args: any[]) => void) => void;
  setDisplayName: (_name: string) => void;
  setLocalParticipantProperty?: (_name: string, _value: string) => void;
  sendMessage: (_text: string) => void;
  getLocalVideoTracks?: () => JitsiTrack[];
  getLocalTracks?: () => JitsiTrack[];
  join: () => void;
}

export interface JitsiConnection {
  initJitsiConference: (
    _room: string,
    _options: { openBridgeChannel: boolean },
  ) => JitsiConference;
  connect: () => void;
  disconnect: () => Promise<void>;

  addEventListener: (
    _event: string,
    _callback: (..._args: any[]) => void,
  ) => void;

  removeEventListener: (
    _event: string,
    _callback: (..._args: any[]) => void,
  ) => void;
}

declare global {
  interface Window {
    JitsiMeetJS?: {
      init: (_options: { disableAudioLevels: boolean }) => void;
      setLogLevel: (_level: string) => void;
      logLevels: {
        TRACE: string;
        DEBUG: string;
        INFO: string;
        LOG: string;
        WARN: string;
        ERROR: string;
      };
      events: {
        connection: {
          CONNECTION_ESTABLISHED: string;
          CONNECTION_FAILED: string;
          CONNECTION_TEMPORARILY_FAILED: string;
          DISCONNECTED: string;
        };
        conference: {
          TRACK_ADDED: string;
          TRACK_REMOVED: string;
          TRACK_MUTE_CHANGED: string;
          DISPLAY_NAME_CHANGED: string;
          MESSAGE_RECEIVED: string;
          USER_JOINED: string;
          USER_LEFT: string;
          CONFERENCE_JOINED: string;
          PARTICIPANT_PROPERTY_CHANGED?: string;
        };
        track: {
          LOCAL_TRACK_STOPPED: string;
        };
      };
      createLocalTracks: (_options: {
        devices: string[];
        cameraDeviceId?: string;
        micDeviceId?: string;
        constraints?: {
          video?: {
            height?: { ideal?: number };
            deviceId?: { exact?: string } | string;
          };
          audio?: {
            deviceId?: { exact?: string } | string;
          };
        };
      }) => Promise<JitsiTrack[]>;
      createLocalTracksFromMediaStreams: (_tracks: Array<{
        stream: MediaStream;
        mediaType: "video";
        videoType: "desktop";
      }>) => JitsiTrack[];
      JitsiConnection: new (
        _token: null,
        _jwt: string | undefined,
        _options: {
          hosts: {
            domain: string;
            anonymousdomain: string;
            muc: string;
            focus: string;
          };
          serviceUrl: string;
        },
      ) => JitsiConnection;
    };
    documentPictureInPicture?: {
      requestWindow: (_options: {
        width: number;
        height: number;
      }) => Promise<Window>;
    };
    _activeMediaTracks?: MediaStreamTrack[];
  }
}

const isDesktopTrack = (track: JitsiTrack | null | undefined) =>
  track?.videoType === "desktop" || track?.getVideoType?.() === "desktop";

/** Prefer desktop over camera when both tracks exist during screen-share transitions */
const pickVideoTrack = (
  current: JitsiTrack | null,
  incoming: JitsiTrack | null,
): JitsiTrack | null => {
  if (!incoming) return current ?? null;
  if (!current) return incoming;
  if (isDesktopTrack(incoming)) return incoming;
  if (isDesktopTrack(current)) return current;
  return incoming;
};

/** True when a mute/removal event belongs to the track currently shown in the UI */
const isActiveVideoTrack = (
  displayed: JitsiTrack | null,
  eventTrack: JitsiTrack,
) => {
  if (!displayed || !eventTrack) return false;
  if (displayed === eventTrack) return true;
  return isDesktopTrack(displayed) === isDesktopTrack(eventTrack);
};

const resolveVideoTrackAfterRemoval = (
  displayed: JitsiTrack | null,
  removed: JitsiTrack,
): JitsiTrack | null => {
  if (!displayed) return null;
  if (displayed === removed) return null;
  // Camera removed while screen share is active — keep desktop
  if (isDesktopTrack(displayed) && !isDesktopTrack(removed)) return displayed;
  // Desktop removed while camera is active — keep camera
  if (!isDesktopTrack(displayed) && isDesktopTrack(removed)) return displayed;
  return null;
};

const mergeRemoteTrack = (
  prev: RemoteUserItem[],
  track: JitsiTrack,
  conf: JitsiConference,
  localParticipantIdentity: string,
  participantIdentityById: Map<string, string>,
): RemoteUserItem[] => {
  if (track.isLocal()) return prev;

  const participantId = track.getParticipantId();
  const type = track.getType();
  const participant = conf.getParticipantById(participantId);
  const name = participant?.getDisplayName() || "Remote User";
  const participantIdentity =
    participant?.getProperty?.("teleportParticipantIdentity") ||
    participantIdentityById.get(participantId) ||
    "";
  if (
    participantIdentity &&
    participantIdentity === localParticipantIdentity
  ) {
    return prev;
  }
  const participantType = normalizeParticipantType(
    participant?.getProperty?.("participantType"),
  );
  const exists = prev.find((u) => u.uid === participantId);

  if (exists) {
    return prev.map((u) => {
      if (u.uid !== participantId) return u;

      const videoTrack =
        type === "video" ? pickVideoTrack(u.videoTrack, track) : u.videoTrack;

      return {
        ...u,
        videoTrack,
        audioTrack: type === "audio" ? track : u.audioTrack,
        hasVideo:
          type === "video"
            ? !!videoTrack &&
              (isDesktopTrack(videoTrack) ? true : !track.isMuted())
            : u.hasVideo,
        hasAudio: type === "audio" ? !track.isMuted() : u.hasAudio,
        name,
        participantType,
        participantIdentity,
      };
    });
  }

  // Deduplicate: If a remote user with the exact same display name already exists, replace or ignore duplicate ghost user
  const duplicateIndex = prev.findIndex(
    (user) =>
      (participantIdentity &&
        user.participantIdentity === participantIdentity) ||
      (!participantIdentity && user.name === name),
  );
  if (duplicateIndex !== -1) {
    const updated = [...prev];
    const oldUser = updated[duplicateIndex];
    updated[duplicateIndex] = {
      ...oldUser,
      uid: participantId, // Bind to the active new track participant ID
      participantType,
      participantIdentity,
      videoTrack: type === "video" ? track : oldUser.videoTrack,
      audioTrack: type === "audio" ? track : oldUser.audioTrack,
      hasVideo:
        type === "video"
          ? isDesktopTrack(track) || !track.isMuted()
          : oldUser.hasVideo,
      hasAudio: type === "audio" ? !track.isMuted() : oldUser.hasAudio,
    };
    return updated;
  }

  return [
    ...prev,
    {
      uid: participantId,
      videoTrack: type === "video" ? track : null,
      audioTrack: type === "audio" ? track : null,
      hasVideo:
        type === "video" && (isDesktopTrack(track) || !track.isMuted()),
      hasAudio: type === "audio" && !track.isMuted(),
      name,
      participantType,
      participantIdentity,
    },
  ];
};

const syncParticipantTracks = (
  _conf: JitsiConference,
  participant: JitsiParticipant,
  onTrack: (_track: JitsiTrack) => void,
) => {
  participant.getTracks().forEach((track: JitsiTrack) => {
    if (!track.isLocal()) onTrack(track);
  });
};

export interface RemoteUserItem {
  uid: string;
  videoTrack: JitsiTrack | null;
  audioTrack: JitsiTrack | null;
  hasVideo: boolean;
  hasAudio: boolean;
  name: string;
  participantType: ParticipantType;
  participantIdentity: string;
}

export type ParticipantType = "patient" | "provider" | "family";

const normalizeParticipantType = (
  value: string | null | undefined,
): ParticipantType =>
  value === "patient" || value === "provider" || value === "family"
    ? value
    : "family";

export interface VideoCallState {
  isConnected: boolean;
  remoteUsers: RemoteUserItem[];
  localCameraTrack: JitsiTrack | null;
  localMicrophoneTrack: JitsiTrack | null;
  micOn: boolean;
  cameraOn: boolean;
  isScreenSharing: boolean;
  totalUserJoinedCount: number;
  handleRetry: () => void;
  remoteMicStatus: Record<string, boolean>;
  toggleScreenShare: () => Promise<void>;
  endMeetingForAll: () => void;
  pipWindow: Window | null;
  togglePip: () => void;
  closePip: () => void;
  isNativePipActive: boolean;
  isPipSupported: boolean;
  isTabDuplicate?: boolean;
  registerMainRemoteVideo: (_el: HTMLVideoElement | null) => void;
}

export const useJitsiCall = (
  roomName: string,
  jwtToken?: string | null,
  onMeetingEnded?: () => void,
): VideoCallState => {
  const dispatch = useAppDispatch();
  const calling = useAppSelector(selectCalling);
  const micOn = useAppSelector(selectMicOn);
  const cameraOn = useAppSelector(selectCameraOn);
  const isScreenSharing = useAppSelector(selectIsScreenSharing);
  const callType = useAppSelector(selectCallType);
  const urlParamsForIdentity = new URLSearchParams(window.location.search);
  const participantTypeForIdentity =
    urlParamsForIdentity.get("participantType") ||
    (urlParamsForIdentity.get("moderator") === "true" ? "provider" : callType);
  const localParticipantIdentity =
    urlParamsForIdentity.get("inviteId") ||
    (participantTypeForIdentity === "provider"
      ? `provider:${roomName.toLowerCase()}`
      : `${participantTypeForIdentity || "family"}:${urlParamsForIdentity.get("name") || roomName}`);
  // Standard native <video> PiP detection for all browsers (Chrome, Safari, iPad, Firefox)
  const isPipSupported =
    typeof HTMLVideoElement !== "undefined" &&
    ("requestPictureInPicture" in HTMLVideoElement.prototype ||
      "webkitSupportsPresentationMode" in HTMLVideoElement.prototype ||
      "webkitSetPresentationMode" in HTMLVideoElement.prototype);

  const [isConnected, setIsConnected] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUserItem[]>([]);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [localCameraTrack, setLocalCameraTrack] = useState<JitsiTrack | null>(
    null,
  );
  const [localMicrophoneTrack, setLocalMicrophoneTrack] =
    useState<JitsiTrack | null>(null);
  const [remoteMicStatus, setRemoteMicStatus] = useState<
    Record<string, boolean>
  >({});
  const [isNativePipActive, setIsNativePipActive] = useState(false);

  const connectionRef = useRef<JitsiConnection | null>(null);
  const conferenceRef = useRef<JitsiConference | null>(null);
  const localTracksRef = useRef<JitsiTrack[]>([]);
  const meetingStartTimeRef = useRef<number | null>(null);
  const cleanupInFlightRef = useRef<Promise<void> | null>(null);
  const fallbackRestartInFlightRef = useRef<Promise<void> | null>(null);
  const participantLeaveTimersRef = useRef(
    new Map<string, ReturnType<typeof setTimeout>>(),
  );
  const participantIdentityByIdRef = useRef(new Map<string, string>());
  const participantNameByIdRef = useRef(new Map<string, string>());
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTogglingScreenShareRef = useRef(false);
  const isCleanedUpRef = useRef(false);
  const mainRemoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const registerMainRemoteVideo = (el: HTMLVideoElement | null) => {
    mainRemoteVideoRef.current = el;
  };

  const [isTabDuplicate, setIsTabDuplicate] = useState(false);
  const tabInstanceIdRef = useRef<string | null>(null);
  if (tabInstanceIdRef.current === null) {
    tabInstanceIdRef.current =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  // BroadcastChannel to prevent duplicate active tabs for the SAME user/role in the same call
  useEffect(() => {
    if (!roomName || typeof BroadcastChannel === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get("inviteId");
    const participantId = params.get("participantId");
    const participantName = params.get("name");

    let jwtIdentity = "";
    if (jwtToken) {
      try {
        const encodedPayload = jwtToken.split(".")[1];
        if (encodedPayload) {
          const normalizedPayload = encodedPayload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
          const payload = JSON.parse(atob(normalizedPayload)) as {
            sub?: string;
            context?: { user?: { id?: string; email?: string; name?: string } };
          };
          jwtIdentity =
            payload.context?.user?.id ||
            payload.sub ||
            payload.context?.user?.email ||
            payload.context?.user?.name ||
            "";
        }
      } catch {
        // A malformed/shared JWT should not break the call; URL identity is preferred.
      }
    }

    // Providers share one role identity. Guests are scoped by their invitation
    // or user identity so different invitees in the same room never collide.
    const roleKey = callType === "provider" ? "provider" : "guest";
    const participantIdentity =
      roleKey === "provider"
        ? "provider"
        : inviteId || participantId || participantName || jwtIdentity || "guest";
    const identityHash = Array.from(participantIdentity).reduce(
      (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
      0,
    );
    const channelName = `teleport_call_${roomName.toLowerCase()}_${roleKey}_${identityHash}`;
    const channel = new BroadcastChannel(channelName);
    const tabId = tabInstanceIdRef.current;

    setIsTabDuplicate(false);

    // Announce to existing tabs that a new duplicate tab opened
    channel.postMessage({
      type: "NEW_TAB_OPENED",
      tabId,
      timestamp: Date.now(),
    });

    channel.onmessage = (event) => {
      if (
        event.data?.type === "NEW_TAB_OPENED" &&
        event.data?.tabId !== tabId
      ) {
        // Target only the newly opened tab. A plain broadcast reply would also
        // mark every existing valid tab as a duplicate.
        channel.postMessage({
          type: "ALREADY_ACTIVE",
          targetTabId: event.data.tabId,
        });
      } else if (
        event.data?.type === "ALREADY_ACTIVE" &&
        event.data?.targetTabId === tabId
      ) {
        setIsTabDuplicate(true);
      }
    };

    return () => {
      channel.close();
    };
  }, [roomName, callType, jwtToken]);

  const onMeetingEndedRef = useRef(onMeetingEnded);
  useEffect(() => {
    onMeetingEndedRef.current = onMeetingEnded;
  }, [onMeetingEnded]);

  // Start video call logic on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cameraOnParam = urlParams.get("cameraOn");
    const micOnParam = urlParams.get("micOn");
    if (cameraOnParam !== null) {
      dispatch(videoCallActions.handleCameraOn(cameraOnParam === "true"));
    }
    if (micOnParam !== null) {
      dispatch(videoCallActions.handleMicOn(micOnParam === "true"));
    }

    dispatch(
      videoCallActions.handleJoinVideoCall({
        appId: "",
        calling: true,
        channel: roomName,
        token: jwtToken || "",
      }),
    );
  }, [dispatch, roomName, jwtToken]);

  // Clean up Jitsi on unmount or calling === false
  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const performCleanup = async () => {
    // Mark as cleaned up so any in-flight createLocalTracks calls will dispose their tracks
    isCleanedUpRef.current = true;

    // Close picture-in-picture window if it is open
    if (pipWindow) {
      try {
        pipWindow.close();
      } catch (e) {
        console.warn("Error closing PiP window during cleanup:", e);
      }
      setPipWindow(null);
    }

    if (document.pictureInPictureElement) {
      try {
        document.exitPictureInPicture();
      } catch (e) {
        console.warn("Error exiting native PiP during cleanup:", e);
      }
      setIsNativePipActive(false);
    }
    // Stop all globally tracked media tracks to guarantee camera/mic release
    if (window._activeMediaTracks) {
      const tracksToStop = [...(window._activeMediaTracks || [])];
      window._activeMediaTracks = [];
      tracksToStop.forEach((track: MediaStreamTrack) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Global track stop error in cleanup", e);
        }
      });
    }

    // Capture and clear shared refs synchronously. A later connection can then
    // safely assign new refs without this cleanup disconnecting the new call.
    const confInstance = conferenceRef.current;
    const connectionInstance = connectionRef.current;
    conferenceRef.current = null;
    connectionRef.current = null;
    if (jitsiConferenceRef.current === confInstance) {
      jitsiConferenceRef.current = null;
    }

    // Stop meeting timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    meetingStartTimeRef.current = null;
    dispatch(videoCallActions.setMeetingDuration("00:00:00"));

    // Remove tracks from conference first
    if (confInstance) {
      localTracksRef.current.forEach((track) => {
        try {
          confInstance.removeTrack(track);
        } catch (e) {
          console.warn("Error removing track from conference:", e);
        }
      });
    }

    // Mute and stop local tracks
    localTracksRef.current.forEach((track) => {
      try {
        track.mute();

        // 0. Try to call Jitsi's stop method directly if it exists
        if (typeof track.stop === "function") {
          try {
            track.stop();
          } catch (e) {
            console.warn(e);
          }
        }

        // 1. Try to stop using Jitsi getTrack()
        const rawTrack =
          typeof track.getTrack === "function" ? track.getTrack() : track.track;
        if (rawTrack && typeof rawTrack.stop === "function") {
          rawTrack.stop();
        }

        // 2. Try to stop stream tracks if track has stream or getOriginalStream
        const originalStream =
          typeof track.getOriginalStream === "function"
            ? track.getOriginalStream()
            : track.stream;
        if (originalStream && typeof originalStream.getTracks === "function") {
          originalStream.getTracks().forEach((t: MediaStreamTrack) => {
            try {
              t.stop();
            } catch (e) {
              console.warn("t.stop error", e);
            }
          });
        }

        // 3. Fallback stop on track.track if it exists
        if (track.track && typeof track.track.stop === "function") {
          track.track.stop();
        }

        track.dispose();
      } catch (e) {
        console.warn("Error disposing track:", e);
      }
    });
    localTracksRef.current = [];
    dispatch(videoCallActions.handleScreenSharing(false));
    setLocalCameraTrack(null);
    localCameraTrackRef.current = null;
    setLocalMicrophoneTrack(null);

    if (confInstance) {
      try {
        await confInstance.leave();
      } catch (e) {
        console.warn("Error leaving room:", e);
      }
    }

    if (connectionInstance) {
      try {
        const connection = connectionInstance;
        const JitsiMeetJS = window.JitsiMeetJS;
        if (JitsiMeetJS) {
          connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            onConnEstablished,
          );
          connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            onConnFailed,
          );
          connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_TEMPORARILY_FAILED,
            onConnFailed,
          );
          connection.removeEventListener(
            JitsiMeetJS.events.connection.DISCONNECTED,
            onConnDisconnected,
          );
        }
        await connection.disconnect();
      } catch (e) {
        console.warn("Error disconnecting Jitsi connection:", e);
      }
    }

    setIsConnected(false);
    setRemoteUsers([]);
    participantLeaveTimersRef.current.forEach((timer) => clearTimeout(timer));
    participantLeaveTimersRef.current.clear();
    participantIdentityByIdRef.current.clear();
    participantNameByIdRef.current.clear();
    setRemoteMicStatus({});
    dispatch(videoCallActions.handleSetParticipants([]));
  };

  const cleanup = (): Promise<void> => {
    if (cleanupInFlightRef.current) return cleanupInFlightRef.current;

    const cleanupPromise = performCleanup().finally(() => {
      if (cleanupInFlightRef.current === cleanupPromise) {
        cleanupInFlightRef.current = null;
      }
    });
    cleanupInFlightRef.current = cleanupPromise;
    return cleanupPromise;
  };

  const updateParticipantsInRedux = (confObj: JitsiConference | null) => {
    if (!confObj) return;
    const remoteParticipants = new Map<string, JitsiParticipant>();
    confObj.getParticipants().forEach((participant) => {
      const identity =
        participant.getProperty?.("teleportParticipantIdentity") ||
        participantIdentityByIdRef.current.get(participant.getId()) ||
        "";
      if (identity && identity === localParticipantIdentity) return;
      const key = identity || `name:${participant.getDisplayName()}`;
      remoteParticipants.set(key, participant);
    });
    const remoteList = Array.from(remoteParticipants.values()).map((p) => {
      const id = p.getId();
      const name = p.getDisplayName() || "Remote User";
      const tracks = p.getTracks() || [];
      const audioTrack = tracks.find(
        (t: JitsiTrack) => t.getType() === "audio",
      );
      const videoTrack = tracks.find(
        (t: JitsiTrack) => t.getType() === "video",
      );
      const hasAudio = audioTrack ? !audioTrack.isMuted() : false;
      const hasVideo = videoTrack ? !videoTrack.isMuted() : false;
      return {
        id,
        name,
        hasAudio,
        hasVideo,
        participantType: normalizeParticipantType(
          p.getProperty?.("participantType"),
        ),
      };
    });

    const localId = confObj.myUserId();
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("name");
    const localParticipantType = normalizeParticipantType(
      urlParams.get("participantType") ||
        (callType === "provider" ? "provider" : "family"),
    );
    const localName =
      guestName || (callType === "provider" ? "Provider" : "Patient/Family");
    const list = [
      {
        id: localId || "local",
        name: localName + " (You)",
        hasAudio: micOn,
        hasVideo: cameraOn,
        participantType: localParticipantType,
      },
      ...remoteList,
    ];

    dispatch(videoCallActions.handleSetParticipants(list));
  };

  // Define connection callbacks outside useEffect so they can be unbound safely
  const isBoshFallbackRef = useRef(false);

  const onConnEstablished = () => {
    const JitsiMeetJS = window.JitsiMeetJS;
    if (!JitsiMeetJS || !connectionRef.current) return;
    if (conferenceRef.current) {
      console.warn(
        "Ignoring duplicate Jitsi CONNECTION_ESTABLISHED event for the active conference.",
      );
      return;
    }
    const conf = connectionRef.current.initJitsiConference(
      roomName.toLowerCase(),
      {
        openBridgeChannel: true,
      },
    );
    conferenceRef.current = conf;
    jitsiConferenceRef.current = conf;

    conf.addCommandListener("end_meeting_for_all", () => {
      if (onMeetingEndedRef.current) {
        onMeetingEndedRef.current();
      }
    });

    // Set local display name
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get("name");
    const localParticipantType = normalizeParticipantType(
      urlParams.get("participantType") ||
        (callType === "provider" ? "provider" : "family"),
    );
    const localDisplayName =
      guestName || (callType === "provider" ? "Provider" : "Patient/Family");
    conf.setDisplayName(localDisplayName);
    conf.setLocalParticipantProperty?.(
      "participantType",
      localParticipantType,
    );
    conf.setLocalParticipantProperty?.(
      "teleportParticipantIdentity",
      localParticipantIdentity,
    );

    // Handle track addition/removal from remote participants
    conf.on(JitsiMeetJS.events.conference.TRACK_ADDED, (track: JitsiTrack) => {
      if (track.isLocal()) return;

      const type = track.getType();
      const participantId = track.getParticipantId();
      const trackParticipant = conf.getParticipantById(participantId);
      const trackIdentity =
        trackParticipant?.getProperty?.("teleportParticipantIdentity") || "";
      if (trackIdentity) {
        participantIdentityByIdRef.current.set(participantId, trackIdentity);
      }
      const trackName = trackParticipant?.getDisplayName();
      if (trackName) participantNameByIdRef.current.set(participantId, trackName);

      setRemoteUsers((prev) =>
        mergeRemoteTrack(
          prev,
          track,
          conf,
          localParticipantIdentity,
          participantIdentityByIdRef.current,
        ),
      );

      if (type === "audio") {
        setRemoteMicStatus((prev) => ({
          ...prev,
          [participantId]: !track.isMuted(),
        }));
      }

      updateParticipantsInRedux(conf);
    });

    conf.on(
      JitsiMeetJS.events.conference.TRACK_REMOVED,
      (track: JitsiTrack) => {
        if (track.isLocal()) return;

        const participantId = track.getParticipantId();
        const type = track.getType();

        setRemoteUsers((prev) =>
          prev.map((u) => {
            if (u.uid === participantId) {
              const videoTrack =
                type === "video"
                  ? resolveVideoTrackAfterRemoval(u.videoTrack, track)
                  : u.videoTrack;
              return {
                ...u,
                videoTrack,
                audioTrack: type === "audio" ? null : u.audioTrack,
                hasVideo: type === "video" ? !!videoTrack : u.hasVideo,
                hasAudio: type === "audio" ? false : u.hasAudio,
              };
            }
            return u;
          }),
        );

        if (type === "audio") {
          setRemoteMicStatus((prev) => {
            const next = { ...prev };
            delete next[participantId];
            return next;
          });
        }

        updateParticipantsInRedux(conf);
      },
    );

    conf.on(
      JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED,
      (track: JitsiTrack) => {
        const participantId = track.getParticipantId();
        if (!participantId) return;

        const type = track.getType();
        if (type === "audio") {
          setRemoteMicStatus((prev) => ({
            ...prev,
            [participantId]: !track.isMuted(),
          }));
        }

        setRemoteUsers((prev) =>
          prev.map((u) => {
            if (u.uid !== participantId) return u;

            if (type === "video") {
              // Ignore camera mute events while the desktop/screen track is displayed
              if (!isActiveVideoTrack(u.videoTrack, track)) return u;
              return { ...u, hasVideo: !track.isMuted() };
            }

            return { ...u, hasAudio: !track.isMuted() };
          }),
        );

        updateParticipantsInRedux(conf);
      },
    );

    conf.on(
      JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
      (id: string, name: string) => {
        participantNameByIdRef.current.set(id, name);
        setRemoteUsers((prev) =>
          prev.map((u) => (u.uid === id ? { ...u, name } : u)),
        );
        updateParticipantsInRedux(conf);
      },
    );

    conf.on(
      JitsiMeetJS.events.conference.MESSAGE_RECEIVED,
      (id: string, text: string, ts: number) => {
        if (id === conf.myUserId()) return;

        const senderName =
          conf.getParticipantById(id)?.getDisplayName() || "Remote User";
        let eventType: "image-uploaded" | undefined;
        let eventTimestamp = ts || Date.now();
        try {
          const event = JSON.parse(text) as {
            teleportEvent?: unknown;
            timestamp?: unknown;
          };
          if (event.teleportEvent === "image-uploaded") {
            eventType = "image-uploaded";
            if (typeof event.timestamp === "number") {
              eventTimestamp = event.timestamp;
            }
          }
        } catch {
          // Regular chat messages are plain text.
        }
        dispatch(
          videoCallActions.handleAddChatMessage({
            sender: senderName,
            text: eventType ? "" : text,
            timestamp: eventTimestamp,
            eventType,
          }),
        );
      },
    );

    conf.on(
      JitsiMeetJS.events.conference.USER_JOINED,
      (id: string, participant: JitsiParticipant) => {
        const pendingLeave = participantLeaveTimersRef.current.get(id);
        if (pendingLeave) {
          clearTimeout(pendingLeave);
          participantLeaveTimersRef.current.delete(id);
        }
        const joinedName = participant.getDisplayName() || "Remote User";
        const participantIdentity =
          participant.getProperty?.("teleportParticipantIdentity") || "";
        participantNameByIdRef.current.set(id, joinedName);
        if (participantIdentity) {
          participantIdentityByIdRef.current.set(id, participantIdentity);
        }
        if (
          participantIdentity &&
          participantIdentity === localParticipantIdentity
        ) {
          return;
        }
        const participantType = normalizeParticipantType(
          participant.getProperty?.("participantType"),
        );

        setRemoteUsers((prev) => {
          // Already tracked by uid
          if (prev.find((u) => u.uid === id)) return prev;

          // Same display name exists — this is a ghost/duplicate connection.
          // Replace the ghost's uid with the new one so we keep one tile.
          const ghostIdx = prev.findIndex(
            (user) =>
              (participantIdentity &&
                user.participantIdentity === participantIdentity) ||
              (!participantIdentity && user.name === joinedName),
          );
          if (ghostIdx !== -1) {
            const updated = [...prev];
            updated[ghostIdx] = {
              ...updated[ghostIdx],
              uid: id,
              participantType,
              participantIdentity,
            };
            return updated;
          }

          return [
            ...prev,
            {
              uid: id,
              videoTrack: null,
              audioTrack: null,
              hasVideo: false,
              hasAudio: false,
              name: joinedName,
              participantType,
              participantIdentity,
            },
          ];
        });

        syncParticipantTracks(conf, participant, (track) => {
          setRemoteUsers((prev) =>
            mergeRemoteTrack(
              prev,
              track,
              conf,
              localParticipantIdentity,
              participantIdentityByIdRef.current,
            ),
          );
          if (track.getType() === "audio") {
            setRemoteMicStatus((prev) => ({
              ...prev,
              [track.getParticipantId()]: !track.isMuted(),
            }));
          }
        });
        updateParticipantsInRedux(conf);
      },
    );

    const participantPropertyChangedEvent =
      JitsiMeetJS.events.conference.PARTICIPANT_PROPERTY_CHANGED;
    if (participantPropertyChangedEvent) {
      conf.on(
        participantPropertyChangedEvent,
        (
          participant: JitsiParticipant | string,
          propertyName: string,
          _oldValue: unknown,
          newValue: string | undefined,
        ) => {
          const participantId =
            typeof participant === "string"
              ? participant
              : participant.getId();

          if (propertyName === "teleportParticipantIdentity") {
            const identity =
              newValue ||
              conf
                .getParticipantById(participantId)
                ?.getProperty?.("teleportParticipantIdentity") ||
              "";
            if (!identity) return;
            participantIdentityByIdRef.current.set(participantId, identity);

            setRemoteUsers((prev) => {
              if (identity === localParticipantIdentity) {
                return prev.filter(
                  (user) =>
                    user.uid !== participantId &&
                    user.participantIdentity !== identity,
                );
              }

              const matching = prev.filter(
                (user) =>
                  user.uid === participantId ||
                  user.participantIdentity === identity,
              );
              if (matching.length === 0) return prev;

              const participantObject = conf.getParticipantById(participantId);
              const tracks = participantObject?.getTracks?.() || [];
              const current = matching.find((user) => user.uid === participantId);
              const fallback = matching.find((user) => user !== current);
              const videoTrack =
                current?.videoTrack ||
                tracks.find((track: JitsiTrack) => track.getType() === "video") ||
                fallback?.videoTrack ||
                null;
              const audioTrack =
                current?.audioTrack ||
                tracks.find((track: JitsiTrack) => track.getType() === "audio") ||
                fallback?.audioTrack ||
                null;
              const merged: RemoteUserItem = {
                ...(fallback || current!),
                ...(current || {}),
                uid: participantId,
                participantIdentity: identity,
                name:
                  participantObject?.getDisplayName() ||
                  current?.name ||
                  fallback?.name ||
                  "Remote User",
                videoTrack,
                audioTrack,
                hasVideo: videoTrack ? !videoTrack.isMuted() : false,
                hasAudio: audioTrack ? !audioTrack.isMuted() : false,
              };

              return [
                ...prev.filter(
                  (user) =>
                    user.uid !== participantId &&
                    user.participantIdentity !== identity,
                ),
                merged,
              ];
            });
            updateParticipantsInRedux(conf);
            return;
          }

          if (propertyName !== "participantType") return;

          const participantType = normalizeParticipantType(
            newValue ||
              conf
                .getParticipantById(participantId)
                ?.getProperty?.("participantType"),
          );

          setRemoteUsers((prev) =>
            prev.map((user) =>
              user.uid === participantId
                ? { ...user, participantType }
                : user,
            ),
          );
          updateParticipantsInRedux(conf);
        },
      );
    }

    conf.on(JitsiMeetJS.events.conference.USER_LEFT, (id: string) => {
      const existingTimer = participantLeaveTimersRef.current.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      const leavingIdentity = participantIdentityByIdRef.current.get(id) || "";
      const leavingName = participantNameByIdRef.current.get(id) || "";
      const survivor = conf.getParticipants().find((candidate) => {
        if (candidate.getId() === id) return false;
        const candidateIdentity =
          candidate.getProperty?.("teleportParticipantIdentity") ||
          participantIdentityByIdRef.current.get(candidate.getId()) ||
          "";
        if (leavingIdentity) return candidateIdentity === leavingIdentity;
        return (
          !!leavingName &&
          (candidate.getDisplayName() ||
            participantNameByIdRef.current.get(candidate.getId())) === leavingName
        );
      });

      if (survivor) {
        const survivorId = survivor.getId();
        const survivorIdentity =
          survivor.getProperty?.("teleportParticipantIdentity") ||
          leavingIdentity;
        if (survivorIdentity) {
          participantIdentityByIdRef.current.set(survivorId, survivorIdentity);
        }
        participantNameByIdRef.current.set(
          survivorId,
          survivor.getDisplayName() || leavingName,
        );
        setRemoteUsers((prev) =>
          prev
            .map((user) =>
              user.uid === id
                ? {
                    ...user,
                    uid: survivorId,
                    participantIdentity: survivorIdentity,
                    name: survivor.getDisplayName() || user.name,
                  }
                : user,
            )
            .filter(
              (user, index, users) =>
                users.findIndex((candidate) => candidate.uid === user.uid) === index,
            ),
        );
        syncParticipantTracks(conf, survivor, (track) => {
          setRemoteUsers((prev) =>
            mergeRemoteTrack(
              prev,
              track,
              conf,
              localParticipantIdentity,
              participantIdentityByIdRef.current,
            ),
          );
        });
        participantIdentityByIdRef.current.delete(id);
        participantNameByIdRef.current.delete(id);
        updateParticipantsInRedux(conf);
        return;
      }

      const leaveTimer = setTimeout(() => {
        participantLeaveTimersRef.current.delete(id);
        participantIdentityByIdRef.current.delete(id);
        participantNameByIdRef.current.delete(id);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== id));
        setRemoteMicStatus((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        updateParticipantsInRedux(conf);
      }, 3_000);
      participantLeaveTimersRef.current.set(id, leaveTimer);
    });

    conf.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
      updateParticipantsInRedux(conf);

      // Sync tracks for participants already in the room (e.g. screen share already active)
      // First pass: deduplicate participants by display name — keep only the last joined per name
      const participantsInRoom = conf.getParticipants();
      const seenParticipants = new Map<string, string>(); // identity/name -> uid
      participantsInRoom.forEach((p: JitsiParticipant) => {
        const name = p.getDisplayName() || "Remote User";
        const identity =
          p.getProperty?.("teleportParticipantIdentity") ||
          participantIdentityByIdRef.current.get(p.getId()) ||
          "";
        participantNameByIdRef.current.set(p.getId(), name);
        if (identity) participantIdentityByIdRef.current.set(p.getId(), identity);
        if (identity && identity === localParticipantIdentity) return;
        seenParticipants.set(identity || `name:${name}`, p.getId());
      });
      // Build a Set of active (de-duped) uids
      const activeUids = new Set(seenParticipants.values());

      setRemoteUsers((prev) =>
        prev.filter((u) => activeUids.has(u.uid) || u.uid === "local"),
      );

      participantsInRoom.forEach((participant: JitsiParticipant) => {
        // Skip ghost duplicates — only process the active uid for each name
        const name = participant.getDisplayName() || "Remote User";
        const participantIdentity =
          participant.getProperty?.("teleportParticipantIdentity") ||
          participantIdentityByIdRef.current.get(participant.getId()) ||
          "";
        if (
          participantIdentity &&
          participantIdentity === localParticipantIdentity
        ) {
          return;
        }
        const participantKey = participantIdentity || `name:${name}`;
        if (seenParticipants.get(participantKey) !== participant.getId()) return;

        const id = participant.getId();
        setRemoteUsers((prev) => {
          const exists = prev.find((u) => u.uid === id);
          if (exists) return prev;
          return [
            ...prev,
            {
              uid: id,
              videoTrack: null,
              audioTrack: null,
              hasVideo: false,
              hasAudio: false,
              name: participant.getDisplayName() || "Remote User",
              participantType: normalizeParticipantType(
                participant.getProperty?.("participantType"),
              ),
              participantIdentity,
            },
          ];
        });

        syncParticipantTracks(conf, participant, (track) => {
          setRemoteUsers((prev) =>
            mergeRemoteTrack(
              prev,
              track,
              conf,
              localParticipantIdentity,
              participantIdentityByIdRef.current,
            ),
          );
          if (track.getType() === "audio") {
            setRemoteMicStatus((prev) => ({
              ...prev,
              [track.getParticipantId()]: !track.isMuted(),
            }));
          }
        });
      });

      // Start meeting duration timer
      meetingStartTimeRef.current = Date.now();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        if (meetingStartTimeRef.current !== null) {
          const elapsed = Math.floor(
            (Date.now() - meetingStartTimeRef.current) / 1000,
          );
          dispatch(
            videoCallActions.setMeetingDuration(formatDuration(elapsed)),
          );
        }
      }, 1000);

      const addTracksToConf = (tracks: JitsiTrack[]) => {
        if (!jitsiConferenceRef.current || isCleanedUpRef.current) {
          console.warn(
            "Call already cleaned up before tracks resolved, disposing late tracks.",
          );
          tracks.forEach((track) => {
            try {
              track.mute();

              // 0. Try to call Jitsi's stop method directly if it exists
              if (typeof track.stop === "function") {
                try {
                  track.stop();
                } catch (e) {
                  console.warn(e);
                }
              }

              // 1. Stop the underlying raw MediaStreamTrack directly
              const rawTrack =
                typeof track.getTrack === "function"
                  ? track.getTrack()
                  : track.track;
              if (rawTrack && typeof rawTrack.stop === "function") {
                rawTrack.stop();
              }

              // 2. Stop all tracks from the original stream
              const originalStream =
                typeof track.getOriginalStream === "function"
                  ? track.getOriginalStream()
                  : track.stream;
              if (
                originalStream &&
                typeof originalStream.getTracks === "function"
              ) {
                originalStream.getTracks().forEach((t: MediaStreamTrack) => {
                  try {
                    t.stop();
                  } catch (e) {
                    console.warn("Late track stream stop error", e);
                  }
                });
              }

              // 3. Also stop from _activeMediaTracks list as a fallback
              if (window._activeMediaTracks) {
                window._activeMediaTracks.forEach((t) => {
                  try {
                    t.stop();
                  } catch (e) {
                    console.warn(e);
                  }
                });
                window._activeMediaTracks = [];
              }

              track.dispose();
            } catch (e) {
              console.warn("Error disposing late track:", e);
            }
          });
          return;
        }

        localTracksRef.current = tracks;

        // Register raw MediaStreamTracks globally so handleEndCall can stop
        // the hardware even when the Jitsi track is muted (camera off).
        if (!window._activeMediaTracks) {
          window._activeMediaTracks = [];
        }

        tracks.forEach((track) => {
          // Grab the underlying browser MediaStreamTrack and register it
          const rawTrack =
            typeof track.getTrack === "function"
              ? track.getTrack()
              : track.track;
          if (rawTrack) {
            window._activeMediaTracks!.push(rawTrack);
          }
          // Also register every stream track as a fallback
          const originalStream =
            typeof track.getOriginalStream === "function"
              ? track.getOriginalStream()
              : track.stream;
          if (
            originalStream &&
            typeof originalStream.getTracks === "function"
          ) {
            originalStream.getTracks().forEach((t: MediaStreamTrack) => {
              if (!window._activeMediaTracks!.includes(t)) {
                window._activeMediaTracks!.push(t);
              }
            });
          }

          if (track.getType() === "video") {
            setLocalCameraTrack(track);
            localCameraTrackRef.current = track; // keep ref in sync for screen share restore
            if (!cameraOn) {
              track.mute();
            }
          } else if (track.getType() === "audio") {
            setLocalMicrophoneTrack(track);
            if (!micOn) {
              track.mute();
            }
          }
          try {
            conf.addTrack(track);
          } catch (e) {
            console.warn("Error adding local track to Jitsi conference:", e);
          }
        });
      };

      const urlParamsForTracks = new URLSearchParams(window.location.search);
      const cameraDeviceId =
        urlParamsForTracks.get("cameraDeviceId") || undefined;
      const micDeviceId = urlParamsForTracks.get("micDeviceId") || undefined;

      JitsiMeetJS.createLocalTracks({
        devices: ["audio", "video"],
        constraints: {
          video: {
            height: { ideal: 720 },
            ...(cameraDeviceId ? { deviceId: { exact: cameraDeviceId } } : {}),
          },
          ...(micDeviceId
            ? { audio: { deviceId: { exact: micDeviceId } } }
            : {}),
        },
      })
        .then(addTracksToConf)
        .catch((err: unknown) => {
          console.warn("Combined tracks failed, trying audio-only...", err);
          JitsiMeetJS.createLocalTracks({ devices: ["audio"] })
            .then(addTracksToConf)
            .catch((err2: unknown) => {
              console.error("Jitsi local audio creation also failed:", err2);
            });
        });
    });

    conf.join();
    setIsConnected(true);
  };

  const onConnFailed = (err: unknown) => {
    console.error("Jitsi Connection Failed:", err);
    if (isBoshFallbackRef.current) {
      setIsConnected(false);
      return;
    }

    if (fallbackRestartInFlightRef.current) return;

    console.warn(
      "WebSocket connection failed; fully leaving before BOSH fallback...",
    );
    isBoshFallbackRef.current = true;

    const restartPromise = (async () => {
      await cleanup();
      if (!calling || isTabDuplicate) return;

      isCleanedUpRef.current = false;
      connectJitsi();
    })().finally(() => {
      if (fallbackRestartInFlightRef.current === restartPromise) {
        fallbackRestartInFlightRef.current = null;
      }
    });
    fallbackRestartInFlightRef.current = restartPromise;
  };

  const onConnDisconnected = () => {
    setIsConnected(false);
  };

  const connectJitsi = () => {
    const JitsiMeetJS = window.JitsiMeetJS;
    if (!JitsiMeetJS) return;
    const serviceUrl = isBoshFallbackRef.current
      ? `https://meet.bulmartech.com/http-bind?room=${roomName}`
      : `wss://meet.bulmartech.com/xmpp-websocket?room=${roomName}`;

    const connectionOptions = {
      hosts: {
        domain: "meet.bulmartech.com",
        anonymousdomain: "guest.meet.bulmartech.com",
        muc: "conference.meet.bulmartech.com",
        focus: "focus.meet.bulmartech.com",
      },
      serviceUrl,
    };

    const connection = new JitsiMeetJS.JitsiConnection(
      null,
      jwtToken || undefined,
      connectionOptions,
    );
    connectionRef.current = connection;

    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      onConnEstablished,
    );
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      onConnFailed,
    );
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_TEMPORARILY_FAILED,
      onConnFailed,
    );
    connection.addEventListener(
      JitsiMeetJS.events.connection.DISCONNECTED,
      onConnDisconnected,
    );

    if (!JitsiMeetJS) {
      console.error("JitsiMeetJS library is not loaded on window.");
      return;
    }

    JitsiMeetJS.init({
      disableAudioLevels: false,
    });
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.WARN);

    connection.connect();
  };

  useEffect(() => {
    let cancelled = false;

    const startConnection = async () => {
      await cleanup();
      if (cancelled || !calling || isTabDuplicate) return;

      isBoshFallbackRef.current = false;
      isCleanedUpRef.current = false;
      connectJitsi();
    };
    void startConnection();

    return () => {
      cancelled = true;
      void cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calling, roomName, jwtToken, isTabDuplicate]);

  // Sync mic on/off state from Redux to Jitsi track
  useEffect(() => {
    if (!calling) return;
    if (localMicrophoneTrack) {
      if (micOn) {
        localMicrophoneTrack
          .unmute()
          .catch((e: unknown) => console.error("Error unmuting local mic:", e));
      } else {
        localMicrophoneTrack
          .mute()
          .catch((e: unknown) => console.error("Error muting local mic:", e));
      }
    }
  }, [micOn, localMicrophoneTrack, calling]);

  // Sync camera on/off state from Redux to Jitsi track (never mute desktop/screen-share)
  useEffect(() => {
    if (!calling) return;
    if (localCameraTrack && !isDesktopTrack(localCameraTrack)) {
      if (cameraOn) {
        localCameraTrack
          .unmute()
          .catch((e: unknown) =>
            console.error("Error unmuting local camera:", e),
          );
      } else {
        localCameraTrack
          .mute()
          .catch((e: unknown) =>
            console.error("Error muting local camera:", e),
          );
      }
    }
  }, [cameraOn, localCameraTrack, calling]);

  const handleRetry = () => {
    window.location.reload();
  };

  const getConferenceLocalVideoTracks = (
    conference: JitsiConference,
  ): JitsiTrack[] =>
    conference.getLocalVideoTracks?.() ??
    conference
      .getLocalTracks?.()
      ?.filter((t: JitsiTrack) => t.getType() === "video") ??
    [];

  const getStoredCameraTrack = (
    conference: JitsiConference,
  ): JitsiTrack | null =>
    localCameraTrackRef.current ??
    localTracksRef.current.find(
      (t) => t.getType() === "video" && !isDesktopTrack(t),
    ) ??
    getConferenceLocalVideoTracks(conference).find((t) => !isDesktopTrack(t)) ??
    null;

  const restoreCameraToConference = async (
    conference: JitsiConference,
  ): Promise<JitsiTrack | null> => {
    const cameraTrack = getStoredCameraTrack(conference);
    if (!cameraTrack) return null;

    const alreadyInConf =
      getConferenceLocalVideoTracks(conference).includes(cameraTrack);
    if (!alreadyInConf) {
      try {
        await conference.addTrack(cameraTrack);
      } catch (e) {
        console.warn("Error adding camera track to Jitsi conference:", e);
      }
    }
    if (!cameraOn) {
      await cameraTrack
        .mute()
        .catch((e: unknown) =>
          console.warn("Error muting restored camera:", e),
        );
    }
    return cameraTrack;
  };

  /**
   * Toggle screen sharing on/off.
   *
   * Uses removeTrack + addTrack (not replaceTrack) so remote participants
   * are guaranteed to see the new track via a proper SDP renegotiation.
   * Also updates localCameraTrack state so the local preview switches to
   * the desktop feed.
   */
  const toggleScreenShare = async () => {
    // Guard must be checked AND set synchronously (before any await) so that
    // a rapid double-click or StrictMode double-invocation is blocked.
    if (isTogglingScreenShareRef.current) {
      console.warn(
        "[toggleScreenShare] Already in progress, skipping duplicate call",
      );
      return;
    }
    isTogglingScreenShareRef.current = true;

    try {
      const JitsiMeetJS = window.JitsiMeetJS;
      const conference = conferenceRef.current;
      if (!JitsiMeetJS || !conference) return;

      if (!isScreenSharing) {
        // ── Start screen share ────────────────────────────────────────────
        try {
          // Request the browser picker directly and hand the selected stream to
          // Jitsi. Going through createLocalTracks({ devices: ["desktop"] })
          // can re-enter its permission flow and reopen Chrome's picker.
          const desktopStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false,
          });
          const [desktopTrack] = JitsiMeetJS.createLocalTracksFromMediaStreams([
            {
              stream: desktopStream,
              mediaType: "video",
              videoType: "desktop",
            },
          ]);
          // Include the desktop track in the same lifecycle collection as the
          // camera and microphone so leaving/unmounting always stops capture.
          if (!localTracksRef.current.includes(desktopTrack)) {
            localTracksRef.current.push(desktopTrack);
          }

          if (isCleanedUpRef.current) {
            desktopTrack.dispose();
            localTracksRef.current = localTracksRef.current.filter(
              (track) => track !== desktopTrack,
            );
            return;
          }

          // Handle browser's native "Stop sharing" button
          desktopTrack.addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            async () => {
              dispatch(videoCallActions.handleScreenSharing(false));
              if (isCleanedUpRef.current) {
                localTracksRef.current = localTracksRef.current.filter(
                  (track) => track !== desktopTrack,
                );
                return;
              }
              try {
                await conference.removeTrack(desktopTrack);
                await restoreCameraToConference(conference);
              } catch (e) {
                console.warn("Error restoring camera after stop-share:", e);
              }
              desktopTrack.dispose();
              localTracksRef.current = localTracksRef.current.filter(
                (track) => track !== desktopTrack,
              );
              setLocalCameraTrack(localCameraTrackRef.current);
            },
          );

          // Remove camera track from conference so only desktop is sent
          const cameraTrack = getStoredCameraTrack(conference);
          if (cameraTrack) {
            try {
              await conference.removeTrack(cameraTrack);
            } catch (e) {
              console.warn("Error removing camera track:", e);
            }
          }

          // Add desktop track — remote participants will receive this
          try {
            await conference.addTrack(desktopTrack);
          } catch (e) {
            console.warn("Error adding desktop track to Jitsi conference:", e);
          }

          // Update local preview to show desktop feed
          setLocalCameraTrack(desktopTrack);
          dispatch(videoCallActions.handleScreenSharing(true));
        } catch (e) {
          // User cancelled the screen picker — not an error
          console.warn("Screen share cancelled:", e);
        }
      } else {
        // ── Stop screen share ─────────────────────────────────────────────
        const desktopTrack = getConferenceLocalVideoTracks(conference).find(
          (t) => isDesktopTrack(t),
        );

        try {
          if (desktopTrack) {
            await conference.removeTrack(desktopTrack);
            desktopTrack.dispose();
            localTracksRef.current = localTracksRef.current.filter(
              (track) => track !== desktopTrack,
            );
          }
          const cameraTrack = await restoreCameraToConference(conference);
          setLocalCameraTrack(cameraTrack);
        } catch (e) {
          console.warn("Error stopping screen share:", e);
        }

        dispatch(videoCallActions.handleScreenSharing(false));
      }
    } finally {
      isTogglingScreenShareRef.current = false;
    }
  };
  // Register toggleScreenShare in the global ref so Footer can call it
  screenShareActionRef.current = toggleScreenShare;
  setLocalCameraTrackRef.current = setLocalCameraTrack;
  setLocalMicrophoneTrackRef.current = setLocalMicrophoneTrack;

  const totalUserJoinedCount = remoteUsers.length + 1;

  useEffect(() => {
    dispatch(
      videoCallActions.handleSetParticipantCount(totalUserJoinedCount),
    );
  }, [dispatch, totalUserJoinedCount]);

  const endMeetingForAll = () => {
    if (conferenceRef.current) {
      conferenceRef.current.sendCommand("end_meeting_for_all", {
        value: "true",
      });
    }
    // sendCommand does not fire the listener on the sender's own tab,
    // so we call onMeetingEnded directly for the provider.
    if (onMeetingEndedRef.current) {
      onMeetingEndedRef.current();
    }
  };

  // const isPipSupported = "documentPictureInPicture" in window;

  const openPip = async () => {
    if (!isPipSupported) {
      console.warn("Native PiP is not supported in this browser.");
      return;
    }

    const activeRemoteUser =
      remoteUsers.find(
        (user) =>
          user.participantType === "patient" &&
          user.hasVideo &&
          user.videoTrack,
      ) || remoteUsers.find((user) => user.hasVideo && user.videoTrack);
    if (
      !activeRemoteUser ||
      !activeRemoteUser.hasVideo ||
      !activeRemoteUser.videoTrack
    ) {
      errorMessage(
        "Cannot enter PiP mode: Please ask the patient to turn on their video.",
      );
      return;
    }

    // Find a video element that has a valid playing stream
    const videoElements = Array.from(document.querySelectorAll("video"));
    const participantVideo = videoElements.find(
      (video) => video.dataset.participantUid === activeRemoteUser.uid,
    );
    const videoEl =
      participantVideo &&
      participantVideo.readyState >= 2 &&
      participantVideo.srcObject
        ? participantVideo
        : mainRemoteVideoRef.current &&
            mainRemoteVideoRef.current.dataset.participantUid ===
              activeRemoteUser.uid &&
      mainRemoteVideoRef.current.readyState >= 2 &&
      mainRemoteVideoRef.current.srcObject
        ? mainRemoteVideoRef.current
        : videoElements.find(
            (v) => (v.srcObject as MediaStream)?.active && v.readyState >= 2,
          ) ||
          videoElements.find((v) => v.srcObject) ||
          mainRemoteVideoRef.current ||
          videoElements[0];

    if (videoEl) {
      try {
        const handlePipLeave = (e?: Event) => {
          if (
            e &&
            e.type === "webkitpresentationmodechanged" &&
            (videoEl as any).webkitPresentationMode === "picture-in-picture"
          ) {
            return; // Still entering or in PiP, do not handle as exit
          }

          setIsNativePipActive(false);
          videoEl.removeEventListener("leavepictureinpicture", handlePipLeave);

          (videoEl as any).removeEventListener(
            "webkitpresentationmodechanged",
            handlePipLeave,
          );

          // Force play on all video elements in the DOM to ensure no video stream remains paused on Safari
          const resumeAllVideos = () => {
            const allVideos = Array.from(document.querySelectorAll("video"));
            allVideos.forEach((v) => {
              if (v.srcObject) {
                v.play().catch(() => {});
              }
            });
          };

          resumeAllVideos();
          setTimeout(resumeAllVideos, 50);
          setTimeout(resumeAllVideos, 150);
          setTimeout(resumeAllVideos, 300);

          const onPauseAfterPip = (evt: Event) => {
            const target = evt.target as HTMLVideoElement;
            if (target && target.srcObject) {
              target.play().catch(() => {});
            }
          };

          document.addEventListener("pause", onPauseAfterPip, true);
          setTimeout(() => {
            document.removeEventListener("pause", onPauseAfterPip, true);
          }, 1000);
        };
        videoEl.addEventListener("leavepictureinpicture", handlePipLeave);

        (videoEl as any).addEventListener(
          "webkitpresentationmodechanged",
          handlePipLeave,
        );

        if ("mediaSession" in navigator) {
          try {
            const noop = () => {};
            navigator.mediaSession.setActionHandler("seekbackward", null);
            navigator.mediaSession.setActionHandler("seekforward", null);
            navigator.mediaSession.setActionHandler("previoustrack", null);
            navigator.mediaSession.setActionHandler("nexttrack", null);
            navigator.mediaSession.setActionHandler("seekto", null);
            // Overriding play/pause with active no-ops prevents Safari from rendering hover buttons in PiP window
            navigator.mediaSession.setActionHandler("play", noop);
            navigator.mediaSession.setActionHandler("pause", noop);
            try {
              navigator.mediaSession.setActionHandler("stop" as any, noop);
            } catch {
              // stop action handler may not be supported on all environments
            }
          } catch {
            // mediaSession configurations can be disabled on some platforms
          }
        }

        if ("requestPictureInPicture" in videoEl) {
          (videoEl as HTMLVideoElement).disablePictureInPicture = false;
          await (videoEl as HTMLVideoElement).requestPictureInPicture();
          // Disable PiP overlay button on Safari/WebKit only

          if ("webkitSupportsPresentationMode" in (videoEl as any)) {
            (videoEl as HTMLVideoElement).disablePictureInPicture = true;
          }
        } else if (
          (videoEl as any).webkitSupportsPresentationMode &&
          typeof (videoEl as any).webkitSetPresentationMode === "function"
        ) {
          (videoEl as any).webkitSetPresentationMode("picture-in-picture");
        }
        setIsNativePipActive(true);
      } catch (err) {
        console.error("Error opening native video PiP:", err);
      }
    } else {
      console.warn("No active <video> element found to launch PiP.");
    }
  };

  const closePip = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    }
    setIsNativePipActive(false);
  };

  const togglePip = () => {
    if (document.pictureInPictureElement || isNativePipActive) {
      closePip();
    } else {
      openPip();
    }
  };

  return {
    isConnected,
    remoteUsers,
    localCameraTrack,
    localMicrophoneTrack,
    micOn,
    cameraOn,
    isScreenSharing,
    totalUserJoinedCount,
    handleRetry,
    remoteMicStatus,
    toggleScreenShare,
    endMeetingForAll,
    pipWindow,
    togglePip,
    closePip,
    isPipSupported,
    isNativePipActive,
    isTabDuplicate,
    registerMainRemoteVideo,
  };
};
