import microphoneIcon from "../../../assets/icons/Microphone.png";
import microphoneUmuteIcon from "../../../assets/icons/Unmute.png";
import backIcon from "../../../assets/icons/icons8-back-to-50.png";
import NextIcon from "../../../assets/icons/icons8-next-page-50.png";
import pictureToPictureIcon from "../../../assets/icons/white/laptop-picture.png";
import expandIcon from "../../../assets/icons/white/Expand.png";
import fullPageViewIcon from "../../../assets/icons/white/Full Page View.png";
import { useRef, useState } from "react";

import { useAppSelector } from "../../../store/hooks";
import {
  CustomPaginatiion,
  CustomPrevNextButton,
  CustomPrevNextImg,
  EmptyVideoBox,
  ExpandedMainVideo,
  ExpandedVideoContainer,
  FullscreenButton,
  LayoutButton,
  LeftPanel,
  MainStage,
  MicrophoneIcon,
  ReturnToGridButton,
  ScrollHintButton,
  UserVideoInfo,
  VideoBox,
  VideoContanier,
  VideoInfo,
} from "./GridLayout.styles";

import {
  selectpanel,
  selectShowPardonInterruptionModal,
  selectShowUploadModel,
} from "../../../store/features/global/globalSlice";
import { selectCalling } from "../../../store/features/videoCall/videoCallSlice";
import {
  type VideoCallState,
  type RemoteUserItem,
} from "../../../hooks/useJitsiCall";
import { useDevice } from "../../../hooks/useDevice";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { UserAvatarOverlay } from "../../AvtarOverlay/AvtarOverlay";
import { formatUsername, getAvatarSize } from "../../../utils/utils";
import { LocalUser } from "../LocalUser";
import { RemoteUser } from "../RemoteUser";
import { hasVisibleRemoteVideo } from "../remoteVideo";
import { selectCallType } from "../../../store/features/members/membersSlice";
import Loader from "../../Loader/Loader";

type LocalUserItem = { type: "local" };
type RemoteUserItemType = { type: "remote"; user: RemoteUserItem };

interface GridLayoutProps {
  videoCall: VideoCallState;
}

