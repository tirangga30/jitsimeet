import { useEffect, useMemo, useRef, useState } from "react";
import {
  InviteAcceptContainer,
  ContentCard,
  BrandLogo,
  PageTitle,
  TimerCard,
  DigitalClock,
  DoctorIllustration,
  StatusMessage,
  SmsReminderButton,
  InfoDivider,
  InfoList,
  InfoRow,
  InfoIconCircle,
  ErrorStateWrapper,
  ErrorHeading,
  ErrorDescription,
  HomeButton,
} from "./InviteAccept.styles";
import logo from "../../assets/img/logo.png";
import waitingIcon from "../../assets/img/waiting-icon.png";
import PageDecorations from "../../components/PageDecorations/PageDecorations";
import { UnableToJoinIllustration } from "../../components/Illustrations/StatusIllustrations";
import DevicePreview from "../../components/DevicePreview/DevicePreview";
import { MobileJoinMeeting } from "../JoinMeeting/MobileJoinMeeting";
import { useDevice } from "../../hooks/useDevice";
import { LoaderSpinner } from "../../components/Loader/Loader.styles";

const REMINDER_DELAY_MS = 3 * 60 * 1000;
const PROVIDER_NUDGE_DELAY_MS = 3 * 60 * 1000;

export default function InviteAccept() {
  const { isMobile } = useDevice();

  const [meetingUrl, setMeetingUrl] = useState<string>();
  const [isDoctorJoined, setIsDoctorJoined] = useState<boolean>(false);
  const [inviteBatchId, setInviteBatchId] = useState<string>("");
  const [inviteeName, setInviteeName] = useState<string>("");
  const [inviteeType, setInviteeType] = useState<string>("family");
  const [roomId, setRoomId] = useState("");
  const reminderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showNudgeButton, setShowNudgeButton] = useState(true); // available in waiting room
  const [nudgeSending, setNudgeSending] = useState(false);
  const [nudgeSentCount, setNudgeSentCount] = useState<number | null>(null);

  const TOTAL_TIME = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isJoiningMeeting, setIsJoiningMeeting] = useState<boolean>(false);
  const [hasJoinedPreview, setHasJoinedPreview] = useState<boolean>(false);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [cameraDeviceId, setCameraDeviceId] = useState<string>("");
  const [micDeviceId, setMicDeviceId] = useState<string>("");
  const pendingGuestWaitingRef = useRef<{
    inviteBatchId: string;
    inviteeName: string;
    inviteId: string;
  } | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const { role, inviteBatchIdParam, roomParam, meetingUrlParam } =
    useMemo(() => {
      const params = new URLSearchParams(window.location.search);
      return {
        role: params.get("role"),
        inviteBatchIdParam: params.get("inviteBatchId"),
        roomParam: params.get("room"),
        meetingUrlParam: params.get("meetingUrl"),
      };
    }, []);

  const inviteId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("inviteId");
  }, []);

  const showPreview = isDoctorJoined && !hasJoinedPreview;

  useEffect(() => {
    if (role === "provider" && inviteBatchIdParam) {
      setInviteBatchId(inviteBatchIdParam);
      setRoomId(roomParam || "");
      setMeetingUrl(meetingUrlParam || "");
      setInviteeName("Provider / Doctor");
      setIsChecking(false);
    }
  }, [role, inviteBatchIdParam, roomParam, meetingUrlParam]);

  useEffect(() => {
    if (role !== "provider" || !inviteBatchId || isDoctorJoined) return;

    const timer = setTimeout(() => {
      setShowNudgeButton(true);
    }, PROVIDER_NUDGE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [role, inviteBatchId, isDoctorJoined]);

  useEffect(() => {
    if (!inviteBatchId) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [inviteBatchId]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!inviteBatchId) return;

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(`${wsUrl}/ws?inviteBatchId=${inviteBatchId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (role === "provider") {
        ws.send(JSON.stringify({ event: "doctor_joined" }));
        setIsDoctorJoined(true);
      } else if (pendingGuestWaitingRef.current) {
        const { inviteeName: gName, inviteId: iId } = pendingGuestWaitingRef.current;
        ws.send(
          JSON.stringify({
            event: "guest_waiting",
            guestName: gName,
            inviteId: iId,
          }),
        );
        pendingGuestWaitingRef.current = null;
      }
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (role === "provider") {
        if (data.event === "guest_waiting" || data.event === "guest_joined") {
          ws.send(JSON.stringify({ event: "doctor_joined" }));
        }
      } else if (data.event === "doctor_joined") {
        setIsDoctorJoined(true);
        if (reminderTimerRef.current) {
          clearTimeout(reminderTimerRef.current);
          reminderTimerRef.current = null;
        }
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [inviteBatchId, role]);

  useEffect(() => {
    if (role === "provider" || !inviteBatchId || isDoctorJoined) return;

    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
    }

    reminderTimerRef.current = setTimeout(async () => {
      if (isDoctorJoined) return;

      try {
        await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/waiting-room-reminder`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              inviteBatchId,
              guestName: inviteeName || "Guest",
            }),
          },
        );
      } catch {
        // Silently ignore
      }
    }, REMINDER_DELAY_MS);

    return () => {
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
    };
  }, [inviteBatchId, isDoctorJoined, inviteeName, role]);

  useEffect(() => {
    if (isDoctorJoined && meetingUrl && hasJoinedPreview) {
      if (meetingUrl.includes("/video-call")) {
        const separator = meetingUrl.includes("?") ? "&" : "?";
        const cameraDeviceParam = cameraDeviceId
          ? `&cameraDeviceId=${encodeURIComponent(cameraDeviceId)}`
          : "";
        const micDeviceParam = micDeviceId
          ? `&micDeviceId=${encodeURIComponent(micDeviceId)}`
          : "";
        const finalUrl = `${meetingUrl}${separator}cameraOn=${videoEnabled}&micOn=${micEnabled}${cameraDeviceParam}${micDeviceParam}`;
        window.location.replace(
          `${finalUrl}&participantType=${encodeURIComponent(
            role === "provider" ? "provider" : inviteeType,
          )}`,
        );
        return;
      }

      let redirectUrl = meetingUrl;
      try {
        const urlObj = meetingUrl.startsWith("http")
          ? new URL(meetingUrl)
          : new URL("https://" + meetingUrl);
        const roomVal = urlObj.pathname.replace(/^\//, "");
        const jwtVal = urlObj.searchParams.get("jwt") || "";
        const inviteBatchIdVal =
          urlObj.searchParams.get("inviteBatchId") || inviteBatchId || "";
        const nameVal = urlObj.searchParams.get("name") || inviteeName || "";
        const inviteIdVal =
          urlObj.searchParams.get("inviteId") || inviteId || "";
        const moderatorVal =
          urlObj.searchParams.get("moderator") ||
          (role === "provider" ? "true" : "false");
        const cameraOnVal = String(videoEnabled);
        const micOnVal = String(micEnabled);

        const patientId = (() => {
          if (roomVal) {
            const parts = roomVal.split("-");
            if (parts[0] === "patient" && parts[1]) {
              return parts[1];
            }
          }
          return "5080483241";
        })();

        const cameraDeviceParam = cameraDeviceId
          ? `&cameraDeviceId=${encodeURIComponent(cameraDeviceId)}`
          : "";
        const micDeviceParam = micDeviceId
          ? `&micDeviceId=${encodeURIComponent(micDeviceId)}`
          : "";
        redirectUrl = `/${patientId}/video-call?room=${roomVal}&jwt=${jwtVal}&inviteBatchId=${inviteBatchIdVal}&name=${encodeURIComponent(nameVal)}&inviteId=${inviteIdVal}&moderator=${moderatorVal}&participantType=${encodeURIComponent(
          role === "provider" ? "provider" : inviteeType,
        )}&cameraOn=${cameraOnVal}&micOn=${micOnVal}${cameraDeviceParam}${micDeviceParam}`;
      } catch (e) {
        console.error("Failed to construct wrap video call url", e);
      }

      window.location.replace(redirectUrl);
    }
  }, [
    meetingUrl,
    isDoctorJoined,
    inviteBatchId,
    inviteeName,
    inviteId,
    role,
    hasJoinedPreview,
    videoEnabled,
    micEnabled,
    cameraDeviceId,
    micDeviceId,
    inviteeType,
  ]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (role === "provider" || !inviteId) {
      if (!inviteId && role !== "provider") {
        setErrorMsg("Missing inviteId parameter in URL.");
        setIsChecking(false);
      }
      return;
    }

    const acceptInvite = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/accept`;

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteId }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          setErrorMsg(`Failed to verify invitation. (${errText || res.statusText})`);
          return;
        }

        const data = await res.json();

        if (
          data.status === "concluded" ||
          data.status === "expired" ||
          !data?.meetingUrl
        ) {
          setErrorMsg(`Invitation is ${data.status || "invalid"} or missing meeting URL.`);
          return;
        }

        setRoomId(data.roomId);
        setInviteBatchId(data.inviteBatchId);
        setInviteeName(data.inviteeName || "Guest");
        const matchingInvitee = [
          ...(Array.isArray(data.participants) ? data.participants : []),
          ...(Array.isArray(data.invitees) ? data.invitees : []),
        ].find(
          (participant: { inviteId?: string }) =>
            participant.inviteId === inviteId,
        );
        setInviteeType(
          data.inviteeType ||
            data.type ||
            data.participant?.type ||
            matchingInvitee?.type ||
            "family",
        );
        setMeetingUrl(data.meetingUrl);

        if (data.inviteBatchId) {
          pendingGuestWaitingRef.current = {
            inviteBatchId: data.inviteBatchId,
            inviteeName: data.inviteeName || "Guest",
            inviteId: inviteId || "",
          };
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setErrorMsg(`Network error connecting to backend: ${errMsg}`);
      } finally {
        setIsChecking(false);
      }
    };

    acceptInvite();
  }, [inviteId, role]);

  const handleNudgeGuests = async () => {
    if (!inviteBatchId || nudgeSending) return;
    setNudgeSending(true);
    setNudgeSentCount(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/nudge-guests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteBatchId }),
        },
      );
      const data = await res.json();
      setNudgeSentCount(data.sentCount ?? 0);
    } catch {
      setNudgeSentCount(0);
    } finally {
      setNudgeSending(false);
    }
  };

  const handleGuestJoin = async ({
    videoEnabled: camOn,
    micEnabled: micOn,
    cameraDeviceId: camDeviceId,
    micDeviceId: micDevId,
  }: {
    videoEnabled: boolean;
    micEnabled: boolean;
    cameraDeviceId?: string;
    micDeviceId?: string;
  }) => {
    setIsJoiningMeeting(true);
    setVideoEnabled(camOn);
    setMicEnabled(micOn);
    setCameraDeviceId(camDeviceId || "");
    setMicDeviceId(micDevId || "");
    setHasJoinedPreview(true);
  };

  return (
    <InviteAcceptContainer>
      <PageDecorations />

      {errorMsg ? (
        <ErrorStateWrapper>
          <BrandLogo src={logo} alt="UMMS Teleport" />
          <UnableToJoinIllustration size={220} />
          <ErrorHeading>Unable to Join Meeting</ErrorHeading>
          <ErrorDescription>{errorMsg}</ErrorDescription>
          <HomeButton type="button" onClick={() => window.location.replace("/")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go to Home
          </HomeButton>
        </ErrorStateWrapper>
      ) : isChecking || isJoiningMeeting ? (
        <ContentCard>
          <BrandLogo src={logo} alt="UMMS Teleport" />
          <LoaderSpinner
            style={{
              borderTopColor: "#009F95",
              width: 52,
              height: 52,
              borderWidth: 5,
              margin: "24px 0 16px 0",
            }}
          />
          <p style={{ color: "#667A9B", fontSize: 16, fontWeight: 500 }}>
            {isJoiningMeeting ? "Joining your meeting…" : "Verifying your invite link…"}
          </p>
        </ContentCard>
      ) : showPreview ? (
        isMobile ? (
          <MobileJoinMeeting
            heading="Join the meeting as"
            patientName={inviteeName || "Guest"}
            buttonLabel="Join Meeting"
            onJoin={handleGuestJoin}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <BrandLogo src={logo} alt="UMMS Teleport" />
            <DevicePreview
              heading={`Join the meeting as ${inviteeName || "Guest"}`}
              buttonLabel="Join Meeting"
              onJoin={handleGuestJoin}
            />
          </div>
        )
      ) : (
        /* Waiting Room Layout */
        <ContentCard>
          <BrandLogo src={logo} alt="UMMS Teleport" />

          <PageTitle>WAITING ROOM</PageTitle>

          <TimerCard $isMobile={isMobile}>
            <DigitalClock>{formatTime(timeLeft)}</DigitalClock>
            {!isMobile && (
              <DoctorIllustration src={waitingIcon} alt="Healthcare provider at desk" />
            )}
          </TimerCard>

          <StatusMessage>
            {role === "provider" ? (
              <>
                Waiting for patients or family members to join. <b>Please wait...</b>
              </>
            ) : (
              <>
                The provider has not yet joined. <b>Please wait...</b>
              </>
            )}
          </StatusMessage>

          {showNudgeButton && (
            <div style={{ width: "100%", marginBottom: "8px" }}>
              <SmsReminderButton
                type="button"
                onClick={handleNudgeGuests}
                disabled={nudgeSending}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {nudgeSending ? "Sending SMS reminders…" : "Send SMS Reminder to Guests"}
              </SmsReminderButton>
              {nudgeSentCount !== null && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "8px",
                    fontSize: "13px",
                    color: nudgeSentCount > 0 ? "#009F95" : "#EF4444",
                    fontWeight: 600,
                  }}
                >
                  {nudgeSentCount > 0
                    ? `✓ SMS sent to ${nudgeSentCount} pending guest${nudgeSentCount > 1 ? "s" : ""}`
                    : "No pending guests to notify"}
                </p>
              )}
            </div>
          )}

          <InfoDivider />

          <InfoList>
            <InfoRow>
              <InfoIconCircle>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </InfoIconCircle>
              <span>Room ID : </span>
              <span className="val">{roomId || "demo-room"}</span>
            </InfoRow>

            <InfoRow>
              <InfoIconCircle>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </InfoIconCircle>
              <span>Role : </span>
              <span className="val">
                {role === "provider"
                  ? "Provider / Doctor"
                  : `Guest : ${inviteeName || "Family / Friend"}`}
              </span>
            </InfoRow>
          </InfoList>
        </ContentCard>
      )}
    </InviteAcceptContainer>
  );
}
