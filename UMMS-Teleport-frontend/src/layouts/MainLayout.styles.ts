import styled from "styled-components";

export const IpadContainer = styled.div<{ $isHome?: boolean }>`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  margin: 0 auto;
  background: ${({ theme, $isHome }) =>
    $isHome ? "#ffffff" : theme.colors.background};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) 0px
    env(safe-area-inset-left, 0px);

  /* smooth corners + shadow */
  box-shadow: 0px 0px 2vw rgba(0, 0, 0, 0.25);
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: auto;
`;

export const PanelBackdrop = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: #000000b2;
    z-index: 9998;
    pointer-events: auto;
  }
`;

export const ChatAndParticipantsPanel = styled.div`
  flex-basis: 40%;
  max-width: 40%;
  background: ${({ theme }) => theme.colors.white};
  height: 100%;

  @media (max-width: 768px) {
    position: fixed;
    top: 110px;
    bottom: 75px;
    right: 0;
    left: auto;
    width: 82%;
    max-width: 360px;
    height: auto;
    max-height: none;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: -6px 0px 24px rgba(0, 0, 0, 0.35);
    z-index: 9999;
    flex-basis: auto;
    overflow-y: auto;
    animation: slideInRightFlush 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideInRightFlush {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export const WebContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
