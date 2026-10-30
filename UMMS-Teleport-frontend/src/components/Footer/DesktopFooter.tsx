import {
  FooterBar,
  LeftSection,
  SunIcon,
  Slider,
  RightSection,
  BatteryIcon,
  MenuItem,
  MenuBar,
  MenuIcon,
  MenuLabel,
  MidSection,
  EndButton,
} from "./DesktopFooter.styles";
import sunIcon from "../../assets/icons/white/icons8-brightness-50.png";
import batteryIcon from "../../assets/icons8-battery-50.png";
import { useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { ScreenBrightness } from "@capacitor-community/screen-brightness";
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
import { getDeviceType } from "../../utils/utils";
import {
  flipLocalCamera,
  invokeScreenShareAction,
} from "../../utils/jitsiApi";

const DesktopFooter = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const routes = location.pathname.split("/");
  const deviceType = getDeviceType();
  const isPadAPP = deviceType === "ipad-app";
  const isPadBrowser = deviceType === "ipad-browser";
  const isPadDevice = isPadAPP || isPadBrowser;
  const currentRoute = routes[routes.length - 1];
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [brightness, setBrightness] = useState<number>(1);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const micOn = useAppSelector(selectMicOn);
  const cameraOn = useAppSelector(selectCameraOn);
  const isScreenSharing = useAppSelector(selectIsScreenSharing);

  const handleFlipCameraWithAnimation = async () => {
    setIsFlipping(true);
    try {
      await flipLocalCamera();
    } catch (error) {
      console.error("Error flipping camera:", error);
    } finally {
      setIsFlipping(false);
    }
  };

  const handleBrightnessChange = async (value: number) => {
    setBrightness(value);
    try {
      await ScreenBrightness.setBrightness({ brightness: value });
    } catch (error) {
      console.error("Error setting brightness:", error);
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

  useEffect(() => {
    const getBrightness = async () => {
      try {
        const { brightness } = await ScreenBrightness.getBrightness();
        setBrightness(brightness);
      } catch (error) {
        console.error("Error getting brightness:", error);
      }
    };
    getBrightness();
  }, []);
  useEffect(() => {
    const fetchBattery = async () => {
      try {
        const info = await Device.getBatteryInfo();
        const level = info.batteryLevel
          ? Math.round(info.batteryLevel * 100)
          : null;

        setBatteryLevel(level);
      } catch (error) {
        console.error("Error fetching battery info:", error);
      }
    };

    fetchBattery();

    const interval = setInterval(fetchBattery, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPadAPP && currentRoute !== "video-call") {
    return null;
  }

  return (
    <FooterBar>
      {isPadAPP && (
        <LeftSection>
          <SunIcon src={sunIcon} alt="brightness" />
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={brightness}
            $value={brightness}
            onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
          />
        </LeftSection>
      )}

      {currentRoute === "video-call" && (
        <MidSection>
          <MenuBar gap={isPadAPP ? "40px" : "60px"}>
            <MenuItem
              onClick={() => dispatch(videoCallActions.handleMicOn(!micOn))}
            >
              <MenuIcon
                src={micOn ? microphoneIcon : microphoneMuteIcon}
                alt="microphone-white"
                width={24}
                height={24}
              />
              <MenuLabel>Microphone</MenuLabel>
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

              <MenuLabel>Video</MenuLabel>
            </MenuItem>
            {isPadDevice && (
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
                <MenuLabel>Flip Camera</MenuLabel>
              </MenuItem>
            )}
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
                <MenuLabel
                  style={{ color: isScreenSharing ? "#4da6ff" : undefined }}
                >
                  {isScreenSharing ? "Stop Share" : "Share"}
                </MenuLabel>
              </MenuItem>
            )}
            <MenuItem>
              <EndButton onClick={handleEndCall}>
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
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                End
              </EndButton>
            </MenuItem>
          </MenuBar>
        </MidSection>
      )}
      {isPadAPP && (
        <RightSection>
          <BatteryIcon src={batteryIcon} alt="battery" />
          <span>{batteryLevel}%</span>
        </RightSection>
      )}
    </FooterBar>
  );
};

export default DesktopFooter;
