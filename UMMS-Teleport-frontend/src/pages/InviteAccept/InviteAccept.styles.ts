import styled from "styled-components";
import bgNew from "../../assets/img/refactor/bgnew.jpeg";

export const InviteAcceptContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  position: relative;
  background: url(${bgNew}) no-repeat center center fixed;
  background-size: cover;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const ContentCard = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
`;

export const BrandLogo = styled.img`
  width: 220px;
  height: auto;
  object-fit: contain;
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.navy};
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 22px 0;
`;

export const TimerCard = styled.div<{ $isMobile?: boolean }>`
  width: 100%;
  background: #E8F6F8;
  border: 2px solid #D4EFF2;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 159, 149, 0.08);
  padding: ${({ $isMobile }) => ($isMobile ? "20px 16px" : "22px 28px")};
  display: flex;
  align-items: center;
  justify-content: ${({ $isMobile }) => ($isMobile ? "center" : "space-between")};
  gap: 16px;
  margin-bottom: 22px;
`;

export const DigitalClock = styled.div`
  font-size: clamp(48px, 9vw, 64px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
`;

export const DoctorIllustration = styled.img`
  width: 130px;
  height: 130px;
  object-fit: contain;
  flex-shrink: 0;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const StatusMessage = styled.p`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 15px;
  margin: 0 0 20px 0;
  line-height: 1.5;

  b {
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 700;
  }
`;

export const SmsReminderButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.primaryTeal};
  color: #ffffff;
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 159, 149, 0.28);

  &:hover {
    background: ${({ theme }) => theme.colors.darkTeal};
    box-shadow: 0 6px 18px rgba(0, 159, 149, 0.38);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const InfoDivider = styled.div`
  width: 240px;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 22px auto 18px auto;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};

  span.val {
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 700;
  }
`;

export const InfoIconCircle = styled.span`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #E0F5F3;
  color: ${({ theme }) => theme.colors.primaryTeal};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* ── Error State / Unable to Join Styles ── */

export const ErrorStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 480px;
`;

export const ErrorHeading = styled.h2`
  color: ${({ theme }) => theme.colors.navy};
  font-size: 28px;
  font-weight: 800;
  margin: 20px 0 8px 0;
  letter-spacing: -0.3px;
`;

export const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 15px;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

export const HomeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.primaryTeal};
  color: #ffffff;
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 159, 149, 0.28);

  &:hover {
    background: ${({ theme }) => theme.colors.darkTeal};
    box-shadow: 0 6px 18px rgba(0, 159, 149, 0.38);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
