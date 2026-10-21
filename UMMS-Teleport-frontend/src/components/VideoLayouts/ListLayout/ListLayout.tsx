import microphoneIcon from "../../../assets/icons/Microphone.png";
import microphoneUmuteIcon from "../../../assets/icons/Unmute.png";
import pictureToPictureIcon from "../../../assets/icons/white/laptop-picture.png";
import expandIcon from "../../../assets/icons/white/Expand.png";
import fullPageViewIcon from "../../../assets/icons/white/Full Page View.png";
import { useEffect, useRef, useState } from "react";

import { type VideoCallState } from "../../../hooks/useJitsiCall";

import {
  selectShowPardonInterruptionModal,
  selectShowUploadModel,
} from "../../../store/features/global/globalSlice";
import { useAppSelector } from "../../../store/hooks";
import { formatUsername } from "../../../utils/utils";

import {
  LeftPanel,
  ListScrollHintButton,
  MainStage,
  MainVideoBox,
  MainVideoInfo,
  MicrophoneIcon,
  RightPanel,
  UserVideoInfo,
  VideoBox,
  VideoContanier,
  VideoInfo,
} from "./ListLayout.styles";
import { UserAvatarOverlay } from "../../AvtarOverlay/AvtarOverlay";
import { LocalUser } from "../LocalUser";
import { RemoteUser } from "../RemoteUser";
import { hasVisibleRemoteVideo } from "../remoteVideo";
import {
  FullscreenButton,
  LayoutButton,
  ReturnToGridButton,
} from "../GridLayout/GridLayout.styles";
import { selectCallType } from "../../../store/features/members/membersSlice";
import { useDevice } from "../../../hooks/useDevice";

interface ListLayoutProps {
  videoCall: VideoCallState;
}

