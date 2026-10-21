import axios from "axios";
import Modal from "react-modal";
import uploadIcon from "../../assets/icons/upload.png";
import uploadPrimaryIcon from "../../assets/icons/primary/upload.png";
import type { Swiper as SwiperType } from "swiper";
import cameraIcon from "../../assets/icons/white/camera.png";
import cameraPrimaryIcon from "../../assets/icons/primary/camera.png";

import videoOnIcon from "../../assets/icons/white/icons8-video-call-30.png";
import sendIcon from "../../assets/icons/white/send.png";

import videoOffIcon from "../../assets/icons/white/icons8-no-video-30.png";
import crossIcon from "../../assets/icons/white/cross.png";
import phoneIcon from "../../assets/icons/white/phone.png";
import tickIcon from "../../assets/icons/tick.png";

import redCrossIcon from "../../assets/icons/redcross.png";
import { Button } from "../../components";
import ReactDOM from "react-dom";
import { PipRemoteUser } from "../../components/VideoLayouts/PipRemoteUser";
import microphoneIcon from "../../assets/icons/white/icons8-microphone-48.png";
import microphoneMuteIcon from "../../assets/icons/white/icons8-mute-unmute-48 (1).png";
import { GridLayout } from "../../components/VideoLayouts/GridLayout/GridLayout";
import { ListLayout } from "../../components/VideoLayouts/ListLayout/ListLayout";
import { jitsiConferenceRef } from "../../utils/jitsiApi";
import {
  globalActions,
  SelectIsEndCall,
  selectLayout,
  selectShowPardonInterruptionModal,
  selectShowUploadModel,
} from "../../store/features/global/globalSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  ModelHeader,
  ModelHeaderTitle,
} from "../FamilyAndFriend/FamilyAndFriend.styles";
import {
  ButtonContainer,
  CapturedImage,
  ModalBodypardonInterruption,
  ModelBody,
  ModelBodyPara,
  ModelBodySubTitle,
  ModelBodyTitle,
  ModelPara,
  ORText,
  PageWrapper,
  PreviewContainer,
  SuccessBadge,
  SuccessMessage,
  SwiperWrapper,
  TakePictureContainer,
  UploadText,
} from "./VideoCall.styles";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { theme } from "../../styles/theme";
import { infoMessage, rightSuccessMessage } from "../../utils/toasters";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { Count, CounterCircle } from "../Connecting/Connecting.styles";
import AppModal from "../../components/Modal/Modal";
import {
  LeaveButtonGroup,
  LeaveContainer,
  LeaveOR,
  LeaveTitle,
} from "../../components/Modal/Modal.styles";
import {
  selectParticipantCount,
  videoCallActions,
} from "../../store/features/videoCall/videoCallSlice";
import {
  membersActions,
  selectCallType,
} from "../../store/features/members/membersSlice";
import { useGetPatientQuery } from "../../store/services/patientApi";
import { useJitsiCall } from "../../hooks/useJitsiCall";
import { getDeviceType } from "../../utils/utils";
import {
  LoaderSpinner,
  SmallSpinnerWrapper,
} from "../../components/Loader/Loader.styles";
import {
  useConcludeMeetingMutation,
  useLeaveMeetingMutation,
} from "../../store/services/invitation";
import type { EmrImageRecord } from "../../types/emr";
import {
  // useGetEmrImagesQuery,
  useUploadEmrImageMutation,
} from "../../store/services/emrApi";

