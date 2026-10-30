import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(10px, 1.8vh, 18px) 20px clamp(140px, 20vh, 220px) 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 12px 12px clamp(100px, 15vh, 160px) 12px;
  }
`;

export const TitleSection = styled.div`
  text-align: center;
  margin-bottom: clamp(12px, 1.8vh, 20px);
`;

export const PageHeading = styled.h1`
  font-size: clamp(20px, 2.6vw, 28px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 6px;
  letter-spacing: -0.3px;
`;

export const PageSubheading = styled.p`
  font-size: clamp(13px, 1.5vw, 15px);
  color: ${({ theme }) => theme.colors.secondaryText};
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.45;
`;

export const CardContainer = styled.div`
  width: 100%;
  max-width: 980px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(16, 27, 75, 0.05);
  padding: clamp(18px, 2.2vh, 26px) clamp(22px, 2.5vw, 32px);
  display: flex;
  gap: clamp(20px, 2.5vw, 32px);
  position: relative;

  @media (max-width: 820px) {
    flex-direction: column;
    padding: 20px 16px;
    gap: 20px;
  }
`;

export const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderIconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.lightCyan};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primaryTeal};
  font-size: 20px;
  flex-shrink: 0;
`;

export const HeaderTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ColumnTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0;
`;

export const ColumnSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin: 2px 0 0 0;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primaryTeal};
    box-shadow: 0 0 0 3px rgba(0, 159, 149, 0.15);
  }
`;

export const WristbandBox = styled.div`
  width: 100%;
  height: 155px;
  background: #EBF7F7;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    max-height: 125px;
    max-width: 90%;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0, 159, 149, 0.08));
  }
`;

export const SparkleAccents = styled.div`
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  color: #009F95;

  span {
    display: inline-block;
    width: 3px;
    height: 10px;
    background: #009F95;
    border-radius: 2px;

    &:nth-child(1) {
      transform: rotate(-25deg);
    }
    &:nth-child(2) {
      height: 12px;
      margin-top: -3px;
    }
    &:nth-child(3) {
      transform: rotate(25deg);
    }
  }
`;

export const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 820px) {
    &::before {
      top: 50%;
      bottom: auto;
      left: 0;
      right: 0;
      height: 1px;
      width: 100%;
    }
  }
`;

export const OrBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F4F9FD;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ViewfinderContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 220px;
  background: #F3F6F9;
  border-radius: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const CornerBracket = styled.div<{ $position: "tl" | "tr" | "bl" | "br" }>`
  position: absolute;
  width: 28px;
  height: 28px;
  border: 3.5px solid ${({ theme }) => theme.colors.primaryTeal};
  z-index: 2;

  ${({ $position }) => {
    switch ($position) {
      case "tl":
        return `
          top: 14px;
          left: 14px;
          border-right: none;
          border-bottom: none;
          border-top-left-radius: 8px;
        `;
      case "tr":
        return `
          top: 14px;
          right: 14px;
          border-left: none;
          border-bottom: none;
          border-top-right-radius: 8px;
        `;
      case "bl":
        return `
          bottom: 14px;
          left: 14px;
          border-right: none;
          border-top: none;
          border-bottom-left-radius: 8px;
        `;
      case "br":
        return `
          bottom: 14px;
          right: 14px;
          border-left: none;
          border-top: none;
          border-bottom-right-radius: 8px;
        `;
    }
  }}
`;

export const CameraPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.6;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

export const AssociateButton = styled.button`
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.colors.primaryTeal};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 159, 149, 0.25);

  &:hover {
    background: ${({ theme }) => theme.colors.darkTeal};
    box-shadow: 0 6px 18px rgba(0, 159, 149, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CornerScanGuide = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  line-height: 0;

  img {
    width: clamp(260px, 22vw, 360px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 12px 30px rgba(16, 27, 75, 0.16));
    transform-origin: bottom left;
    transition: transform 0.25s ease;
  }

  @media (max-width: 1200px) {
    img {
      width: clamp(210px, 19vw, 280px);
    }
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

export const CornerDeviceBarcode = styled.div`
  position: absolute;
  bottom: clamp(16px, 2.5vh, 28px);
  right: clamp(18px, 2.5vw, 36px);
  z-index: 10;

  @media (max-width: 860px) {
    position: static;
    margin: 20px auto 16px auto;
    display: flex;
    justify-content: center;
  }
`;

export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 8px 18px 10px 18px;
  box-shadow: 0 4px 16px rgba(16, 27, 75, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryTeal};
    box-shadow: 0 6px 20px rgba(0, 159, 149, 0.15);
    transform: translateY(-2px);
  }
`;

export const FooterUpperContent = styled.span`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

export const FooterLowerContent = styled.img`
  height: 44px;
  object-fit: contain;
  border-radius: 4px;
`;

/* Backward compatibility aliases */
export const FooterSection = styled.div`
  display: contents;
`;
export const FooterLeft = styled.div`
  display: contents;
`;
export const FooterLeftImg = styled.img``;
export const FooterRight = styled.div`
  display: contents;
`;

