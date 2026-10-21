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
  justify-content: flex-start;
  padding: 56px 32px 0 32px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
  overflow-y: auto;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 700px;
`;

export const LogoWrapper = styled.div`
  margin-bottom: 40px;

  img {
    height: clamp(52px, 10vw, 80px);
    width: auto;
    object-fit: contain;
  }
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.15;
  letter-spacing: -0.5px;
`;

export const Description = styled.p`
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(0.95rem, 2.5vw, 1.15rem);
  margin: 0 0 48px 0;
  line-height: 1.65;
  max-width: 480px;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 36px;
  flex-wrap: wrap;
`;

export const HomeActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  background: ${({ $variant }) =>
    $variant === "secondary" ? "rgba(255, 255, 255, 0.15)" : "#027564"};
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  padding: 12px 28px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "secondary" ? "rgba(255, 255, 255, 0.28)" : "#038d79"};
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 680px;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;