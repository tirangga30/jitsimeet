import React, { useEffect, useRef, useState } from "react";
import {
  MobileJoinContainer,
  MobileLogo,
  MobileTitle,
  MobileVideoWrapper,
  MobileVideoElement,
  MobilePlaceholderImage,
  MobileRoundControlsContainer,
  MobileRoundControlButton,
  MobileInstructionsLabel,
  MobileDropdownWrapper,
  MobileSelectRow,
} from "./MobileJoinMeeting.styles";
import logo from "../../assets/img/newlogo.png";
import voiceIcon from "../../assets/icons/white/Voice.png";
import micIcon from "../../assets/icons/Mute Unmute.png";
import videoIcon from "../../assets/icons/video.png";
import videoPlaceholderIcon from "../../assets/img/Groupprovider.png";
import micOffIconWhite from "../../assets/icons/white/icons8-mute-unmute-48 (1).png";
import micOnIconWhite from "../../assets/icons/white/icons8-microphone-48.png";
import videoOnIconWhite from "../../assets/icons/white/icons8-video-call-30.png";
import videoOffIconWhite from "../../assets/icons/white/icons8-no-video-30.png";
import {
  ChevronIcon,
  CustomSelectContainer,
  CustomSelectHeader,
  CustomSelectOption,
  CustomSelectOptions,
} from "./JoinMeeting.styles";
import { Button } from "../../components";
import { theme } from "../../styles/theme";

interface MobileJoinMeetingProps {
  heading: string;
  patientName: string;
  buttonLabel: string;
  onJoin: (_opts: {
    videoEnabled: boolean;
    micEnabled: boolean;
    cameraDeviceId?: string;
    micDeviceId?: string;
  }) => void | Promise<void>;
}

export const MobileJoinMeeting: React.FC<MobileJoinMeetingProps> = ({
  heading,
  buttonLabel,
  onJoin,
  patientName,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewSessionRef = useRef(0);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>();
  const [selectedMic, setSelectedMic] = useState<string | undefined>();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<
    "camera" | "mic" | "speaker" | null
  >(null);

  const updateDeviceLists = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === "videoinput"));
      setMicrophones(devices.filter((d) => d.kind === "audioinput"));
    } catch (err) {
      console.error("enumerateDevices error", err);
    }
  };

  const stopPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
  };

  const startPreview = async (camId?: string, micId?: string) => {
    const session = ++previewSessionRef.current;
    stopPreview();

    try {
      const constraints = {
        video: camId ? { deviceId: { exact: camId } } : true,
        audio: micId ? { deviceId: { exact: micId } } : true,
      };

      const s = await navigator.mediaDevices.getUserMedia(constraints);

      if (session !== previewSessionRef.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }

      s.getVideoTracks().forEach((t) => {
        t.enabled = videoEnabled;
      });
      s.getAudioTracks().forEach((t) => {
        t.enabled = micEnabled;
      });

      streamRef.current = s;

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
      if (audioRef.current) {
        audioRef.current.srcObject = s;
        audioRef.current.muted = true;
        await audioRef.current.play().catch(() => {});
      }

      if (session !== previewSessionRef.current) {
        stopPreview();
        return;
      }

      await updateDeviceLists();
    } catch (err) {
      console.error("getUserMedia error", err);
    }
  };

  const toggleVideo = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    } else {
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicEnabled(track.enabled);
    } else {
      setMicEnabled(!micEnabled);
    }
  };

  const handleCameraChange = async (id?: string) => {
    setSelectedCamera(id);
    await startPreview(id, selectedMic);
  };

  const handleMicChange = async (id?: string) => {
    setSelectedMic(id);
    await startPreview(selectedCamera, id);
  };

  useEffect(() => {
    updateDeviceLists();
    startPreview();

    return () => {
      previewSessionRef.current += 1;
      stopPreview();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoin = async () => {
    previewSessionRef.current += 1;
    stopPreview();
    await onJoin({
      videoEnabled,
      micEnabled,
      cameraDeviceId: selectedCamera,
      micDeviceId: selectedMic,
    });
  };

  return (
    <MobileJoinContainer>
      <MobileLogo src={logo} alt="logo" />
      <MobileTitle>{heading}</MobileTitle>
      <MobileTitle>{patientName}</MobileTitle>

      {/* Video Preview Frame */}
      <MobileVideoWrapper>
        <MobileVideoElement ref={videoRef} playsInline autoPlay />
        {!videoEnabled && (
          <MobilePlaceholderImage src={videoPlaceholderIcon} alt="Camera Off" />
        )}

        <MobileRoundControlsContainer>
          <MobileRoundControlButton
            $enabled={videoEnabled}
            onClick={toggleVideo}
          >
            <img
              src={videoEnabled ? videoOnIconWhite : videoOffIconWhite}
              alt="camera toggle"
              style={{ width: 20, height: 20 }}
            />
          </MobileRoundControlButton>
          <MobileRoundControlButton $enabled={micEnabled} onClick={toggleMic}>
            <img
              src={micEnabled ? micOnIconWhite : micOffIconWhite}
              alt="mic toggle"
              style={{ width: 20, height: 20 }}
            />
          </MobileRoundControlButton>
        </MobileRoundControlsContainer>
      </MobileVideoWrapper>

      {/* Action Button */}
      <Button
        bgcolor={theme.colors.lightgreen}
        border="1px solid #FFFFFF"
        hoverBg="#12BB5E"
        hoverBorder="1px solid #FFFFFF"
        onClick={handleJoin}
        width="min(320px, 85%)"
      >
        {buttonLabel}
      </Button>

      {/* Dropdown Options */}
      <MobileInstructionsLabel>
        <img
          src={voiceIcon}
          alt="instructions"
          style={{ width: 18, height: 18 }}
        />
        Choose your audio &amp; video options for the meeting
      </MobileInstructionsLabel>

      <MobileDropdownWrapper>
        {/* Camera Select */}
        <MobileSelectRow>
          <img src={videoIcon} alt="camera" style={{ width: 20 }} />
          <CustomSelectContainer>
            <CustomSelectHeader
              $isOpen={openDropdown === "camera"}
              onClick={() =>
                setOpenDropdown(openDropdown === "camera" ? null : "camera")
              }
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
                  $isSelected={!selectedCamera}
                  onClick={() => {
                    handleCameraChange(undefined);
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
                    {c.label || c.deviceId}
                  </CustomSelectOption>
                ))}
              </CustomSelectOptions>
            )}
          </CustomSelectContainer>
        </MobileSelectRow>

        {/* Mic Select */}
        <MobileSelectRow>
          <img src={micIcon} alt="microphone" style={{ width: 18 }} />
          <CustomSelectContainer>
            <CustomSelectHeader
              $isOpen={openDropdown === "mic"}
              onClick={() =>
                setOpenDropdown(openDropdown === "mic" ? null : "mic")
              }
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
                  $isSelected={!selectedMic}
                  onClick={() => {
                    handleMicChange(undefined);
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
                    {m.label || m.deviceId}
                  </CustomSelectOption>
                ))}
              </CustomSelectOptions>
            )}
          </CustomSelectContainer>
        </MobileSelectRow>
      </MobileDropdownWrapper>

      <audio ref={audioRef} style={{ display: "none" }} />
    </MobileJoinContainer>
  );
};
