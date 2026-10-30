import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
`;

export const CounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 600px;
  margin: auto;
`;

export const TopHeading = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 12px;
  font-size: 16px;
`;

export const Heading = styled.h1`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 36px;
  font-size: clamp(22px, 3.5vw, 32px);
  letter-spacing: -0.3px;
`;

export const CounterCircle = styled.div.attrs<{
  width?: string;
  height?: string;
}>((props) => ({
  width: props.width || "220px",
  height: props.height || "220px",
}))`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 50%;
  border: 5px solid ${({ theme }) => theme.colors.primaryTeal};
  background: radial-gradient(circle, #FFFFFF 40%, #E7F8F8 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 16px 40px rgba(0, 159, 149, 0.18);
  animation: pulse 2s infinite ease-in-out;

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 16px 40px rgba(0, 159, 149, 0.18);
    }
    50% {
      transform: scale(1.03);
      box-shadow: 0 20px 48px rgba(0, 159, 149, 0.28);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 16px 40px rgba(0, 159, 149, 0.18);
    }
  }
`;

export const Count = styled.span.attrs<{
  size?: string;
}>((props) => ({
  size: props.size || "88px",
}))`
  font-size: ${({ size }) => size};
  color: ${({ theme }) => theme.colors.primaryTeal};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;
