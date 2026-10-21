import styled from "styled-components";
import { CommonIcon } from "../../Icon/Icon.styles";
export const MainStage = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const ScrollHintButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 1px solid #dfdfdf;
    box-shadow: 0px 4px 4px 0px #00000040;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.secondary};
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0 !important;
    cursor: pointer;

    &::before {
      content: "";
      width: 24px;
      height: 28px;
      background: center / contain no-repeat
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 28'%3E%3Cpath d='M12 2v21M4 15l8 8 8-8' fill='none' stroke='%23fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      flex: 0 0 auto;
      transition: transform 0.2s ease;
    }

    &.is-at-bottom::before {
      transform: rotate(180deg);
    }
  }
`;

export const ReturnToGridButton = styled.button`
  display: none;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 35;
  min-width: 158px;
  height: 40px;
  padding: 0 14px 0 48px;
  background: #ebebeb;

  border: 1px solid #aeaeae;
  border-radius: 22px;
  box-shadow: 0 4px 4px #00000040;
  color: ${({ theme }) => theme.colors.secondary};
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 12px !important;
  font-weight: 700;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    left: -1px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border: 1px solid #ffffff;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.secondary} center / 22px 26px
      no-repeat
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 26'%3E%3Cpath d='M11 2v19M4 14l7 7 7-7' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    box-shadow: 0 4px 4px #00000040;
  }

  @media (max-width: 768px) {
    display: flex;
    bottom: 8px;
    right: 16px;
    left: auto;
    transform: none;
    min-width: 150px;
    height: 38px;
    padding-left: 45px;
    font-size: 11px !important;

    &::before {
      width: 38px;
      height: 38px;
    }
  }
`;

export const LeftPanel = styled.div.attrs<{
  width: string;
}>((props) => ({
  width: props.width || "",
}))`
  width: ${(props) => props.width};
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0px 5px;

  @media (max-width: 768px) {
    width: 100% !important;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;

    .mySwiper {
      width: 100%;
      height: 100%;
    }

    .swiper-slide {
      height: 100%;
      overflow-y: auto;
    }
  }
`;
export const RightPanel = styled.div`
  flex: 1;
  width: 100%;
`;
export const VideoContanier = styled.div<{ count: number }>`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 12px;

  @media (max-width: 768px) {
    column-gap: 10px;
    row-gap: 12px;

    /* Mobile spotlight: the large first tile uses the wider side rails from
       the mobile reference; compact tiles keep narrow rails for more video. */
    ${({ count }) =>
      count >= 3 &&
      `
      > div:nth-child(1) {
        --video-side-rail: clamp(36px, 9vw, 40px);
      }

      

      > div:nth-child(1) > div:first-child {
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        height: 100% !important;
        aspect-ratio: auto;
        transform: none;
      }
    `}

    ${({ count }) =>
      count <= 2 &&
      `
      > div {
        --video-side-rail: 8px;
      }

      > div > div:first-child {
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

  /* 1 user → single full-width tile */
  ${({ count }) =>
    count === 1 &&
    `
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  `}

  /* 2 users → side-by-side on desktop; stacked vertically on mobile */
  ${({ count }) =>
    count === 2 &&
    `
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }
  `}

  /* 3 users → 2 in row 1, 3rd in row 2 on desktop.
     On mobile: 1 large main video top (full width, 60%), 2 smaller below (1fr 1fr) */
  ${({ count }) =>
    count === 3 &&
    `
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    > div:nth-child(3) {
      grid-column: 1 / 3;
      width: 50%;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      height: 100%;

      > div:nth-child(1) {
        grid-column: 1 / 3;
        width: 100%;
      }

      > div:nth-child(2) {
        grid-column: 1;
        width: 100%;
      }

      > div:nth-child(3) {
        grid-column: 2;
        width: 100%;
        margin: 0;
      }
    }
  `}

  /* 4 users → 2×2 grid on desktop.
     On mobile: 1 large top (full width) + 3 smaller below in a 2-col + 1-centered row */
  ${({ count }) =>
    count === 4 &&
    `
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1.84fr 1fr 1fr;
      height: 100%;

      > div:nth-child(1) {
        grid-column: 1 / 3;
      }

      > div > div:first-child {
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        height: 100% !important;
        aspect-ratio: auto;
        transform: none;
      }
    }
  `}

  /* 5 users → desktop 3-col. Mobile: 1 large top + 4 below in 2-col rows */
  ${({ count }) =>
    count === 5 &&
    `
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1.84fr 1fr 1fr;
      height: 100%;

      > div:nth-child(1) {
        grid-column: 1 / 3;
      }

      > div > div:first-child {
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        height: 100% !important;
        aspect-ratio: auto;
        transform: none;
      }
    }
  `}

  /* 6+ users → 3-column grid on desktop, spotlight (1 large + 2-col rows) on mobile */
  ${({ count }) =>
    count >= 6 &&
    `
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 46% 25% 25%;
      grid-auto-rows: 25%;
      height: 100%;
      min-height: 100%;
      align-content: start;

      > div:nth-child(1) {
        grid-column: 1 / 3;
        min-height: 0;
      }

      > div:not(:nth-child(1)) {
        min-height: 0;
      }

      > div > div:first-child {
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        height: 100% !important;
        aspect-ratio: auto;
        transform: none;
      }
    }
  `}
`;

