import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  RightControls,
  ControlRow,
  StartButton,
  Small,
  Icon,
  ControlContainer,
  ControlLabel,
  CustomSelectContainer,
  CustomSelectHeader,
  ChevronIcon,
  CustomSelectOptions,
  CustomSelectOption,
} from "../../pages/JoinMeeting/JoinMeeting.styles";
import voiceIcon from "../../assets/icons/white/Voice.png";
import micIcon from "../../assets/icons/Mute Unmute.png";
import videoIcon from "../../assets/icons/video.png";
import videoPlaceholderIcon from "../../assets/img/Groupprovider.png";

export interface DevicePreviewJoinOptions {
  videoEnabled: boolean;
  micEnabled: boolean;
  cameraDeviceId?: string;
  micDeviceId?: string;
}

interface DevicePreviewProps {
  heading?: string;
  buttonLabel?: string;
  onJoin: (_opts: DevicePreviewJoinOptions) => void | Promise<void>;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  heading = "Join the meeting",
  buttonLabel = "Join",
  onJoin,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewSessionRef = useRef(0);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>();
  const [selectedMic, setSelectedMic] = useState<string | undefined>();
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | undefined>();
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
      setSpeakers(devices.filter((d) => d.kind === "audiooutput"));
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
    if (!track) return;
    track.enabled = !track.enabled;
    setVideoEnabled(track.enabled);
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicEnabled(track.enabled);
  };

  const handleCameraChange = async (id?: string) => {
    setSelectedCamera(id);
    await startPreview(id, selectedMic);
  };

  const handleMicChange = async (id?: string) => {
    setSelectedMic(id);
    await startPreview(selectedCamera, id);
  };

  const handleSpeakerChange = (id?: string) => {
    setSelectedSpeaker(id);
  };

  useEffect(() => {
    const setOutput = async () => {
      if (!selectedSpeaker || !audioRef.current) return;
      const el = audioRef.current as HTMLMediaElement & {
        setSinkId?: (_id: string) => Promise<void>;
      };
      if (typeof el.setSinkId === "function") {
        try {
          await el.setSinkId!(selectedSpeaker);
        } catch (err) {
          console.warn("setSinkId failed", err);
        }
      }
    };
    setOutput();
  }, [selectedSpeaker]);

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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {heading && (
        <h2
          style={{
            fontSize: "22px",
            color: "#fff",
            marginBottom: "20px",
            fontWeight: 600,
          }}
        >
          {heading}
        </h2>
      )}

      <Card style={{ overflow: "visible" }}>
        {/* ── Video preview ── */}
        <div style={{ width: 520, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 500 }}>
            <video
              ref={videoRef}
              style={{
                width: "100%",
                height: 300,
                borderRadius: 6,
                objectFit: "cover",
                display: "block",
              }}
              playsInline
              autoPlay
            />

            {!videoEnabled && (
              <img
                src={videoPlaceholderIcon}
                alt="Camera Off"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
            )}

            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div
                onClick={toggleVideo}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: videoEnabled ? "rgba(0,0,0,0.45)" : "#05324E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <img src={videoIcon} alt="toggle video" style={{ width: 18 }} />
              </div>

              <div
                onClick={toggleMic}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  background: micEnabled ? "rgba(0,0,0,0.45)" : " #05324E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <img src={micIcon} alt="toggle mic" style={{ width: 18 }} />
              </div>
            </div>
          </div>
        </div>

        <RightControls>
          <Small>
            <Icon
              src={voiceIcon}
              width={"22"}
              height={"22"}
              marginRight="5px"
            />
            Choose your audio &amp; video options for the meeting
          </Small>

          <ControlRow style={{ zIndex: openDropdown === "camera" ? 100 : 1 }}>
            <ControlContainer>
              <ControlLabel>Video</ControlLabel>
              <Icon
                src={videoIcon}
                width={"22"}
                height={"14"}
                marginRight="5px"
              />
            </ControlContainer>
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
          </ControlRow>

          <ControlRow style={{ zIndex: openDropdown === "mic" ? 100 : 1 }}>
            <ControlContainer>
              <ControlLabel>Microphone</ControlLabel>
              <Icon
                src={micIcon}
                width={"18"}
                height={"20"}
                marginRight="5px"
              />
            </ControlContainer>
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
          </ControlRow>

          <ControlRow style={{ zIndex: openDropdown === "speaker" ? 100 : 1 }}>
            <ControlContainer>
              <ControlLabel>Speaker</ControlLabel>
              <Icon
                src={voiceIcon}
                width={"22"}
                height={"22"}
                marginRight="5px"
              />
            </ControlContainer>
            <CustomSelectContainer>
              <CustomSelectHeader
                $isOpen={openDropdown === "speaker"}
                onClick={() =>
                  setOpenDropdown(openDropdown === "speaker" ? null : "speaker")
                }
              >
                <span>
                  {speakers.find((s) => s.deviceId === selectedSpeaker)
                    ?.label || "Default Speaker"}
                </span>
                <ChevronIcon $isOpen={openDropdown === "speaker"} />
              </CustomSelectHeader>
              {openDropdown === "speaker" && (
                <CustomSelectOptions>
                  <CustomSelectOption
                    $isSelected={!selectedSpeaker}
                    onClick={() => {
                      handleSpeakerChange(undefined);
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
                      {s.label || s.deviceId}
                    </CustomSelectOption>
                  ))}
                </CustomSelectOptions>
              )}
            </CustomSelectContainer>
          </ControlRow>

          <audio ref={audioRef} style={{ display: "none" }} />
        </RightControls>
      </Card>

      <StartButton onClick={handleJoin}>{buttonLabel}</StartButton>
    </div>
  );
};

export default DevicePreview;
