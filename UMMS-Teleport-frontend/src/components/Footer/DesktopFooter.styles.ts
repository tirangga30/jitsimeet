import styled, { keyframes } from "styled-components";
import { CommonIcon } from "../Icon/Icon.styles";

export const FooterBar = styled.footer`
  width: 100%;
  background: ${({ theme }) => theme.colors.navy};

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 20px calc(10px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const MidSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const MenuBar = styled.div.attrs<{
  gap?: string;
}>((props) => ({
  gap: props.gap || "40px",
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ gap }) => gap};
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

export const MenuLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: #e2e2e2;
`;
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
export const SunIcon = styled(CommonIcon)`
  width: 30px;
  height: 30px;
`;

export const Slider = styled.input.attrs({ type: "range" })<{ $value: number }>`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  appearance: none;
  outline: none;

  background: linear-gradient(
    to right,
    #5ac0ff ${(props) => props.$value * 100}%,
    #cecece ${(props) => props.$value * 100}%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }

  &::-moz-range-progress {
    background: #4f8aff;
  }
  &::-moz-range-track {
    background: #ddd;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-weight: 600;
  color: lightgray;
  font-size: 12px;
`;

export const BatteryIcon = styled(CommonIcon)`
  width: 30px;
  height: 30px;
`;
export const EndButton = styled.button`
  padding: 6px 15px;
  border: 1px solid #ffffff;
  cursor: pointer;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.darkred};
  }

  background-color: ${({ theme }) => theme.colors.red};
  margin-right: 0px;
  box-shadow: 0px 2px 4px 0px #0000001a;
`;
