import styled from "styled-components";
import bgImage from "../../assets/img/9508803_26807 1.png";

export const PageWrapper = styled.div`
  height: 100dvh;
  width: 100%;
  background-image: url(${bgImage});
  background-color: #0c7a5c;
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 560px;
`;

export const LogoWrapper = styled.div`
  margin-bottom: 48px;

  img {
    height: clamp(48px, 10vw, 72px);
    width: auto;
    object-fit: contain;
  }
`;

export const ErrorCode = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: clamp(0.85rem, 2vw, 1rem);
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.15;
  letter-spacing: -0.5px;
`;

export const Description = styled.p`
  color: rgba(255, 255, 255, 0.75);
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  margin: 0 0 40px 0;
  line-height: 1.65;
  max-width: 420px;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
