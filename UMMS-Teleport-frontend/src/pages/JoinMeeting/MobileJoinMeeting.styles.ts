import styled from "styled-components";

export const MobileJoinContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #0e4b71;
  padding: 30px 40px;
  color: white;
  box-sizing: border-box;
  overflow-y: auto;
  width: 100%;
`;

export const MobileLogo = styled.img`
  width: 180px;
  margin-top: 10px;
  margin-bottom: 24px;
`;

export const MobileTitle = styled.h2`
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: 600;
  text-align: center;
  padding: 0 10px;
  box-sizing: border-box;
`;

export const MobileVideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 9;
  background: #052942;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 24px;
  margin-top: 20px;
`;

export const MobileVideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const MobilePlaceholderImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MobileRoundControlsContainer = styled.div`
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  align-items: center;
  zindex: 10;
`;

export const MobileRoundControlButton = styled.div<{ $enabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: ${(props) => (props.$enabled ? "rgba(0, 0, 0, 0.5)" : "#05324E")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
`;

export const MobileInstructionsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

export const MobileDropdownWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

export const MobileSelectRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 12px;
  width: 100%;
`;