export const ListLayout = ({ videoCall }: ListLayoutProps) => {
  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const participantListRef = useRef<HTMLDivElement>(null);
  const [hasParticipantListOverflow, setHasParticipantListOverflow] =
    useState(false);
  const [selectedRemoteUid, setSelectedRemoteUid] = useState<string | null>(
    null,
  );
  const [isAtScrollBottom, setIsAtScrollBottom] = useState(false);
  const [isLocalExpanded, setIsLocalExpanded] = useState(false);
  const showModel = useAppSelector(selectShowUploadModel);
  const showPardonInterruptionModal = useAppSelector(
    selectShowPardonInterruptionModal,
  );
  const callType = useAppSelector(selectCallType);
  const { isMobile } = useDevice();
  const expandedViewIcon = isMobile ? expandIcon : fullPageViewIcon;
  const isLocalPatient =
    new URLSearchParams(window.location.search).get("participantType") ===
    "patient";

  const {
    remoteUsers,
    localCameraTrack,
    micOn,
    cameraOn,
    isScreenSharing,
    remoteMicStatus,
  } = videoCall;
  const totalUserCount = remoteUsers.length + 1;
  const selectedRemoteUser = selectedRemoteUid
    ? remoteUsers.find((user) => String(user.uid) === selectedRemoteUid)
    : undefined;
  const isExpanded = isLocalExpanded || Boolean(selectedRemoteUser);

  useEffect(() => {
    const list = participantListRef.current;
    if (!list || isExpanded) {
      setHasParticipantListOverflow(false);
      return;
    }

    const updateOverflow = () => {
      setHasParticipantListOverflow(
        list.scrollHeight > list.clientHeight + 1,
      );
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(list);
    window.addEventListener("resize", updateOverflow);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [isExpanded, remoteUsers.length]);

  const scrollToMoreUsers = () => {
    const panelElement = scrollPanelRef.current;
    if (!panelElement) return;

    if (isAtScrollBottom) {
      panelElement.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    panelElement.scrollBy({
      top: panelElement.clientHeight * 0.75,
      behavior: "smooth",
    });
  };

  const updateScrollDirection = () => {
    const panelElement = scrollPanelRef.current;
    if (!panelElement) return;

    const remainingScroll =
      panelElement.scrollHeight -
      panelElement.clientHeight -
      panelElement.scrollTop;
    setIsAtScrollBottom(remainingScroll <= 4);
  };

  return (
    <MainStage
      ref={scrollPanelRef}
      $tileCount={totalUserCount}
      $isExpanded={isExpanded}
      onScroll={updateScrollDirection}
    >
      {!isExpanded && (
        <LeftPanel
          ref={participantListRef}
          $hasOverflow={hasParticipantListOverflow}
        >
        <VideoContanier>
          {selectedRemoteUser && (
            <VideoBox>
              <LocalUser
                style={{ zIndex: 0, backgroundColor: "#ababab" }}
                videoTrack={localCameraTrack}
                cameraOn={cameraOn}
                isScreenSharing={isScreenSharing}
                micOn={micOn}
              />
              {isLocalPatient && <LayoutButton
                type="button"
                onClick={() => {
                  setSelectedRemoteUid(null);
                  setIsLocalExpanded(isMobile);
                }}
                aria-label="Show You in the large frame"
              >
                <img src={expandIcon} alt="" />
              </LayoutButton>}
              {!cameraOn && !isScreenSharing && (
                <UserAvatarOverlay
                  isListView
                  micOn={micOn}
                  label="You"
                  showModel={showModel}
                  showPardonInterruptionModal={showPardonInterruptionModal}
                />
              )}
              <VideoInfo>
                <MicrophoneIcon
                  src={micOn ? microphoneIcon : microphoneUmuteIcon}
                  width={22}
                  height={micOn ? 28 : 18}
                />
                <UserVideoInfo>You</UserVideoInfo>
              </VideoInfo>
            </VideoBox>
          )}
          {remoteUsers
            .filter((user) => String(user.uid) !== selectedRemoteUid)
            .map((user) => (
            <VideoBox key={user?.uid}>
              <RemoteUser
                user={user}
                style={{ zIndex: 0, background: "#ababab" }}
              />
              {user.participantType === "patient" && <LayoutButton
                type="button"
                onClick={() => {
                  setIsLocalExpanded(false);
                  setSelectedRemoteUid(String(user.uid));
                }}
                aria-label={`Show ${user.name || "Remote User"} in the large frame`}
              >
                <img src={expandIcon} alt="" />
              </LayoutButton>}
              {callType === "provider" && (
                <FullscreenButton onClick={videoCall.togglePip}>
                  <img src={pictureToPictureIcon} alt="pictureToPicture" />
                </FullscreenButton>
              )}
              {!hasVisibleRemoteVideo(user) && (
                <UserAvatarOverlay
                  isListView={true}
                  micOn={remoteMicStatus[user.uid]}
                  label={user.name || "Remote User"}
                  showModel={showModel}
                  showPardonInterruptionModal={showPardonInterruptionModal}
                />
              )}
              <VideoInfo>
                <MicrophoneIcon
                  src={
                    remoteMicStatus[user.uid]
                      ? microphoneIcon
                      : microphoneUmuteIcon
                  }
                  width={remoteMicStatus[user.uid] ? 22 : 22}
                  height={remoteMicStatus[user.uid] ? 28 : 18}
                />
                <UserVideoInfo>
                  {formatUsername(user.name || "Remote User")}
                </UserVideoInfo>
              </VideoInfo>
            </VideoBox>
            ))}
        </VideoContanier>
        </LeftPanel>
      )}

      <RightPanel>
        <MainVideoBox $isExpanded={isExpanded}>
          {selectedRemoteUser ? (
            <>
              <RemoteUser
                user={selectedRemoteUser}
                style={{ zIndex: 0, background: "#ababab" }}
              />
              {selectedRemoteUser.participantType === "patient" && <LayoutButton
                type="button"
                onClick={() => setSelectedRemoteUid(null)}
                aria-label="Return You to the large frame"
              >
                <img
                  src={expandedViewIcon}
                  alt=""
                  style={!isMobile ? { width: 24, height: 24 } : undefined}
                />
              </LayoutButton>}
              {callType === "provider" && (
                <FullscreenButton onClick={videoCall.togglePip}>
                  <img src={pictureToPictureIcon} alt="pictureToPicture" />
                </FullscreenButton>
              )}
              {!hasVisibleRemoteVideo(selectedRemoteUser) && (
                <UserAvatarOverlay
                  isListView
                  micOn={remoteMicStatus[selectedRemoteUser.uid]}
                  label={selectedRemoteUser.name || "Remote User"}
                  showModel={showModel}
                  showPardonInterruptionModal={showPardonInterruptionModal}
                />
              )}
              <MainVideoInfo>
                <MicrophoneIcon
                  width={22}
                  height={
                    remoteMicStatus[selectedRemoteUser.uid] ? 28 : 18
                  }
                  src={
                    remoteMicStatus[selectedRemoteUser.uid]
                      ? microphoneIcon
                      : microphoneUmuteIcon
                  }
                />
                <UserVideoInfo>
                  {formatUsername(selectedRemoteUser.name || "Remote User")}
                </UserVideoInfo>
              </MainVideoInfo>
            </>
          ) : (
            <>
              <LocalUser
                style={{ zIndex: 0, backgroundColor: "#ababab" }}
                videoTrack={localCameraTrack}
                cameraOn={cameraOn}
                isScreenSharing={isScreenSharing}
                micOn={micOn}
              />
              {isLocalPatient && <LayoutButton
                type="button"
                onClick={() => setIsLocalExpanded((expanded) => !expanded)}
                aria-label={
                  isLocalExpanded
                    ? "Return to list view"
                    : "Expand You"
                }
              >
                <img
                  src={expandedViewIcon}
                  alt=""
                  style={!isMobile ? { width: 24, height: 24 } : undefined}
                />
              </LayoutButton>}
              {!cameraOn && !isScreenSharing && (
                <UserAvatarOverlay
                  isListView
                  micOn={micOn}
                  label="You"
                  showModel={showModel}
                  showPardonInterruptionModal={showPardonInterruptionModal}
                />
              )}
              <MainVideoInfo>
                <MicrophoneIcon
                  width={22}
                  height={micOn ? 28 : 18}
                  src={micOn ? microphoneIcon : microphoneUmuteIcon}
                />
                <UserVideoInfo>You</UserVideoInfo>
              </MainVideoInfo>
            </>
          )}
        </MainVideoBox>
      </RightPanel>
      {isMobile && isExpanded && totalUserCount > 1 && (
        <ReturnToGridButton
          type="button"
          onClick={() => {
            setSelectedRemoteUid(null);
            setIsLocalExpanded(false);
          }}
          aria-label="Return to participant list"
        >
          {totalUserCount - 1} other Participant
        </ReturnToGridButton>
      )}
      {!isExpanded && totalUserCount > 8 && (
        <ListScrollHintButton
          type="button"
          onClick={scrollToMoreUsers}
          className={isAtScrollBottom ? "is-at-bottom" : undefined}
          aria-label={
            isAtScrollBottom
              ? "Scroll to the first participant"
              : "Scroll to more participants"
          }
          title={
            isAtScrollBottom
              ? "Back to participants at top"
              : "More participants below"
          }
        >
          ↓
        </ListScrollHintButton>
      )}
    </MainStage>
  );
};
