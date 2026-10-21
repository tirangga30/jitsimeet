import styled, { keyframes } from "styled-components";
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%,100%{
    transform: scale(1);
  }
  50%{
    transform: scale(1.05);
  }
`;

const fade = keyframes`
  0%,100%{
    opacity:.5;
  }
  50%{
    opacity:1;
  }
`;

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999999;
  background: rgba(255, 255, 255, 0.7);
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LogoWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Ring = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.15);
  border-top: 5px solid #3fd3ff;
  animation: ${rotate} 1.2s linear infinite;
  background: #0e4b71;
`;

export const Logo = styled.img`
  width: 80px;
  height: auto;
  object-fit: contain;
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

export const LoadingText = styled.p`
  margin-top: 24px;
  color: #0e4b71;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  animation: ${fade} 1.5s ease infinite;
`;

export const SmallSpinnerWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const LoaderSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