export const ExpandedVideoContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;

  @media (max-width: 768px) {
    display: block;
    box-sizing: border-box;
    padding-top: 12px;
    padding-bottom: 48px;
  }
`;

export const ExpandedThumbnailColumn = styled.div`
  display: none;
`;

export const ExpandedMainVideo = styled.div`
  flex: 1 1 100%;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;

  > div {
    /* Desktop Figma spotlight: the video stays centered with substantial
       blue rails on both sides of the expanded participant. */
    --video-side-rail: clamp(120px, 16vw, 260px);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;

    > div {
      --video-side-rail: clamp(36px, 9vw, 40px);
    }

    > div > div:first-child {
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      height: 100% !important;
      aspect-ratio: auto;
      transform: none;
    }
  }
`;

export const FullscreenButton = styled.button`
  position: absolute;

  bottom: 12px;
  right: calc(-1 * var(--video-side-rail));
  width: max(var(--video-side-rail), 24px);
  height: 40px;

  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }
`;
export const LayoutButton = styled.button`
  position: absolute;
  top: 12px;
  right: calc(-1 * var(--video-side-rail));

  width: max(var(--video-side-rail), 24px);
  height: 40px;

  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 18px;
    height: 18px;
  }
`;

export const VideoBox = styled.div`
  --video-side-rail: clamp(12px, 2.5vw, 24px);

  background: ${({ theme }) => theme.colors.secondary};
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-inline: var(--video-side-rail) solid
    ${({ theme }) => theme.colors.secondary};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 4px;

  @media (max-width: 768px) {
    /* Figma uses a narrow navy rail on both sides of compact tiles. */
    --video-side-rail: 8px;

    /* Mobile reference uses a 5:4 video surface. Extra tile height remains
       navy instead of stretching the video/avatar vertically. */
    > div:first-child {
      top: 50% !important;
      right: 0 !important;
      bottom: auto !important;
      left: 0 !important;
      height: auto !important;
      aspect-ratio: 5 / 4;
      transform: translateY(-50%);
    }
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

export const CustomPrevNextButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s ease;

  &.swiper-button-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const CustomPrevNextImg = styled.img`
  width: 30px;
`;

export const CustomPaginatiion = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const EmptyVideoBox = styled.div`
  background: transparent;
`;

export const MeetingContainer = styled.div`
  position: fixed;
  top: 5px;
  left: 50%;
`;

export const MeetingTimer = styled.div`
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 10, 10, 0.72);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 5px 16px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
    animation: pulse 1.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
`;
