import { MobileFooterBar } from "./MobileFooter.styles";
import {
  MenuItem,
  MenuBar,
  MenuIcon,
  MidSection,
  EndButton,
} from "./MobileFooter.styles";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import videoIcon from "../../assets/icons/white/icons8-video-call-30.png";
import microphoneIcon from "../../assets/icons/white/icons8-microphone-48.png";
import flipCameraIcon from "../../assets/icons/white/icons8-switch-camera-50.png";
import microphoneMuteIcon from "../../assets/icons/white/icons8-mute-unmute-48 (1).png";
import videoOffIcon from "../../assets/icons/white/icons8-no-video-30.png";
import shareIcon from "../../assets/icons/white/share.png";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  selectCameraOn,
  selectIsScreenSharing,
  selectMicOn,
  videoCallActions,
} from "../../store/features/videoCall/videoCallSlice";
import { globalActions } from "../../store/features/global/globalSlice";
import {
  flipLocalCamera,
  invokeScreenShareAction,
} from "../../utils/jitsiApi";
import { getDeviceType } from "../../utils/utils";

const MobileFooter = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const routes = location.pathname.split("/");
  const currentRoute = routes[routes.length - 1];
  const deviceType = getDeviceType();
  const isPadDevice =
    deviceType === "ipad-app" ||
    deviceType === "ipad-browser" ||
    deviceType === "mobile";

  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const micOn = useAppSelector(selectMicOn);
  const cameraOn = useAppSelector(selectCameraOn);
  const isScreenSharing = useAppSelector(selectIsScreenSharing);

  const handleFlipCameraWithAnimation = async () => {
    setIsFlipping(true);

    try {
      await flipLocalCamera();
    } catch (err) {
      console.error("Error flipping camera:", err);
    } finally {
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  };

  const handleEndCall = async () => {
    dispatch(globalActions.handleEndCall(true));
    // dispatch(videoCallActions.resetState());
    // dispatch(
    //   videoCallActions.handleJoinVideoCall({
    //     appId: "",
    //     calling: false,
    //     channel: "",
    //     token: "",
    //   })
    // );
    // dispatch(globalActions.handleResetState());
    // dispatch(membersActions.resetState());

    // await client.leave();

    // navigate(`/${userId}/family-and-friend`);
  };

  return (
    <MobileFooterBar>
      {currentRoute === "video-call" && (
        <MidSection>
          <MenuBar gap={"30px"}>
            <MenuItem
              onClick={() => dispatch(videoCallActions.handleMicOn(!micOn))}
            >
              <MenuIcon
                src={micOn ? microphoneIcon : microphoneMuteIcon}
                alt="microphone"
                width={24}
                height={24}
              />
            </MenuItem>
            <MenuItem
              onClick={() =>
                dispatch(videoCallActions.handleCameraOn(!cameraOn))
              }
            >
              <MenuIcon
                src={cameraOn ? videoIcon : videoOffIcon}
                alt="video"
                width={24}
                height={24}
              />
            </MenuItem>

            <MenuItem
              onClick={cameraOn ? handleFlipCameraWithAnimation : undefined}
              aria-disabled={!cameraOn}
              style={{ opacity: cameraOn ? 1 : 0.5 }}
            >
              <MenuIcon
                src={flipCameraIcon}
                alt="flip camera"
                width={24}
                height={24}
                className={isFlipping ? "rotate-animation" : ""}
              />
            </MenuItem>
            {!isPadDevice && (
              <MenuItem onClick={() => void invokeScreenShareAction()}>
                <MenuIcon
                  src={shareIcon}
                  alt="share"
                  width={24}
                  height={24}
                  style={{
                    filter: isScreenSharing
                      ? "brightness(0) saturate(100%) invert(36%) sepia(96%) saturate(500%) hue-rotate(190deg) brightness(95%)"
                      : undefined,
                  }}
                />
              </MenuItem>
            )}
            <MenuItem>
              <EndButton onClick={handleEndCall}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </EndButton>
            </MenuItem>
          </MenuBar>
        </MidSection>
      )}
    </MobileFooterBar>
  );
};

export default MobileFooter;
