import styled from "styled-components";
import { CommonIcon } from "../../Icon/Icon.styles";
import { ScrollHintButton } from "../GridLayout/GridLayout.styles";

export const MainStage = styled.div<{
  $tileCount?: number;
  $isExpanded?: boolean;
}>`
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: ${({ $isExpanded }) =>
      $isExpanded ? "1fr" : "1fr 1fr"};
    gap: 8px;
    padding: ${({ $isExpanded }) =>
      $isExpanded ? "24px 16px 60px" : "16px"};
    box-sizing: border-box;
    height: 100%;
    overflow-y: ${({ $tileCount = 0 }) => ($tileCount > 8 ? "auto" : "hidden")};
    align-content: start;

    /* ≤8 tiles: rows stretch to fill full screen (no empty gap) */
    ${({ $tileCount = 0, $isExpanded }) =>
      $isExpanded
        ? "grid-template-rows: 1fr;"
        : $tileCount <= 8
          ? `grid-template-rows: repeat(${Math.ceil($tileCount / 2)}, 1fr);`
          : `grid-auto-rows: calc((100% - 2 * 8px) / 4);`}
  }
`;

export const LeftPanel = styled.div<{ $hasOverflow?: boolean }>`
  flex-basis: 30%;
  max-width: 30%;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
  margin-left: 15px;
  overflow-x: hidden;
  scrollbar-gutter: ${({ $hasOverflow }) =>
    $hasOverflow ? "stable" : "auto"};
  padding-right: 6px;
  margin-top: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #776f6f #ffffff !important;
  background-image: ${({ $hasOverflow }) =>
    $hasOverflow
      ? `linear-gradient(
          to right,
          transparent 0,
          transparent calc(100% - 10px),
          #ffffff calc(100% - 10px),
          #ffffff 100%
        )`
      : "none"};

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: #ffffff !important;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #776f6f;
    border-radius: 10px;
    border: 2px solid #ffffff;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #625b5b;
  }

  /* Mobile: transparent — children flow directly into MainStage grid */
  @media (max-width: 768px) {
    display: contents;
  }
`;

export const RightPanel = styled.div`
  flex: 1;
  margin: 20px 0px;
  min-height: 0;

  /* Mobile: grid cell — height comes from grid-auto-rows */
  @media (max-width: 768px) {
    flex: none;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

export const ChatAndParticipantsPanel = styled.div`
  flex-basis: 40%;
  max-width: 40%;
  background: ${({ theme }) => theme.colors.white};
  height: 100%;
`;

export const MainVideoBox = styled.div<{ $isExpanded?: boolean }>`
  --video-side-rail: ${({ $isExpanded }) =>
    $isExpanded ? "clamp(120px, 16vw, 260px)" : "clamp(12px, 2.5vw, 24px)"};

  height: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  box-sizing: border-box;
  border-inline: var(--video-side-rail) solid
    ${({ theme }) => theme.colors.secondary};
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0px 20px 0px 10px;

  /* Mobile: matches VideoBox exactly */
  @media (max-width: 768px) {
    --video-side-rail: ${({ $isExpanded }) =>
      $isExpanded ? "clamp(36px, 9vw, 40px)" : "8px"};

    height: 100%;
    margin: 0;
    border-radius: 8px;

    ${({ $isExpanded }) =>
      $isExpanded &&
      `
      > div:first-child {
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        height: 100% !important;
        aspect-ratio: auto;
        transform: none;
      }
    `}
  }
`;

export const MainVideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: calc(-1 * var(--video-side-rail));
  padding: 8px 14px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border-top-right-radius: 18px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
  font-weight: 700;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
    border-top-right-radius: 12px;
    max-width: 85%;
  }
`;

/* Remote users: vertical list on desktop, transparent on mobile (flow into MainStage grid) */
export const VideoContanier = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 22px;
  direction: ltr;
  padding-right: 10px;

  /* Mobile: transparent — children (VideoBox) flow directly into MainStage grid */
  @media (max-width: 768px) {
    display: contents;
  }
`;

export const VideoBox = styled.div`
  --video-side-rail: clamp(12px, 2.5vw, 24px);

  background: ${({ theme }) => theme.colors.secondary};
  width: 100%;
  height: 220px;
  box-sizing: border-box;
  border-inline: var(--video-side-rail) solid
    ${({ theme }) => theme.colors.secondary};
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  @media (max-width: 768px) {
    --video-side-rail: 8px;

    height: 100%;
    border-radius: 8px;
  }
`;

export const VideoInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: calc(-1 * var(--video-side-rail));
  padding: 8px 14px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border-top-right-radius: 18px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
  font-weight: 700;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 10px;
    border-top-right-radius: 12px;
    max-width: 85%;
  }
`;

export const UserVideoInfo = styled.span``;

export const MicrophoneIcon = styled(CommonIcon).attrs<{
  width: number;
  height: number;
}>((props) => ({
  width: props.width || 0,
  height: props.height || 0,
}))`
  width: 22px;
  height: 28px;
  padding: ${(props) => (props.height < 28 ? "5px 2px" : "0")};
  box-sizing: border-box;
  object-fit: contain;
  flex-shrink: 0;
`;

/* Stub — not used in ListLayout.tsx but exported for safety */
export const MobilePipTile = styled.div`
  display: none;
`;

export const ListScrollHintButton = styled(ScrollHintButton)`
  @media (max-width: 768px) {
    position: fixed;
    right: auto;
    bottom: calc(80px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
  }
`;
