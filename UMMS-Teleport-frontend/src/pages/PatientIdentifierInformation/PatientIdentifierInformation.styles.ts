import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 16px 12px 36px 12px;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;
`;

export const BadgeIconContainer = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #E0F5F3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primaryTeal};
  margin-bottom: 14px;

  svg.badge-icon {
    width: 26px;
    height: 26px;
  }
`;

export const SparkleRay = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  gap: 3px;

  span {
    display: inline-block;
    width: 2.5px;
    height: 8px;
    background: #009F95;
    border-radius: 2px;

    &:nth-child(1) {
      transform: rotate(-30deg);
    }
    &:nth-child(2) {
      height: 10px;
      margin-top: -2px;
    }
    &:nth-child(3) {
      transform: rotate(30deg);
    }
  }
`;

export const PageHeading = styled.h1`
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 8px;
  letter-spacing: -0.3px;
`;

export const PageSubheading = styled.p`
  font-size: clamp(13px, 1.6vw, 15px);
  color: ${({ theme }) => theme.colors.secondaryText};
  margin: 0;
`;

export const MainCard = styled.div`
  width: 100%;
  max-width: 1000px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(16, 27, 75, 0.05);
  padding: 32px 36px;
  display: flex;
  align-items: stretch;
  gap: 36px;

  @media (max-width: 860px) {
    flex-direction: column;
    padding: 24px 20px;
    gap: 24px;
  }
`;

export const PhotoWrapper = styled.div`
  flex-shrink: 0;
  width: 220px;
  height: 200px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(16, 27, 75, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 860px) {
    width: 100%;
    max-width: 240px;
    height: 220px;
    margin: 0 auto;
  }
`;

export const InfoSection = styled.div`
  flex: 1.1;
  display: flex;
  flex-direction: column;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

export const SectionIconCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #E0F5F3;
  color: ${({ theme }) => theme.colors.primaryTeal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: baseline;
  padding: 8px 0;

  span.label {
    width: 130px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.secondaryText};
    font-weight: 500;
  }

  span.value {
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.navy};
  }
`;

export const VerticalDivider = styled.div`
  width: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 4px;

  @media (max-width: 860px) {
    width: 100%;
    height: 1px;
    margin: 10px 0;
  }
`;

export const AdditionalSection = styled.div`
  flex: 0.9;
  display: flex;
  flex-direction: column;
`;

export const ActionButtonBar = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const LeftActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ConnectButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background: ${({ theme }) => theme.colors.primaryTeal};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const InterpreterButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.navy};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(16, 27, 75, 0.04);

  &:hover {
    background: #F4F9FD;
    border-color: #B8CCE0;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DeassociateButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background: ${({ theme }) => theme.colors.destructive};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(229, 57, 69, 0.25);

  &:hover {
    background: ${({ theme }) => theme.colors.destructiveHover};
    box-shadow: 0 6px 18px rgba(229, 57, 69, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const LanguageDropdownGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  .p-dropdown {
    height: 48px;
    border-radius: 10px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: #ffffff;
    align-items: center;
    box-shadow: 0 2px 6px rgba(16, 27, 75, 0.04);

    &:hover {
      border-color: ${({ theme }) => theme.colors.primaryTeal};
    }
  }
`;

export const ActionMiniButton = styled.button<{ $variant?: "confirm" | "cancel" }>`
  height: 48px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  ${({ $variant, theme }) =>
    $variant === "cancel"
      ? `
    background: #FEE2E2;
    color: #DC2626;
    &:hover { background: #FECACA; }
  `
      : `
    background: ${theme.colors.primaryTeal};
    color: #FFFFFF;
    &:hover { background: ${theme.colors.darkTeal}; }
  `}
`;

export const AddButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  height: 44px;
  cursor: pointer;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.primaryTeal};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.darkTeal};
  }
`;