export default function VideoCall() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLeavingMeetingRef = useRef(false);
  const leaveToastEventsRef = useRef(new Map<string, number>());
  const swiperRef = useRef<SwiperType | null>(null);

  const params = new URLSearchParams(window.location.search);

  const roomParam = params.get("room");
  const jwtParam = params.get("jwt");
  const moderatorParam = params.get("moderator");
  const inviteId = params.get("inviteId");

  const roomName = roomParam || userId || "DefaultRoom";

  // Only providers need patient data (for EMR upload).
  // Guests/patients must never trigger this call.
  // Also extract the full patient UUID from the room name because the route
  // param (:id) may only contain a truncated prefix (e.g. "2813ed38").
  // Room format: patient-{fullUUID}-{timestamp}  or  provider-{fullUUID}-{timestamp}
  const isProvider = moderatorParam === "true";
  const patientIdFromRoom = roomParam?.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  )?.[0];
  const patientQueryId = patientIdFromRoom || userId;

  const { data: patientData } = useGetPatientQuery(patientQueryId as string, {
    skip: !isProvider || !patientQueryId,
  });

  const videoCall = useJitsiCall(roomName, jwtParam, () => {
    handleEndCall();
  });
  const isPadAPP = getDeviceType() === "ipad-app";
  const isPadBrowser = getDeviceType() === "ipad-browser";

  const isMobile = getDeviceType() === "mobile";

  const callType = useAppSelector(selectCallType);
  const layout = useAppSelector(selectLayout);
  const participantCount = useAppSelector(selectParticipantCount);
  const activeLayout =
    isMobile && participantCount === 2 ? "grid" : layout;
  const showModel = useAppSelector(selectShowUploadModel);
  const isEndCall = useAppSelector(SelectIsEndCall);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSendingToEMR, setIsSendingToEMR] = useState<boolean>(false);
  // const [count, setCount] = useState<number>(15);
  const [showFloatingCounter, setShowFloatingCounter] =
    useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<
    { id: number; photo: string }[]
  >([]);
  const [emrFiles, setEMRFiles] = useState<EmrImageRecord[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [isAddingMore, setIsAddingMore] = useState<boolean>(false);
  const showPardonInterruptionModal = useAppSelector(
    selectShowPardonInterruptionModal,
  );
  const [concludeMeeting, { isLoading: isConcluding }] =
    useConcludeMeetingMutation();
  const [leaveMeeting, { isLoading: isLeaving }] = useLeaveMeetingMutation();
  const [uploadEmrImage] = useUploadEmrImageMutation();
  const patient =
    videoCall.remoteUsers.find((user) => user.participantType === "patient") ||
    videoCall.remoteUsers.find((user) => user.hasVideo && user.videoTrack) ||
    videoCall.remoteUsers[0];
  const patientMicOn = patient
    ? videoCall.remoteMicStatus[patient.uid] !== false
    : false;
  const patientCameraOn = patient ? patient.hasVideo : false;

  const handleMutePatientAudio = () => {
    if (callType === "provider" && patient && jitsiConferenceRef.current) {
      if (patientMicOn) {
        try {
          jitsiConferenceRef.current.muteParticipant(patient.uid, "audio");
        } catch (e) {
          console.error("Error muting patient audio from PiP:", e);
        }
      }
    }
  };

  const handleMutePatientVideo = () => {
    if (callType === "provider" && patient && jitsiConferenceRef.current) {
      if (patientCameraOn) {
        try {
          jitsiConferenceRef.current.muteParticipant(patient.uid, "video");
        } catch (e) {
          console.error("Error muting patient video from PiP:", e);
        }
      }
    }
  };

  const takePhoto = async () => {
    const capturedPhoto = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    setPhoto(capturedPhoto.dataUrl!);
  };
  const chooseFromFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleUploadImage = async () => {
    if (!photo) return;
    if (!patientData) {
      rightSuccessMessage("Patient data not available.");
      return;
    }
    setIsUploading(true);
    try {
      await uploadEmrImage({
        patientDbId: patientData.id,
        patientId: patientData.MRN,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        dob: patientData.dob,
        gender: patientData.gender,
        visitId: patientData.CBEN || patientData.id,
        fileType: "PNG",
        imageBase64: photo,
      });

      setUploadedPhotos((prev) => [...prev, { id: prev.length + 1, photo }]);
      setIsImageUploaded(true);
      setIsAddingMore(false);

      const uploadTimestamp = Date.now();
      const uploaderName = params.get("name") || "Provider";
      dispatch(
        videoCallActions.handleAddChatMessage({
          sender: uploaderName,
          text: "",
          timestamp: uploadTimestamp,
          eventType: "image-uploaded",
          isOwn: true,
        }),
      );
      try {
        jitsiConferenceRef.current?.sendMessage(
          JSON.stringify({
            teleportEvent: "image-uploaded",
            timestamp: uploadTimestamp,
          }),
        );
      } catch (eventError) {
        console.warn("Unable to share image upload event in chat:", eventError);
      }

      rightSuccessMessage("EMR file uploaded successfully.");
      loadSpacesFiles();
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
    }
  };

  const loadSpacesFiles = useCallback(async () => {
    const targetPatientId = userId as string;
    setLoadingFiles(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/emr/images?patientId=${targetPatientId}`,
      );
      const files = res.data.data.databaseRecords || [];

      setEMRFiles(files);
    } catch (err) {
      console.error("Failed to load files", err);
    } finally {
      setLoadingFiles(false);
    }
  }, [userId]);

  useEffect(() => {
    if (showModel) {
      loadSpacesFiles();
      setIsAddingMore(false);
    }
  }, [showModel, loadSpacesFiles]);

  const sendToEMR = async () => {
    if (!patientData) {
      rightSuccessMessage("Patient data not available.");
      return;
    }
    // const index = swiperRef.current?.activeIndex ?? 0;

    // const currentFile = emrFiles[index];
    // console.log(currentFile);
    // console.log(uploadedPhotos);

    setIsSendingToEMR(true);
    try {
      for (const image of uploadedPhotos) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/emr/upload-image`,
          {
            patientDbId: patientData.id,
            patientId: patientData.MRN,
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            dob: patientData.dob,
            gender: patientData.gender,
            visitId: patientData.CBEN || patientData.id,
            fileType: "PNG",
            imageBase64: image.photo,
          },
        );
      }
      rightSuccessMessage("Images sent to EMR successfully.");
    } catch (err) {
      console.error("EMR upload error", err);
      rightSuccessMessage("Failed to send images to EMR.");
    } finally {
      setIsSendingToEMR(false);
    }
  };
  const handleAddMoreImage = () => {
    setPhoto(null);
    setIsImageUploaded(false);
    setIsAddingMore(true);
  };

  const handleEndCall = async (EndForAll?: boolean) => {
    isLeavingMeetingRef.current = true;
    if (typeof videoCall?.closePip === "function") {
      videoCall.closePip();
    }

    const inviteBatchId = params.get("inviteBatchId");

    if (EndForAll && inviteBatchId) {
      try {
        // Conclude meeting on backend FIRST so all participants get the signal
        await concludeMeeting({ inviteBatchId }).unwrap();
      } catch (e) {
        console.warn("concludeMeeting API error (continuing with end)", e);
      }
      // THEN send the Jitsi command to kick everyone out
      videoCall.endMeetingForAll();
    } else {
      if (inviteId) {
        try {
          await leaveMeeting({ inviteId }).unwrap();
        } catch (e) {
          console.warn("leaveMeeting API error (continuing with leave)", e);
        }
      }
    }

    if (window._activeMediaTracks) {
      const tracksToStop = [...(window._activeMediaTracks || [])];
      window._activeMediaTracks = [];
      tracksToStop.forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Global track stop error in handleEndCall", e);
        }
      });
    }

    // Direct hardware release for camera track
    if (videoCall?.localCameraTrack) {
      try {
        videoCall.localCameraTrack.mute();

        // 0. Try Jitsi stop() directly
        if (typeof videoCall.localCameraTrack.stop === "function") {
          try {
            videoCall.localCameraTrack.stop();
          } catch (e) {
            console.warn(e);
          }
        }

        const rawTrack =
          typeof videoCall.localCameraTrack.getTrack === "function"
            ? videoCall.localCameraTrack.getTrack()
            : videoCall.localCameraTrack.track;
        if (rawTrack && typeof rawTrack.stop === "function") {
          rawTrack.stop();
        }

        const originalStream =
          typeof videoCall.localCameraTrack.getOriginalStream === "function"
            ? videoCall.localCameraTrack.getOriginalStream()
            : videoCall.localCameraTrack.stream;
        if (originalStream && typeof originalStream.getTracks === "function") {
          originalStream.getTracks().forEach((t: MediaStreamTrack) => {
            try {
              t.stop();
            } catch (e) {
              console.warn(e);
            }
          });
        }
      } catch (e) {
        console.warn("Error stopping camera track in handleEndCall", e);
      }
    }

    // Direct hardware release for microphone track
    if (videoCall?.localMicrophoneTrack) {
      try {
        videoCall.localMicrophoneTrack.mute();

        // 0. Try Jitsi stop() directly
        if (typeof videoCall.localMicrophoneTrack.stop === "function") {
          try {
            videoCall.localMicrophoneTrack.stop();
          } catch (e) {
            console.warn(e);
          }
        }

        const rawTrack =
          typeof videoCall.localMicrophoneTrack.getTrack === "function"
            ? videoCall.localMicrophoneTrack.getTrack()
            : videoCall.localMicrophoneTrack.track;
        if (rawTrack && typeof rawTrack.stop === "function") {
          rawTrack.stop();
        }

        const originalStream =
          typeof videoCall.localMicrophoneTrack.getOriginalStream === "function"
            ? videoCall.localMicrophoneTrack.getOriginalStream()
            : videoCall.localMicrophoneTrack.stream;
        if (originalStream && typeof originalStream.getTracks === "function") {
          originalStream.getTracks().forEach((t: MediaStreamTrack) => {
            try {
              t.stop();
            } catch (e) {
              console.warn(e);
            }
          });
        }
      } catch (e) {
        console.warn("Error stopping mic track in handleEndCall", e);
      }
    }

    dispatch(videoCallActions.resetState());
    dispatch(
      videoCallActions.handleJoinVideoCall({
        appId: "",
        calling: false,
        channel: "",
        token: "",
      }),
    );
    dispatch(globalActions.handleResetState());
    dispatch(membersActions.resetState());

    const isIpadView = window.deviceType === "ipad-app";

    if (isIpadView) {
      navigate(`/${userId}/family-and-friend`);
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    if (moderatorParam === "true") {
      dispatch(membersActions.setCallType("provider"));
    } else if (moderatorParam === "false") {
      dispatch(membersActions.setCallType("family"));
    }

    const inviteBatchId = params.get("inviteBatchId");
    const name = params.get("name");
    const inviteId = params.get("inviteId");
    if (inviteBatchId) {
      const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
      const presenceQuery = inviteId
        ? `&presenceInviteId=${encodeURIComponent(inviteId)}`
        : "";
      const ws = new WebSocket(
        `${wsUrl}/ws?inviteBatchId=${encodeURIComponent(inviteBatchId)}${presenceQuery}`,
      );
      ws.onopen = () => {
        if (!inviteId) return;
        ws.send(
          JSON.stringify({
            event: "guest_joined",
            guestName: name || "Guest",
            inviteId,
          }),
        );
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.event === "meeting_concluded" ||
            data.event === "meeting_ended" ||
            data.event === "end_meeting_for_all"
          ) {
            handleEndCall();
          } else if (
            (data.event === "participant_left" ||
              data.event === "participant_disconnected") &&
            data.inviteId &&
            data.inviteId !== inviteId
          ) {
            const participantStillConnected =
              jitsiConferenceRef.current?.getParticipants?.().some(
                (participant: {
                  getProperty?: (_name: string) => string | undefined;
                }) =>
                  participant.getProperty?.("teleportParticipantIdentity") ===
                  data.inviteId,
              ) ?? false;
            if (participantStillConnected) return;

            const now = Date.now();
            const lastNotification =
              leaveToastEventsRef.current.get(data.inviteId) || 0;
            if (now - lastNotification > 10_000) {
              leaveToastEventsRef.current.set(data.inviteId, now);
              infoMessage(
                `${data.guestName || "A participant"} left the meeting`,
              );
            }
          }
        } catch (e) {
          console.warn("Error parsing WebSocket message in VideoCall:", e);
        }
      };

      const heartbeat = window.setInterval(() => {
        if (inviteId && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "presence_heartbeat" }));
        }
      }, 15_000);

      const leaveMeetingPresence = () => {
        if (!inviteId) return;
        isLeavingMeetingRef.current = true;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "meeting_left" }));
        }

        const leaveUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/leave`;
        navigator.sendBeacon(
          leaveUrl,
          new Blob([JSON.stringify({ inviteId })], {
            type: "application/json",
          }),
        );
      };

      if (inviteId) {
        window.addEventListener("pagehide", leaveMeetingPresence);
      }
      return () => {
        window.clearInterval(heartbeat);
        window.removeEventListener("pagehide", leaveMeetingPresence);
        if (isLeavingMeetingRef.current && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "meeting_left" }));
        }
        ws.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moderatorParam, dispatch, window.location.search]);
  // Grace Period: If provider leaves, start a countdown and auto-conclude if they don't return (COMMENTED OUT)
  const [providerLeftCountdown /* , setProviderLeftCountdown */] = useState<
    number | null
  >(null);

  /*
  useEffect(() => {
    // Only patients/guests monitor provider presence
    if (callType === "provider") {
      setProviderLeftCountdown(null);
      return;
    }

    // Check if provider is currently in remoteUsers list
    const isProviderPresent = videoCall.remoteUsers.some(
      (u) =>
        u.name?.toLowerCase().includes("provider") ||
        u.name?.toLowerCase().includes("doctor") ||
        u.name?.toLowerCase().includes("host"),
    );

    if (isProviderPresent) {
      setProviderLeftCountdown(null);
    } else if (videoCall.isConnected && videoCall.remoteUsers.length >= 0) {
      // Provider is not in the room, start countdown if not already running
      setProviderLeftCountdown((prev) => (prev === null ? 60 : prev));
    }
  }, [callType, videoCall.remoteUsers, videoCall.isConnected]);

  // Handle countdown timer tick
  useEffect(() => {
    if (providerLeftCountdown === null) return;

    if (providerLeftCountdown <= 0) {
      handleEndCall();
      return;
    }

    const timer = setTimeout(() => {
      setProviderLeftCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [providerLeftCountdown]);
  */

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {videoCall.isTabDuplicate ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a252f",
            color: "#ffffff",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h2
            style={{ fontSize: "22px", marginBottom: "12px", color: "#ff6b6b" }}
          >
            Call Active in Another Tab
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.8)",
              maxWidth: "420px",
            }}
          >
            You are already connected to this video meeting in another browser
            tab. Please return to your existing tab to continue the call.
          </p>
        </div>
      ) : (
        <PageWrapper>
          {providerLeftCountdown !== null && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(220, 38, 38, 0.9)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "24px",
                zIndex: 1000,
                fontSize: "14px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>
                Provider disconnected. Meeting closing in{" "}
                {providerLeftCountdown}s...
              </span>
            </div>
          )}
          {activeLayout === "grid" ? (
            <GridLayout videoCall={videoCall} />
          ) : (
            <ListLayout videoCall={videoCall} />
          )}
          <AppModal
            id="uploadModel"
            isOpen={showModel}
            onClose={() => {
              dispatch(globalActions.handleShowUploadModel(false));
              setPhoto(null);
            }}
            title="Send File To EMR"
            width="680px"
            height="520px"
            background="#000000B2"
            headerIcon={uploadIcon}
            closeOnBackdropClick={false}
          >
            <ModelBody $hasPhoto={!!photo}>
              {loadingFiles ? (
                <SmallSpinnerWrapper>
                  <LoaderSpinner />
                </SmallSpinnerWrapper>
              ) : (
                <TakePictureContainer
                  $hasPhoto={!!photo}
                  gap={isPadAPP ? "20px" : "10px"}
                >
                  {/* ── Preview of just-taken/chosen photo ── */}
                  {photo && !isImageUploaded && (
                    <PreviewContainer>
                      <CapturedImage src={photo} alt="Captured" $hasMaxHeight />
                    </PreviewContainer>
                  )}

                  {/* ── After upload: show Spaces file gallery ── */}
                  {(isImageUploaded || emrFiles.length > 0) && !isAddingMore ? (
                    <>
                      {emrFiles.length > 0 ? (
                        <SwiperWrapper>
                          <Swiper
                            navigation
                            modules={[Navigation]}
                            className="emr-swiper"
                            onSwiper={(swiper) => {
                              swiperRef.current = swiper;
                            }}
                            style={{
                              width: "100%",
                              overflow: "visible",
                            }}
                          >
                            {emrFiles.map((file) => (
                              <SwiperSlide key={file.id}>
                                <PreviewContainer $isSent={file.sendToEMR}>
                                  <CapturedImage
                                    src={file.imageUrl}
                                    alt={file.fileName}
                                  />

                                  {file.sendToEMR && (
                                    <>
                                      <SuccessBadge>
                                        <img src={tickIcon} alt="Success" />
                                      </SuccessBadge>

                                      <SuccessMessage>
                                        <img src={tickIcon} alt="" />
                                        <span>
                                          File Sent to EMR Successfully
                                        </span>
                                      </SuccessMessage>
                                    </>
                                  )}
                                </PreviewContainer>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </SwiperWrapper>
                      ) : (
                        <div
                          style={{
                            color: "#646465",
                            fontSize: "14px",
                            height: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          No files uploaded yet.
                        </div>
                      )}

                      {!isPadAPP && (
                        <>
                          <Button
                            bgcolor={theme.colors.secondary}
                            hoverBg={theme.colors.primary}
                            src={sendIcon}
                            hasIcon
                            iconAfterText={true}
                            iconWidth={16}
                            iconHeight={16}
                            width="180px"
                            onClick={sendToEMR}
                            textDecoration="none"
                            isLoading={isSendingToEMR}
                          >
                            Send File to EMR
                          </Button>
                          <ORText>OR</ORText>
                        </>
                      )}
                      <Button
                        hoverBg={isPadAPP ? "#05324E" : "#EEF8FF"}
                        src={isPadAPP ? uploadIcon : uploadPrimaryIcon}
                        bgcolor={isPadAPP ? theme.colors.primary : "#EEF8FF"}
                        color={isPadAPP ? "" : theme.colors.primary}
                        border={isPadAPP ? "" : "1px solid #B1B1B1"}
                        hasIcon
                        iconWidth={16}
                        iconHeight={16}
                        width="180px"
                        onClick={handleAddMoreImage}
                        textDecoration="underline"
                      >
                        Add More Image
                      </Button>
                    </>
                  ) : photo ? (
                    <ButtonContainer>
                      <Button
                        bgcolor={theme.colors.primary}
                        hoverBg="#05324E"
                        src={uploadIcon}
                        hasIcon
                        iconWidth={16}
                        iconHeight={16}
                        width="180px"
                        onClick={handleUploadImage}
                        disabled={isUploading}
                        isLoading={isUploading}
                      >
                        {isUploading ? "Uploading…" : "Upload Image"}
                      </Button>
                      <Button
                        bgcolor={theme.colors.red}
                        hoverBg="#AD1111"
                        src={crossIcon}
                        hasIcon
                        iconWidth={16}
                        iconHeight={16}
                        width="180px"
                        onClick={takePhoto}
                      >
                        Retake Image
                      </Button>
                    </ButtonContainer>
                  ) : (
                    <>
                      {(isPadAPP || isPadBrowser || isMobile) && (
                        <Button
                          bgcolor={isPadAPP ? theme.colors.primary : "#EEF8FF"}
                          color={isPadAPP ? "" : theme.colors.primary}
                          hoverBg={isPadAPP ? "#05324E" : "#EEF8FF"}
                          src={isPadAPP ? cameraIcon : cameraPrimaryIcon}
                          hasIcon
                          iconWidth={16}
                          iconHeight={16}
                          width="220px"
                          border={isPadAPP ? "" : "1px solid #B1B1B1"}
                          onClick={takePhoto}
                          textDecoration="underline"
                        >
                          Take a picture
                        </Button>
                      )}

                      {(!isPadAPP || !isMobile) && (
                        <>
                          {(isPadAPP || isMobile || isPadBrowser) && (
                            <ORText>OR</ORText>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />

                          <Button
                            onClick={chooseFromFiles}
                            bgcolor={theme.colors.secondary}
                            hoverBg={theme.colors.primary}
                            src={uploadIcon}
                            hasIcon
                            iconWidth={16}
                            iconHeight={16}
                            width="240px"
                          >
                            Choose from Files
                          </Button>

                          <UploadText>
                            There is no image found to be shared, upload the
                            image to send to EMR
                          </UploadText>
                        </>
                      )}
                    </>
                  )}
                </TakePictureContainer>
              )}
            </ModelBody>
          </AppModal>

          <AppModal
            id="endCall"
            title="Leave Meeting"
            background="#0A0A0AC7"
            onClose={() => dispatch(globalActions.handleEndCall(false))}
            isOpen={isEndCall}
            width="500px"
            height={callType === "provider" ? "300px" : "260px"}
          >
            <ModelBody>
              <LeaveContainer>
                <LeaveTitle>
                  Are you sure you want to leave the meeting?
                </LeaveTitle>

                <LeaveButtonGroup>
                  <Button
                    bgcolor="#D42A2A"
                    hoverBg="#AD1111"
                    color="#FFFFFF"
                    border="1px solid #ffffff"
                    padding="12px 24px"
                    width="120px"
                    hasIcon
                    iconWidth={20}
                    iconHeight={10}
                    src={phoneIcon}
                    onClick={() => handleEndCall(false)}
                    isLoading={isLeaving}
                  >
                    Leave
                  </Button>
                  {callType === "provider" && (
                    <>
                      <LeaveOR className="or">Or</LeaveOR>
                      <Button
                        bgcolor="#FFEEEE"
                        hoverBg="#FFEEEE"
                        color="#D42A2A"
                        hoverBorder="2px solid #D42A2A"
                        border="1px solid #FDC6C6"
                        padding=""
                        width="140px"
                        hasIcon
                        iconWidth={26}
                        iconHeight={30}
                        src={redCrossIcon}
                        onClick={() => handleEndCall(true)}
                        isLoading={isConcluding}
                      >
                        End For All
                      </Button>
                    </>
                  )}
                </LeaveButtonGroup>
              </LeaveContainer>
            </ModelBody>
          </AppModal>

          <Modal
            id="pardonInterruptionModel"
            isOpen={showPardonInterruptionModal}
            ariaHideApp={false}
            onRequestClose={() =>
              dispatch(globalActions.handleShowPardonInterruptionModal(false))
            }
            shouldCloseOnOverlayClick={false}
            style={{
              content: {
                width: "600px",
                height: "450px",
                margin: "auto",
                background: "#0E4B71",
                borderRadius: "4px",
                padding: "0px",
                border: "none",
                zIndex: "999",
              },
              // overlay: {
              //   background: "#05324E",
              // },
            }}
          >
            <ModelHeader $isprimaryBackground={true}>
              <ModelHeaderTitle></ModelHeaderTitle>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer"
                onClick={() => {
                  dispatch(
                    globalActions.handleShowPardonInterruptionModal(false),
                  );
                  setShowFloatingCounter(true);
                }}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </ModelHeader>

            <ModalBodypardonInterruption>
              <ModelBodyTitle>!</ModelBodyTitle>
              <ModelBodySubTitle>Pardon the Interruption!</ModelBodySubTitle>
              <ModelBodyPara>
                Your Healthcare team needs to meet you
              </ModelBodyPara>

              <ModelPara>Your friends/family visit will end in....</ModelPara>
              <CounterCircle width="100px" height="100px">
                <Count size="50px">{15}</Count>
              </CounterCircle>
              <ModelPara>
                You can visit again when finish talking to your healthcare team
              </ModelPara>
            </ModalBodypardonInterruption>
          </Modal>
          {showFloatingCounter && (
            <div
              style={{
                position: "fixed",
                bottom: "80px",
                right: "20px",
                zIndex: 9999,
              }}
            >
              <CounterCircle width="100px" height="100px">
                <Count size="50px">{15}</Count>
              </CounterCircle>
            </div>
          )}
          {videoCall.pipWindow &&
            ReactDOM.createPortal(
              <div
                style={{
                  height: "100vh",
                  width: "100vw",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  background: "#0E4B71",
                  fontFamily: "Inter, sans-serif",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#0E4B71",
                    padding: "0 16px",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      background: "#052942",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {patient ? (
                      <PipRemoteUser
                        ref={(el) => videoCall.registerMainRemoteVideo(el)}
                        user={patient}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          color: "#fff",
                          fontSize: "16px",
                        }}
                      >
                        No Patient Connected
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Controls */}
                <div
                  style={{
                    height: "56px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "40px",
                    background: "#0E4B71",
                  }}
                >
                  <img
                    src={patientCameraOn ? videoOnIcon : videoOffIcon}
                    alt="camera"
                    style={{
                      width: 18,
                      height: 18,
                      cursor:
                        callType === "provider" && patientCameraOn
                          ? "pointer"
                          : "default",
                      opacity: patientCameraOn ? 1 : 0.5,
                    }}
                    onClick={handleMutePatientVideo}
                  />

                  <img
                    src={patientMicOn ? microphoneIcon : microphoneMuteIcon}
                    alt="mic"
                    style={{
                      width: 18,
                      height: 18,
                      cursor:
                        callType === "provider" && patientMicOn
                          ? "pointer"
                          : "default",
                      opacity: patientMicOn ? 1 : 0.5,
                    }}
                    onClick={handleMutePatientAudio}
                  />
                </div>
              </div>,
              videoCall.pipWindow.document.body,
            )}
        </PageWrapper>
      )}
    </div>
  );
}
