import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Nav,
  Logo,
  Version,
  MenuBar,
  MenuItem,
  MenuIcon,
  MenuLabel,
  NavCenter,
  NavTimerLabel,
  NavTimerValue,
  Badge,
} from "./Navbar.styles";
import logo from "../../assets/img/newlogo.png";
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
} from "../../store/features/videoCall/videoCallSlice";
import { selectCallType } from "../../store/features/members/membersSlice";
import { getDeviceType } from "../../utils/utils";

const DesktopNav = () => {
  const layout = useAppSelector(selectLayout);
  const panel = useAppSelector(selectpanel);
  const callType = useAppSelector(selectCallType);
  const meetingDuration = useAppSelector(selectMeetingDuration);
  const chatMessages = useAppSelector(selectChatMessages);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isPadApp = getDeviceType() === "ipad-app";

  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessagesCount = useRef(chatMessages.length);
  const mountTimeRef = useRef(Date.now());

  const handleShowPanel = useCallback(
    (currentPanel: "participants" | "none" | "chat" | "more") => {
      const newPanel = panel === currentPanel ? "none" : currentPanel;
      dispatch(globalActions.handleShowPanel(newPanel));
      dispatch(globalActions.handleVideolayout("list"));
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
    const changelayout = layout === "grid" ? "list" : "grid";
    dispatch(globalActions.handleVideolayout(changelayout));
    dispatch(globalActions.handleShowPanel("none"));
  };

  return (
    <Nav>
      <Logo src={logo} />

      {currentRoute === "video-call" && callType === "provider" && (
        <NavCenter>
          <NavTimerLabel>My Time</NavTimerLabel>
          <NavTimerValue>{meetingDuration}</NavTimerValue>
        </NavCenter>
      )}

      {currentRoute === "video-call" ? (
        <MenuBar>
          {/* Participants */}
          <MenuItem
            $active={panel === "participants"}
            onClick={() => handleShowPanel("participants")}
          >
            <MenuIcon
              src={participantIcon}
              alt="participant"
              width={26}
              height={18}
            />
            <MenuLabel>Participants</MenuLabel>
          </MenuItem>

          {/* Chat */}
          <MenuItem
            $active={panel === "chat"}
            onClick={() => handleShowPanel("chat")}
          >
            <div style={{ position: "relative", display: "inline-flex" }}>
              <MenuIcon src={chatIcon} alt="chat" width={22} height={20} />
              {unreadCount > 0 && (
                <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
              )}
            </div>
            <MenuLabel>Chats</MenuLabel>
          </MenuItem>

          {/* Desktop layout switching is always available. */}
          <MenuItem onClick={handleLayout} title="Change layout">
            <MenuIcon src={layoutIcon} alt="layout" width={20} height={20} />
            <MenuLabel>Layout</MenuLabel>
          </MenuItem>

          {/* EMR / Upload — provider only */}
          {callType === "provider" && (
            <MenuItem
              onClick={() => dispatch(globalActions.handleShowUploadModel(true))}
            >
              <MenuIcon src={uploadIcon} alt="upload" width={21} height={20} />
              <MenuLabel>{isPadApp ? "Upload" : "EMR"}</MenuLabel>
            </MenuItem>
          )}

          {/* More — desktop only */}
          {!isPadApp && (
            <MenuItem
              $active={panel === "more"}
              onClick={() => handleShowPanel("more")}
            >
              <MenuIcon src={moreIcon} alt="more" width={28} height={20} />
              <MenuLabel>More</MenuLabel>
            </MenuItem>
          )}
        </MenuBar>
      ) : (
        <Version>Version: 1.00</Version>
      )}
    </Nav>
  );
};

export default DesktopNav;
