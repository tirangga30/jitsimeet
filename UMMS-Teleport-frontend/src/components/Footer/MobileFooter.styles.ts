import styled, { keyframes } from "styled-components";
import { CommonIcon } from "../Icon/Icon.styles";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const MobileFooterBar = styled.footer`
  width: 100%;
  background: #062942;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 14px 20px calc(14px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
`;
export const MidSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
export const MenuBar = styled.div.attrs<{
  gap?: string;
}>((props) => ({
  gap: props.gap || "32px",
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 420px;
  gap: ${({ gap }) => gap};
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const MenuLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: #e2e2e2;
`;

export const MenuIcon = styled(CommonIcon).attrs<{
  width: number;
  height: number;
}>((props) => ({
  width: props.width || 0,
  height: props.height || 0,
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  object-fit: contain;
  transition: transform 0.3s ease;

  &.rotate-animation {
    animation: ${rotate} 0.6s ease-in-out;
  }
`;

export const EndButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #d92d20;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #b42318;
  }
`;
