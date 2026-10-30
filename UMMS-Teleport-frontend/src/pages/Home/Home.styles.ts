import styled from "styled-components";
import bgNew from "../../assets/img/refactor/bgnew.jpeg";

export const PageWrapper = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 48px 24px 60px 24px;
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
  max-width: 680px;
  position: relative;
  z-index: 1;
`;

export const LogoWrapper = styled.div`
  margin-bottom: 28px;

  img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.navy};
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  margin: 0 0 16px 0;
  letter-spacing: -0.4px;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: clamp(14px, 1.8vw, 16px);
  margin: 0 0 40px 0;
  line-height: 1.6;
  max-width: 500px;
`;

export const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 640px;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 12px 32px rgba(16, 27, 75, 0.08));
  }
`;