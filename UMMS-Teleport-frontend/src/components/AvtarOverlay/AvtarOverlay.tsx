import circleIcon from "../../assets/circle-image.png";
import {
  AvatarOverlay,
  AvatarOverlayImage,
  AvatarOverlayImageLarge,
} from "./AvtarOverlay.styles";
interface UserAvatarOverlayProps {
  showModel?: boolean;
  showPardonInterruptionModal?: boolean;
  micOn: boolean;
  label?: string;
  width?: string;
  height?: string;
  isListView?: boolean;
  isBigAvatar?: boolean;
}

export const UserAvatarOverlay = ({
  showModel = false,
  showPardonInterruptionModal = false,
  height,
  width,
  isListView = false,
  isBigAvatar = false,
}: UserAvatarOverlayProps) => {
  return (
    <AvatarOverlay $zIndex={showModel || showPardonInterruptionModal ? -1 : 1}>
      {isBigAvatar ? (
        <AvatarOverlayImageLarge $layout="list" src={circleIcon} alt="circel" />
      ) : (
        <AvatarOverlayImage
          src={circleIcon}
          alt="circel"
          width={width}
          height={height}
          $layout={isListView ? "list" : "grid"}
        />
      )}
    </AvatarOverlay>
  );
};