export const GridLayout = ({ videoCall }: GridLayoutProps) => {
  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const [expandedUserId, setExpandedUserId] = useState<"local" | string | null>(
    null,
  );
  const [isAtScrollBottom, setIsAtScrollBottom] = useState(false);
  const showModel = useAppSelector(selectShowUploadModel);
  const showPardonInterruptionModal = useAppSelector(
    selectShowPardonInterruptionModal,
  );

  const {
    isConnected,
    remoteUsers,
    localCameraTrack,
    micOn,
    cameraOn,
    isScreenSharing,
    totalUserJoinedCount,
    remoteMicStatus,
  } = videoCall;

  const panel = useAppSelector(selectpanel);
  const calling = useAppSelector(selectCalling);
  const callType = useAppSelector(selectCallType);
  const isLocalPatient =
    new URLSearchParams(window.location.search).get("participantType") ===
    "patient";

  const allUsers: Array<LocalUserItem | RemoteUserItemType> = [
    { type: "local" },
    ...remoteUsers.map<RemoteUserItemType>((user) => ({
      type: "remote",
      user,
    })),
  ];
  const { isMobile } = useDevice();
  const expandedViewIcon = isMobile ? expandIcon : fullPageViewIcon;
  const USERS_PER_SLIDE = isMobile ? 8 : 6;
  const avatarSize = getAvatarSize(allUsers.length);
  const expandedRemoteUser =
    expandedUserId && expandedUserId !== "local"
      ? remoteUsers.find((user) => String(user.uid) === expandedUserId)
      : undefined;
  const hasExpandedUser =
    expandedUserId === "local" || Boolean(expandedRemoteUser);
  const otherParticipantCount = Math.max(totalUserJoinedCount - 1, 0);

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const userSlides = chunkArray(allUsers, USERS_PER_SLIDE);

  if (!isConnected && calling) {
    return <Loader />;
  }

  const showSwiper = !hasExpandedUser && !isMobile && totalUserJoinedCount > 6;

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
    <MainStage>
      {showSwiper && (
        <CustomPrevNextButton className="custom-prev">
          <CustomPrevNextImg src={backIcon} alt="back-btn" />
        </CustomPrevNextButton>
      )}
      <LeftPanel
        ref={scrollPanelRef}
        onScroll={updateScrollDirection}
        width={panel === "chat" || panel === "participants" ? "70%" : "100%"}
      >
        {hasExpandedUser ? (
          <ExpandedVideoContainer>
            <ExpandedMainVideo>
              <VideoBox>
                {expandedUserId === "local" ? (
                  <>
                    <LocalUser
                      style={{ zIndex: 0, backgroundColor: "#ababab" }}
                      videoTrack={localCameraTrack}
                      cameraOn={cameraOn}
                      isScreenSharing={isScreenSharing}
                      micOn={micOn}
                    />
                    <LayoutButton
                      type="button"
                      onClick={() => setExpandedUserId(null)}
                      aria-label="Return to grid view"
                    >
                      <img
                        src={expandedViewIcon}
                        alt=""
                        style={!isMobile ? { width: 24, height: 24 } : undefined}
                      />
                    </LayoutButton>
                    {!cameraOn && !isScreenSharing && (
                      <UserAvatarOverlay
                        isListView={false}
                        micOn={micOn}
                        label="You"
                        showModel={showModel}
                        showPardonInterruptionModal={
                          showPardonInterruptionModal
                        }
                        width={avatarSize}
                        height={avatarSize}
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
                  </>
                ) : expandedRemoteUser ? (
                  <>
                    <RemoteUser
                      user={expandedRemoteUser}
                      style={{ zIndex: 0, background: "#ababab" }}
                    />
                    <LayoutButton
                      type="button"
                      onClick={() => setExpandedUserId(null)}
                      aria-label="Return to grid view"
                    >
                      <img
                        src={expandedViewIcon}
                        alt=""
                        style={!isMobile ? { width: 24, height: 24 } : undefined}
                      />
                    </LayoutButton>
                    {callType === "provider" && (
                      <FullscreenButton onClick={videoCall.togglePip}>
                        <img
                          src={pictureToPictureIcon}
                          alt="pictureToPicture"
                        />
                      </FullscreenButton>
                    )}
                    {!hasVisibleRemoteVideo(expandedRemoteUser) && (
                      <UserAvatarOverlay
                        isListView={false}
                        micOn={remoteMicStatus[expandedRemoteUser.uid]}
                        label={expandedRemoteUser.name || "Remote User"}
                        showModel={showModel}
                        showPardonInterruptionModal={
                          showPardonInterruptionModal
                        }
                        width={avatarSize}
                        height={avatarSize}
                      />
                    )}
                    <VideoInfo>
                      <MicrophoneIcon
                        src={
                          remoteMicStatus[expandedRemoteUser.uid]
                            ? microphoneIcon
                            : microphoneUmuteIcon
                        }
                        width={22}
                        height={
                          remoteMicStatus[expandedRemoteUser.uid] ? 28 : 18
                        }
                      />
                      <UserVideoInfo>
                        {formatUsername(
                          expandedRemoteUser.name || "Remote User",
                        )}
                      </UserVideoInfo>
                    </VideoInfo>
                  </>
                ) : null}
              </VideoBox>
            </ExpandedMainVideo>
          </ExpandedVideoContainer>
        ) : showSwiper ? (
          <Swiper
            style={{
              zIndex: showModel || showPardonInterruptionModal ? -1 : 1,
            }}
            spaceBetween={30}
            pagination={{
              el: ".custom-pagination",
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-bullet">${index + 1}</span>`,
            }}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {userSlides.map((slideUsers, slideIndex) => (
              <SwiperSlide key={slideIndex}>
                {/* Always use USERS_PER_SLIDE so every slide has the same
                    3-column grid — partial slides get invisible placeholders */}
                <VideoContanier count={USERS_PER_SLIDE}>
                  {slideUsers.map((item, index) => {
                    if (item.type === "local") {
                      return (
                        <VideoBox key={`local-${index}`}>
                          <LocalUser
                            style={{ zIndex: 0, backgroundColor: "#ababab" }}
                            videoTrack={localCameraTrack}
                            cameraOn={cameraOn}
                            isScreenSharing={isScreenSharing}
                            micOn={micOn}
                          />
                          {isLocalPatient && (
                            <LayoutButton
                              type="button"
                              onClick={() => setExpandedUserId("local")}
                              aria-label="Expand You"
                            >
                              <img src={expandIcon} alt="expandIcon" />
                            </LayoutButton>
                          )}

                          {!cameraOn && !isScreenSharing && (
                            <UserAvatarOverlay
                              isListView={false}
                              micOn={micOn}
                              label="You"
                              showModel={showModel}
                              showPardonInterruptionModal={
                                showPardonInterruptionModal
                              }
                              width={avatarSize}
                              height={avatarSize}
                            />
                          )}
                          <VideoInfo>
                            <MicrophoneIcon
                              src={micOn ? microphoneIcon : microphoneUmuteIcon}
                              width={micOn ? 22 : 22}
                              height={micOn ? 28 : 18}
                            />
                            <UserVideoInfo>You</UserVideoInfo>
                          </VideoInfo>
                        </VideoBox>
                      );
                    }

                    const user = item.user;
                    return (
                      <VideoBox key={user.uid}>
                        <RemoteUser
                          user={user}
                          style={{ zIndex: 0, background: "#ababab" }}
                        />
                        {user.participantType === "patient" && (
                          <LayoutButton
                            type="button"
                            onClick={() => setExpandedUserId(String(user.uid))}
                            aria-label={`Expand ${user.name || "Remote User"}`}
                          >
                            <img src={expandIcon} alt="expandIcon" />
                          </LayoutButton>
                        )}
                        {callType === "provider" && (
                            <FullscreenButton onClick={videoCall.togglePip}>
                              <img
                                src={pictureToPictureIcon}
                                alt="pictureToPicture"
                              />
                            </FullscreenButton>
                          )}
                        {!hasVisibleRemoteVideo(user) && (
                          <UserAvatarOverlay
                            isListView={false}
                            micOn={remoteMicStatus[user.uid]}
                            label={user.name || "Remote User"}
                            showModel={showModel}
                            showPardonInterruptionModal={
                              showPardonInterruptionModal
                            }
                            width={avatarSize}
                            height={avatarSize}
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
                    );
                  })}

                  {/* Invisible placeholders so grid columns stay uniform */}
                  {Array.from({
                    length: USERS_PER_SLIDE - slideUsers.length,
                  }).map((_, idx) => (
                    <EmptyVideoBox key={`empty-${idx}`} />
                  ))}
                </VideoContanier>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <VideoContanier count={totalUserJoinedCount}>
            <VideoBox>
              <LocalUser
                style={{
                  zIndex: 0,
                  backgroundColor: "#ababab",
                }}
                videoTrack={localCameraTrack}
                cameraOn={cameraOn}
                isScreenSharing={isScreenSharing}
                micOn={micOn}
              />
              {isLocalPatient && (
                <LayoutButton
                  type="button"
                  onClick={() => setExpandedUserId("local")}
                  aria-label="Expand You"
                >
                  <img src={expandIcon} alt="expandIcon" />
                </LayoutButton>
              )}

              {!cameraOn && !isScreenSharing && (
                <UserAvatarOverlay
                  micOn={micOn}
                  label="You"
                  showModel={showModel}
                  showPardonInterruptionModal={showPardonInterruptionModal}
                  width={avatarSize}
                  height={avatarSize}
                  isListView={false}
                />
              )}
              <VideoInfo>
                <MicrophoneIcon
                  src={micOn ? microphoneIcon : microphoneUmuteIcon}
                  width={micOn ? 22 : 22}
                  height={micOn ? 28 : 18}
                />
                <UserVideoInfo>You</UserVideoInfo>
              </VideoInfo>
            </VideoBox>
            {remoteUsers.map((user) => (
              <VideoBox key={user?.uid}>
                <RemoteUser
                  user={user}
                  style={{ zIndex: 0, background: "#ababab" }}
                />
                {user.participantType === "patient" && (
                  <LayoutButton
                    type="button"
                    onClick={() => setExpandedUserId(String(user.uid))}
                    aria-label={`Expand ${user.name || "Remote User"}`}
                  >
                    <img src={expandIcon} alt="expandIcon" />
                  </LayoutButton>
                )}
                {callType === "provider" && (
                  <FullscreenButton onClick={videoCall.togglePip}>
                    <img src={pictureToPictureIcon} alt="pictureToPicture" />
                  </FullscreenButton>
                )}

                {!hasVisibleRemoteVideo(user) && (
                  <UserAvatarOverlay
                    isListView={false}
                    micOn={remoteMicStatus[user.uid]}
                    label={user.name || "Remote User"}
                    showModel={showModel}
                    showPardonInterruptionModal={showPardonInterruptionModal}
                    width={avatarSize}
                    height={avatarSize}
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
        )}
        {showSwiper && (
          <CustomPaginatiion className="custom-pagination"></CustomPaginatiion>
        )}
      </LeftPanel>
      {hasExpandedUser && otherParticipantCount > 0 && (
        <ReturnToGridButton
          type="button"
          onClick={() => setExpandedUserId(null)}
          aria-label="Show all participants in grid view"
        >
          {otherParticipantCount} other Participant
        </ReturnToGridButton>
      )}
      {showSwiper && (
        <CustomPrevNextButton className="custom-next">
          <CustomPrevNextImg src={NextIcon} alt="next-btn" />
        </CustomPrevNextButton>
      )}
      {!hasExpandedUser && isMobile && totalUserJoinedCount > 5 && (
        <ScrollHintButton
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
        </ScrollHintButton>
      )}
    </MainStage>
  );
};
