import { Navigate, useParams } from "react-router-dom";

const JoinMeeting = () => {
  const { id } = useParams<{ id: string }>();

  const queryParams = new URLSearchParams(window.location.search);
  const room = queryParams.get("room") || "";
  const inviteBatchId = queryParams.get("inviteBatchId") || "";
  const jwt =
    queryParams.get("jwt") ||
    (() => {
      const meetingUrl = queryParams.get("meetingUrl") || "";
      return meetingUrl.match(/[?&]jwt=([^&]+)/)?.[1] || "";
    })();
  const finalRoomName =
    room || `umms-visit-${Math.random().toString(36).substring(2, 11)}`;
  const callUrl = `/${id || "5080483241"}/video-call?room=${encodeURIComponent(finalRoomName)}&moderator=true&participantType=provider&inviteBatchId=${encodeURIComponent(inviteBatchId)}&jwt=${encodeURIComponent(jwt)}`;
  const waitingRoomUrl = `/invite/accept?inviteBatchId=${encodeURIComponent(inviteBatchId || "provider-batch")}&role=provider&room=${encodeURIComponent(finalRoomName)}&meetingUrl=${encodeURIComponent(callUrl)}`;

  return <Navigate to={waitingRoomUrl} replace />;
};

export default JoinMeeting;
