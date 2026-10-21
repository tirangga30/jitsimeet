/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IJitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";

export const jitsiApiRef: { current: IJitsiMeetExternalApi | null } = {
  current: null,
};
export const jitsiConferenceRef: { current: any | null } = { current: null };

/** Holds the current local camera JitsiTrack — used to restore after screen share ends */
export const localCameraTrackRef: { current: any | null } = { current: null };

/** Set by useJitsiCall so Footer can call toggleScreenShare without prop-drilling */
export const screenShareActionRef: { current: (() => Promise<void>) | null } = {
  current: null,
};

let screenShareActionInFlight: Promise<void> | null = null;

/** Run at most one screen-share action across all mounted call components. */
export const invokeScreenShareAction = (): Promise<void> => {
  if (screenShareActionInFlight) return screenShareActionInFlight;

  const action = screenShareActionRef.current;
  if (!action) return Promise.resolve();

  screenShareActionInFlight = action().finally(() => {
    screenShareActionInFlight = null;
  });
  return screenShareActionInFlight;
};

/** Callbacks to update react state inside useJitsiCall when tracks change */
export const setLocalCameraTrackRef: {
  current: ((track: any) => void) | null;
} = { current: null };
export const setLocalMicrophoneTrackRef: {
  current: ((track: any) => void) | null;
} = { current: null };

let cameraSwitchInFlight: Promise<void> | null = null;

const isCameraTrack = (track: any): boolean =>
  track?.getType?.() === "video" &&
  track?.videoType !== "desktop" &&
  track?.getVideoType?.() !== "desktop";

const replaceLocalCamera = async ({
  deviceId,
  facingMode,
}: {
  deviceId?: string;
  facingMode?: "user" | "environment";
}): Promise<void> => {
  const JitsiMeetJS = (window as any).JitsiMeetJS;
  const conference = jitsiConferenceRef.current;
  if (!JitsiMeetJS || !conference) {
    throw new Error("The video conference is not ready");
  }

  const currentTrack =
    (conference.getLocalTracks?.() || []).find(isCameraTrack) ||
    localCameraTrackRef.current;
  const videoConstraints: Record<string, unknown> = {
    height: { ideal: 720 },
  };
  if (deviceId) videoConstraints.deviceId = { exact: deviceId };
  if (!deviceId && facingMode) {
    videoConstraints.facingMode = { ideal: facingMode };
  }

  const tracks = await JitsiMeetJS.createLocalTracks({
    devices: ["video"],
    ...(deviceId ? { cameraDeviceId: deviceId } : {}),
    constraints: { video: videoConstraints },
  });
  const newTrack = tracks.find(isCameraTrack) || tracks[0];
  if (!newTrack) throw new Error("The selected camera did not create a track");

  try {
    if (currentTrack?.isMuted?.()) await newTrack.mute();

    if (currentTrack && typeof conference.replaceTrack === "function") {
      await conference.replaceTrack(currentTrack, newTrack);
    } else {
      if (currentTrack) await conference.removeTrack(currentTrack);
      try {
        await conference.addTrack(newTrack);
      } catch (error) {
        if (currentTrack) await conference.addTrack(currentTrack);
        throw error;
      }
    }

    localCameraTrackRef.current = newTrack;
    setLocalCameraTrackRef.current?.(newTrack);
    if (currentTrack && currentTrack !== newTrack) await currentTrack.dispose();
  } catch (error) {
    await newTrack.dispose();
    throw error;
  }
};

const runCameraSwitch = (action: () => Promise<void>): Promise<void> => {
  if (cameraSwitchInFlight) return cameraSwitchInFlight;
  cameraSwitchInFlight = action().finally(() => {
    cameraSwitchInFlight = null;
  });
  return cameraSwitchInFlight;
};

export const switchLocalCamera = (deviceId: string): Promise<void> =>
  runCameraSwitch(() => replaceLocalCamera({ deviceId }));

export const flipLocalCamera = (): Promise<void> =>
  runCameraSwitch(async () => {
    const conference = jitsiConferenceRef.current;
    const currentTrack =
      (conference?.getLocalTracks?.() || []).find(isCameraTrack) ||
      localCameraTrackRef.current;
    const settings = currentTrack?.getTrack?.().getSettings?.() || {};
    const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
      (device) => device.kind === "videoinput",
    );
    const currentCamera = cameras.find(
      (camera) => camera.deviceId === settings.deviceId,
    );
    const isBackCamera = (camera: MediaDeviceInfo) =>
      /back|rear|environment/i.test(camera.label);
    const isFrontCamera = (camera: MediaDeviceInfo) =>
      /front|user|facetime/i.test(camera.label);
    const currentlyBack =
      settings.facingMode === "environment" ||
      (!!currentCamera && isBackCamera(currentCamera));
    const nextFacingMode = currentlyBack ? "user" : "environment";
    const targetCamera = cameras.find(
      (camera) =>
        camera.deviceId !== settings.deviceId &&
        (currentlyBack ? isFrontCamera(camera) : isBackCamera(camera)),
    );
    const fallbackCamera = cameras.find(
      (camera) => camera.deviceId !== settings.deviceId,
    );

    await replaceLocalCamera({
      deviceId: (targetCamera || fallbackCamera)?.deviceId,
      facingMode: nextFacingMode,
    });
  });
