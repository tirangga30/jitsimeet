import React from "react";
import styled from "styled-components";

const DecorationContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const CrossAccent = styled.svg<{ $top?: string; $bottom?: string; $left?: string; $right?: string; $size?: number }>`
  position: absolute;
  top: ${({ $top }) => $top || "auto"};
  bottom: ${({ $bottom }) => $bottom || "auto"};
  left: ${({ $left }) => $left || "auto"};
  right: ${({ $right }) => $right || "auto"};
  width: ${({ $size }) => $size || 26}px;
  height: ${({ $size }) => $size || 26}px;
  opacity: 0.85;
`;

const DotGrid = styled.div<{ $top?: string; $bottom?: string; $left?: string; $right?: string }>`
  position: absolute;
  top: ${({ $top }) => $top || "auto"};
  bottom: ${({ $bottom }) => $bottom || "auto"};
  left: ${({ $left }) => $left || "auto"};
  right: ${({ $right }) => $right || "auto"};
  display: grid;
  grid-template-columns: repeat(4, 5px);
  gap: 10px;
  opacity: 0.45;

  span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #009F95;
  }
`;

export const PageDecorations: React.FC = () => {
  return (
    <DecorationContainer aria-hidden="true">
      {/* Top Left Teal Cross */}
      <CrossAccent $top="18%" $left="4%" $size={28} viewBox="0 0 24 24" fill="none">
        <path d="M12 4V20M4 12H20" stroke="#9CE2DE" strokeWidth="4" strokeLinecap="round" />
      </CrossAccent>

      {/* Top Right Teal Cross */}
      <CrossAccent $top="24%" $right="4%" $size={28} viewBox="0 0 24 24" fill="none">
        <path d="M12 4V20M4 12H20" stroke="#9CE2DE" strokeWidth="4" strokeLinecap="round" />
      </CrossAccent>

      {/* Dot Grid Accents */}
      <DotGrid $top="48%" $left="5%">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={`l-${i}`} />
        ))}
      </DotGrid>

      <DotGrid $top="50%" $right="5%">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={`r-${i}`} />
        ))}
      </DotGrid>
    </DecorationContainer>
  );
};

export default PageDecorations;
