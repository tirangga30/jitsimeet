import { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Footer,
  Heading,
  Illustration,
  InviteAcceptContainer,
  Logo,
  Message,
  TimerBox,
  TimerText,
} from "./InviteAccept.styles";
import logo from "../../assets/img/newlogo.png";
import waitingIcon from "../../assets/img/waiting-icon.png";
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
  const [showNudgeButton, setShowNudgeButton] = useState(false);
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

  // Guests wait first. Device preview is only available after the provider
  // announces that they have joined the waiting room.
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

  //Show nudge button after 3 min (provider only)
  useEffect(() => {
    if (role !== "provider" || !inviteBatchId || isDoctorJoined) return;

    const timer = setTimeout(() => {
      setShowNudgeButton(true);
    }, PROVIDER_NUDGE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [role, inviteBatchId, isDoctorJoined]);

  // Countdown starts as soon as either role enters the waiting-room flow.
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

  // WebSocket: listen for events
  useEffect(() => {
    if (!inviteBatchId) return;

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(`${wsUrl}/ws?inviteBatchId=${inviteBatchId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.warn("WS connected to waiting room");
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
      console.warn("WS received:", data);

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

      // Patient/guardian gating is currently disabled. Enabling this would
      // keep everyone waiting until the backend emits `meeting_ready`.
      // if (data.event === "meeting_ready") {
      //   setIsDoctorJoined(true);
      // }
    };

    ws.onclose = () => {
      console.warn("WS closed");
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [inviteBatchId, role]);

  //Schedule 3-minute reminder once inviteBatchId is known
  useEffect(() => {
    if (role === "provider" || !inviteBatchId || isDoctorJoined) return;

    // Clear any existing timer before scheduling a new one
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
    }

    reminderTimerRef.current = setTimeout(async () => {
      // Double-check: if doctor already joined by now, skip
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
        // Silently ignore — reminder is best-effort
      }
    }, REMINDER_DELAY_MS);

    return () => {
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
    };
  }, [inviteBatchId, isDoctorJoined, inviteeName, role]);

  // Redirect to the video call after the provider is ready and device preview
  // has been completed.
  useEffect(() => {
    if (
      isDoctorJoined &&
      meetingUrl &&
      hasJoinedPreview
    ) {
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
        console.error(
          "Failed to construct wrap video call url, falling back",
          e,
        );
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

  //Accept the invite on mount
  useEffect(() => {
    if (role === "provider" || !inviteId) {
      console.warn("[InviteAccept] Skipped accept call:", { role, inviteId });
      if (!inviteId && role !== "provider") {
        setErrorMsg("Missing inviteId parameter in URL.");
        setIsChecking(false);
      }
      return;
    }

    const acceptInvite = async () => {
      console.warn("[InviteAccept] Fetching accept API for inviteId:", inviteId);
      console.warn("[InviteAccept] Backend URL:", import.meta.env.VITE_BACKEND_BASE_URL);
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/invitations/accept`;
        console.warn("[InviteAccept] Full Request URL:", apiUrl);

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteId }),
        });

        console.warn("[InviteAccept] Response Status:", res.status, res.statusText);

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.error("[InviteAccept] Accept API returned non-200:", res.status, errText);
          setErrorMsg(`Failed to verify invitation. Server status: ${res.status} (${errText || res.statusText})`);
          return;
        }

        const data = await res.json();
        console.warn("[InviteAccept] Accept API Response Data:", data);

        if (
          data.status === "concluded" ||
          data.status === "expired" ||
          !data?.meetingUrl
        ) {
          console.warn("[InviteAccept] Invalid meeting status or missing meetingUrl:", data);
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

        // Opening an invite places the guest in the waiting room immediately.
        // The WebSocket sends this as soon as its connection is ready.
        if (data.inviteBatchId) {
          pendingGuestWaitingRef.current = {
            inviteBatchId: data.inviteBatchId,
            inviteeName: data.inviteeName || "Guest",
            inviteId: inviteId || "",
          };
        }
      } catch (err: unknown) {
        console.error("[InviteAccept] Accept API Fetch Error:", err);
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
    // Keep a dedicated transition screen visible while the redirect effect
    // builds the final meeting URL and navigates away.
    setIsJoiningMeeting(true);
    setVideoEnabled(camOn);
    setMicEnabled(micOn);
    setCameraDeviceId(camDeviceId || "");
    setMicDeviceId(micDevId || "");

    setHasJoinedPreview(true);
  };

  return (
    <InviteAcceptContainer>
      {errorMsg ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            height: "100vh",
            padding: "24px",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <img src={logo} alt="UMMS Teleport" style={{ width: 180, marginBottom: 8 }} />
          <div
            style={{
              background: "rgba(255, 77, 79, 0.15)",
              border: "1px solid #ff4d4f",
              borderRadius: "12px",
              padding: "20px 24px",
              maxWidth: "420px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#ff7875", fontSize: "18px" }}>
              Unable to Join Meeting
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255, 255, 255, 0.85)", wordBreak: "break-word" }}>
              {errorMsg}
            </p>
          </div>
          <button
            onClick={() => window.location.replace("/")}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "#027564",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Go to Home
          </button>
        </div>
      ) : isChecking || isJoiningMeeting ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            height: "100vh",
          }}
        >
          <img
            src={logo}
            alt="UMMS Teleport"
            style={{ width: 200, marginBottom: 12 }}
          />
          <LoaderSpinner
            style={{
              borderTopColor: "#ffffff",
              width: 48,
              height: 48,
              borderWidth: 5,
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 15,
              marginTop: 8,
            }}
          >
            {isJoiningMeeting
              ? "Joining your meeting…"
              : "Verifying your invite link…"}
          </p>
        </div>
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
            }}
          >
            <Logo src={logo} alt="logo" />
            <DevicePreview
              heading={`Join the meeting as ${inviteeName || "Guest"}`}
              buttonLabel="Join Meeting"
              onJoin={handleGuestJoin}
            />
          </div>
        )
      ) : (
        <Card>
          <Logo src={logo} />

          <Heading>WAITING ROOM</Heading>

          <TimerBox isMobile={isMobile}>
            <TimerText>{formatTime(timeLeft)}</TimerText>
            {!isMobile && <Illustration src={waitingIcon} />}
          </TimerBox>

          <Message>
            {role === "provider" ? (
              <>
                Waiting for patients or family members to join.{' '}
                <b>Please wait....</b>
              </>
            ) : (
              <>
                The provider has not yet joined. <b>Please wait....</b>
              </>
            )}
          </Message>

          {role === "provider" && showNudgeButton && (
            <div style={{ width: "100%", marginBottom: "16px" }}>
              <button
                onClick={handleNudgeGuests}
                disabled={nudgeSending}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  background: nudgeSending ? "#6b8fa3" : "#027564",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: nudgeSending ? "not-allowed" : "pointer",
                  letterSpacing: "0.3px",
                  transition: "all 0.25s ease",
                  boxShadow: nudgeSending
                    ? "none"
                    : "0 4px 14px rgba(2, 117, 100, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {nudgeSending ? (
                  <>⏳ Sending SMS reminders…</>
                ) : (
                  <>📩 Send SMS Reminder to Guests</>
                )}
              </button>
              {nudgeSentCount !== null && (
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontSize: "13px",
                    color: nudgeSentCount > 0 ? "#7de8c8" : "#f9a8a8",
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

          <Footer $isMobile={isMobile}>
            <p>Room ID : {roomId}</p>
            <p>
              {role === "provider"
                ? "Role : Provider / Doctor"
                : `Guest Name : ${inviteeName || "SM UMMS Email"}`}
            </p>
          </Footer>
        </Card>
      )}
    </InviteAcceptContainer>
  );
}
