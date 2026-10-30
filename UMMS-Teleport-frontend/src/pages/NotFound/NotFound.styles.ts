import styled from "styled-components";
import bgNew from "../../assets/img/refactor/bgnew.jpeg";

export const PageWrapper = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: url(${bgNew}) no-repeat center center fixed;
  background-size: cover;
  position: relative;
  overflow-y: auto;
  box-sizing: border-box;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 560px;
  position: relative;
  z-index: 1;
`;

export const LogoWrapper = styled.div`
  margin-bottom: 24px;

  img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }
`;

export const IllustrationContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

export const ErrorCode = styled.p`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 10px 0;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.navy};
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  margin: 0 0 12px 0;
  letter-spacing: -0.4px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 15px;
  margin: 0 0 28px 0;
  line-height: 1.6;
  max-width: 440px;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 30px;
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
