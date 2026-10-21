/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type ParticipantType = "patient" | "provider" | "family";

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

export const normalizeParticipantType = (
  value: string | null | undefined,
): ParticipantType =>
  value === "patient" || value === "provider" || value === "family"
    ? value
    : "family";

export const isDesktopTrack = (track: JitsiTrack | null | undefined): boolean =>
  track?.videoType === "desktop" || track?.getVideoType?.() === "desktop";

/** Prefer desktop over camera when both tracks exist during screen-share transitions */
export const pickVideoTrack = (
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
export const isActiveVideoTrack = (
  displayed: JitsiTrack | null,
  eventTrack: JitsiTrack,
): boolean => {
  if (!displayed || !eventTrack) return false;
  if (displayed === eventTrack) return true;
  return isDesktopTrack(displayed) === isDesktopTrack(eventTrack);
};

export const resolveVideoTrackAfterRemoval = (
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

export const syncParticipantTracks = (
  _conf: JitsiConference,
  participant: JitsiParticipant,
  onTrack: (_track: JitsiTrack) => void,
): void => {
  participant.getTracks().forEach((track: JitsiTrack) => {
    if (!track.isLocal()) onTrack(track);
  });
};

export const mergeRemoteTrack = (
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
    if (!oldUser) return prev;
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
