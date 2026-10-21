import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Logo, Badge, Version } from "./Navbar.styles";
import logo from "../../assets/icons/Teleport Logo 1.png";
import participantIcon from "../../assets/icons/participants.png";
import chatIcon from "../../assets/icons/chat.png";
import uploadIcon from "../../assets/icons/upload.png";
import layoutIcon from "../../assets/icons/layout.png";
import moreIcon from "../../assets/icons/white/more.png";

import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  globalActions,
  selectLayout,
  selectpanel,
} from "../../store/features/global/globalSlice";
import {
  selectMeetingDuration,
  selectChatMessages,
  selectParticipantCount,
} from "../../store/features/videoCall/videoCallSlice";
import { selectCallType } from "../../store/features/members/membersSlice";

const MobileNav = () => {
  const layout = useAppSelector(selectLayout);
  const panel = useAppSelector(selectpanel);
  const callType = useAppSelector(selectCallType);
  const meetingDuration = useAppSelector(selectMeetingDuration);
  const chatMessages = useAppSelector(selectChatMessages);
  const participantCount = useAppSelector(selectParticipantCount);
  const canChangeLayout = participantCount !== 2;
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessagesCount = useRef(chatMessages.length);
  const mountTimeRef = useRef(Date.now());

  const handleShowPanel = useCallback(
    (currentPanel: "participants" | "none" | "chat" | "more") => {
      const newPanel = panel === currentPanel ? "none" : currentPanel;
      dispatch(globalActions.handleShowPanel(newPanel));
    },
    [dispatch, panel],
  );

  useEffect(() => {
    if (panel === "chat") {
      setUnreadCount(0);
    }
  }, [panel]);

  useEffect(() => {
    if (chatMessages.length > prevMessagesCount.current) {
      const newMessages = chatMessages.slice(prevMessagesCount.current);
      if (panel !== "chat") {
        const remoteNewMsgs = newMessages.filter(
          (msg) =>
            !msg.isOwn &&
            msg.sender !== "You" &&
            msg.timestamp > mountTimeRef.current,
        );
        if (remoteNewMsgs.length > 0) {
          setUnreadCount((prev) => prev + remoteNewMsgs.length);
        }
      }

      const lastMsg = chatMessages[chatMessages.length - 1];

      if (
        panel !== "chat" &&
        !lastMsg.isOwn &&
        lastMsg.sender !== "You" &&
        lastMsg.timestamp > mountTimeRef.current
      ) {
        toast(
          (t) => (
            <div
              onClick={() => {
                handleShowPanel("chat");
                toast.dismiss(t.id);
              }}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "13px",
                  marginBottom: "3px",
                }}
              >
                💬 {lastMsg.sender}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.85,
                  maxWidth: "220px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {lastMsg.eventType === "image-uploaded"
                  ? "Image uploaded"
                  : lastMsg.text}
              </div>
            </div>
          ),
          {
            duration: 5000,
            position: "top-center",
            style: {
              background: "#027564",
              color: "#fff",
              borderRadius: "10px",
              padding: "10px 14px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            },
          },
        );
      }
    }
    prevMessagesCount.current = chatMessages.length;
  }, [chatMessages, panel, dispatch, handleShowPanel]);

  const routes = location.pathname.split("/");
  const currentRoute = routes[routes.length - 1];

  const handleLayout = () => {
    if (!canChangeLayout) return;

    const changelayout = layout === "grid" ? "list" : "grid";
    dispatch(globalActions.handleVideolayout(changelayout));
    dispatch(globalActions.handleShowPanel("none"));
  };

  return (
    <nav
      style={{
        background: "#062942",
        display: "flex",
        flexDirection: "column",
        padding: "12px 18px 16px 18px",
        gap: "14px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Row 1: Logo (Left) and My Time counter (Right) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Logo src={logo} style={{ height: "36px", objectFit: "contain" }} />

        {currentRoute === "video-call" && callType === "provider" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "14px",
                color: "#ffffff",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              My Time
            </span>
            <span
              style={{
                fontSize: "15px",
                color: "#ffffff",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {meetingDuration}
            </span>
          </div>
        )}
      </div>

      {currentRoute === "video-call" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "4px",
          }}
        >
          {/* Participants */}
          <div
            onClick={() => handleShowPanel("participants")}
            style={{
              cursor: "pointer",
              opacity: panel === "participants" ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={participantIcon}
              alt="participant"
              style={{ width: "26px", height: "18px", objectFit: "contain" }}
            />
          </div>

          {/* Chat */}
          <div
            onClick={() => handleShowPanel("chat")}
            style={{
              cursor: "pointer",
              opacity: panel === "chat" ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={chatIcon}
              alt="chat"
              style={{ width: "22px", height: "20px", objectFit: "contain" }}
            />
            {unreadCount > 0 && (
              <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
            )}
          </div>

          {/* On mobile, the two-user layout remains locked to the grid. */}
          <div
            onClick={handleLayout}
            aria-disabled={!canChangeLayout}
            title={
              canChangeLayout
                ? "Change layout"
                : "Grid layout is fixed for two users on mobile"
            }
            style={{
              cursor: canChangeLayout ? "pointer" : "not-allowed",
              opacity: canChangeLayout ? 1 : 0.45,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={layoutIcon}
              alt="layout"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* EMR / Upload — provider only */}
          {callType === "provider" && (
            <div
              onClick={() => {
                dispatch(globalActions.handleShowUploadModel(true));
                dispatch(globalActions.handleShowPanel("none"));
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={uploadIcon}
                alt="upload"
                style={{ width: "21px", height: "20px", objectFit: "contain" }}
              />
            </div>
          )}

          {/* More */}
          <div
            onClick={() => handleShowPanel("more")}
            style={{
              cursor: "pointer",
              opacity: panel === "more" ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={moreIcon}
              alt="more"
              style={{ width: "28px", height: "20px", objectFit: "contain" }}
            />
          </div>
        </div>
      ) : (
        <Version>Version: 1.00</Version>
      )}
    </nav>
  );
};

export default MobileNav;
