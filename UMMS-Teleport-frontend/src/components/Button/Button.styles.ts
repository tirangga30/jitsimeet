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

export const Spinner = styled.div<{ color?: string }>`
  width: 1.1em;
  height: 1.1em;
  min-width: 16px;
  min-height: 16px;
  border: 2.5px solid ${(props) => props.color || "#FFFFFF"};
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${rotate} 0.75s linear infinite;
  flex-shrink: 0;
  display: block;
  box-sizing: border-box;
`;


export const StyledButton = styled.button.attrs<{
  color: string;
  bgcolor: string;
  border: string;
  padding: string;
  width: string;
  textDecoration: string;
  $hoverBg?: string;
  $hoverBorder?: string;
  margin?: string;
}>((props) => ({
  color: props.color,
  bgcolor: props.bgcolor,
  border: props.border,
  padding: props.padding,
  width: props.width,
  margin: props.margin,
  textDecoration: props.textDecoration,
}))<{
  $hoverBg?: string;
  $hoverBorder?: string;
}>`
  padding: ${(props) => props.padding || "0 20px"};
  border-radius: 10px;
  margin: ${(props) => props.margin};
  ${(props) => props.width && `width: ${props.width};`}
  height: clamp(42px, 5.5vh, 48px);
  min-height: 44px; /* WCAG minimum tap target height */
  cursor: pointer;
  color: ${(props) => props.color};
  font-size: clamp(13px, 1.6vw, 15px);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: ${(props) => props.textDecoration};
  background-color: ${(props) => props.bgcolor};
  border: ${(props) => props.border};
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 6px rgba(16, 27, 75, 0.04);

  &:hover {
    background-color: ${(props) => props.$hoverBg || props.bgcolor};
    border: ${(props) => props.$hoverBorder || props.border};
    box-shadow: 0 4px 12px rgba(16, 27, 75, 0.08);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(16, 27, 75, 0.06);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Responsive adjustment for small devices */
  @media (max-width: 480px) {
    ${(props) => !props.width && "width: 100%;"}
    font-size: 14px;
  }
`;
export const Icon = styled(CommonIcon).attrs<{
  width: number;
  height: number;
}>((props) => ({
  width: props.width || 20,
  height: props.height || 20,
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
