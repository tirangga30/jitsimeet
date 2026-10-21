/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  globalActions,
  selectShowAudioVideoModal,
} from "../../store/features/global/globalSlice";

import videoIcon from "../../assets/icons/primary/video.png";
import unmuteMicIcon from "../../assets/icons/Unmute.png";
import speakerGreyIcon from "../../assets/icons/Voice.png";
import speakerWhiteIcon from "../../assets/icons/white/Voice.png";

import {
  jitsiConferenceRef,
  setLocalMicrophoneTrackRef,
  switchLocalCamera,
} from "../../utils/jitsiApi";
import {
  CloseBtn,
  DeviceRow,
  HeaderLeft,
  HeaderTitle,
  IconCell,
  ModalBody,
  ModalBox,
  ModalHeader,
  Overlay,
  CustomSelectContainer,
  CustomSelectHeader,
  CustomSelectOptions,
  CustomSelectOption,
  ChevronIcon,
} from "./AudioVideoSettingModal.styles";
import { Icon } from "../Button/Button.styles";

export const AudioVideoSettingModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectShowAudioVideoModal);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"camera" | "mic" | "speaker" | null>(null);

  useEffect(() => {
    if (!isOpen) return;

     
    const JitsiMeetJS = (window as any).JitsiMeetJS;
    const conference = jitsiConferenceRef.current;

    // Load list of devices
    const loadDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameras(devices.filter((d) => d.kind === "videoinput"));
        setMicrophones(devices.filter((d) => d.kind === "audioinput"));
        setSpeakers(devices.filter((d) => d.kind === "audiooutput"));
      } catch (err) {
        console.error("enumerateDevices error", err);
      }
    };
    loadDevices();

    // Read current active deviceIds if available
    if (conference) {
      const localTracks = conference.getLocalTracks?.() || [];
       
      const videoTrack = localTracks.find((t: any) => t.getType() === "video");
       
      const audioTrack = localTracks.find((t: any) => t.getType() === "audio");

      if (videoTrack?.getTrack()?.getSettings()?.deviceId) {
        setSelectedCamera(videoTrack.getTrack().getSettings().deviceId);
      }
      if (audioTrack?.getTrack()?.getSettings()?.deviceId) {
        setSelectedMic(audioTrack.getTrack().getSettings().deviceId);
      }
    }

    if (JitsiMeetJS?.getActivePlayouts) {
      const activeSpeakerId = JitsiMeetJS.getAudioOutputDevice?.();
      if (activeSpeakerId) {
        setSelectedSpeaker(activeSpeakerId);
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    dispatch(globalActions.handleShowAudioVideoModal(false));
  };

  const handleCameraChange = async (deviceId: string) => {
    setSelectedCamera(deviceId);
     
    try {
      await switchLocalCamera(deviceId);
    } catch (err) {
      console.error("Failed to switch camera", err);
    }
  };

  const handleMicChange = async (deviceId: string) => {
    setSelectedMic(deviceId);
     
    const JitsiMeetJS = (window as any).JitsiMeetJS;
    const conference = jitsiConferenceRef.current;
    if (!JitsiMeetJS || !conference) return;

    try {
      const localTracks = conference.getLocalTracks?.() || [];
       
      const currentMicTrack = localTracks.find(
        (t: any) => t.getType() === "audio",
      );

      // Create new track with new deviceId
      const [newTrack] = await JitsiMeetJS.createLocalTracks({
        devices: ["audio"],
        micDeviceId: deviceId,
      });

      if (currentMicTrack) {
        await conference.removeTrack(currentMicTrack);
        await currentMicTrack.dispose();
      }

      await conference.addTrack(newTrack);

      // Sync react state inside hook
      if (setLocalMicrophoneTrackRef.current) {
        setLocalMicrophoneTrackRef.current(newTrack);
      }
    } catch (err) {
      console.error("Failed to switch microphone", err);
    }
  };

  const handleSpeakerChange = async (deviceId: string) => {
    setSelectedSpeaker(deviceId);
     
    const JitsiMeetJS = (window as any).JitsiMeetJS;
    if (!JitsiMeetJS) return;

    try {
      if (typeof JitsiMeetJS.setAudioOutputDevice === "function") {
        await JitsiMeetJS.setAudioOutputDevice(deviceId);
      }
    } catch (err) {
      console.error("Failed to switch speaker output", err);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        {/* ── Header ── */}
        <ModalHeader>
          <HeaderLeft>
            <Icon
              src={speakerWhiteIcon}
              alt="speakerWhiteIcon"
              width={19}
              height={19}
            />
            <HeaderTitle>Audio &amp; Video Setting</HeaderTitle>
          </HeaderLeft>
          <CloseBtn onClick={handleClose} aria-label="Close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseBtn>
        </ModalHeader>

        {/* ── Body ── */}
        <ModalBody>
          {/* Camera */}
          <DeviceRow>
            <IconCell>
              <Icon src={videoIcon} alt="video icon" width={30} height={20} />
            </IconCell>
            <CustomSelectContainer>
              <CustomSelectHeader
                $isOpen={openDropdown === "camera"}
                onClick={() => setOpenDropdown(openDropdown === "camera" ? null : "camera")}
              >
                <span>
                  {cameras.find((c) => c.deviceId === selectedCamera)?.label ||
                    "Default Camera"}
                </span>
                <ChevronIcon $isOpen={openDropdown === "camera"} />
              </CustomSelectHeader>
              {openDropdown === "camera" && (
                <CustomSelectOptions>
                  <CustomSelectOption
                    $isSelected={selectedCamera === ""}
                    onClick={() => {
                      handleCameraChange("");
                      setOpenDropdown(null);
                    }}
                  >
                    Default Camera
                  </CustomSelectOption>
                  {cameras.map((c) => (
                    <CustomSelectOption
                      key={c.deviceId}
                      $isSelected={selectedCamera === c.deviceId}
                      onClick={() => {
                        handleCameraChange(c.deviceId);
                        setOpenDropdown(null);
                      }}
                    >
                      {c.label || `Camera ${c.deviceId.slice(0, 8)}`}
                    </CustomSelectOption>
                  ))}
                </CustomSelectOptions>
              )}
            </CustomSelectContainer>
          </DeviceRow>

          {/* Microphone */}
          <DeviceRow style={{ zIndex: openDropdown === "mic" ? 100 : 1 }}>
            <IconCell>
              <Icon
                src={unmuteMicIcon}
                alt="Unmute Mic"
                width={29}
                height={20}
              />
            </IconCell>
            <CustomSelectContainer>
              <CustomSelectHeader
                $isOpen={openDropdown === "mic"}
                onClick={() => setOpenDropdown(openDropdown === "mic" ? null : "mic")}
              >
                <span>
                  {microphones.find((m) => m.deviceId === selectedMic)?.label ||
                    "Default Microphone"}
                </span>
                <ChevronIcon $isOpen={openDropdown === "mic"} />
              </CustomSelectHeader>
              {openDropdown === "mic" && (
                <CustomSelectOptions>
                  <CustomSelectOption
                    $isSelected={selectedMic === ""}
                    onClick={() => {
                      handleMicChange("");
                      setOpenDropdown(null);
                    }}
                  >
                    Default Microphone
                  </CustomSelectOption>
                  {microphones.map((m) => (
                    <CustomSelectOption
                      key={m.deviceId}
                      $isSelected={selectedMic === m.deviceId}
                      onClick={() => {
                        handleMicChange(m.deviceId);
                        setOpenDropdown(null);
                      }}
                    >
                      {m.label || `Microphone ${m.deviceId.slice(0, 8)}`}
                    </CustomSelectOption>
                  ))}
                </CustomSelectOptions>
              )}
            </CustomSelectContainer>
          </DeviceRow>

          {/* Speaker */}
          <DeviceRow style={{ zIndex: openDropdown === "speaker" ? 100 : 1 }}>
            <IconCell>
              <Icon
                src={speakerGreyIcon}
                alt="speakerGreyIcon"
                width={30}
                height={30}
              />
            </IconCell>
            <CustomSelectContainer>
              <CustomSelectHeader
                $isOpen={openDropdown === "speaker"}
                onClick={() => setOpenDropdown(openDropdown === "speaker" ? null : "speaker")}
              >
                <span>
                  {speakers.find((s) => s.deviceId === selectedSpeaker)?.label ||
                    "Default Speaker"}
                </span>
                <ChevronIcon $isOpen={openDropdown === "speaker"} />
              </CustomSelectHeader>
              {openDropdown === "speaker" && (
                <CustomSelectOptions>
                  <CustomSelectOption
                    $isSelected={selectedSpeaker === ""}
                    onClick={() => {
                      handleSpeakerChange("");
                      setOpenDropdown(null);
                    }}
                  >
                    Default Speaker
                  </CustomSelectOption>
                  {speakers.map((s) => (
                    <CustomSelectOption
                      key={s.deviceId}
                      $isSelected={selectedSpeaker === s.deviceId}
                      onClick={() => {
                        handleSpeakerChange(s.deviceId);
                        setOpenDropdown(null);
                      }}
                    >
                      {s.label || `Speaker ${s.deviceId.slice(0, 8)}`}
                    </CustomSelectOption>
                  ))}
                </CustomSelectOptions>
              )}
            </CustomSelectContainer>
          </DeviceRow>
        </ModalBody>
      </ModalBox>
    </Overlay>
  );
};

export default AudioVideoSettingModal;
