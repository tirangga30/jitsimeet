import styled from "styled-components";

export const AvatarOverlay = styled.div<{
  $zIndex?: number;
}>`
  position: absolute;
  inset: 0;
  /* background: #ababab; */

  display: flex;
  align-items: center;
  justify-content: center;
  /* z-index: ${(props) => props.$zIndex || 1}; */
`;
export const AvatarOverlayImage = styled.img<{
  $layout: "grid" | "list";
}>`
  width: ${({ $layout }) =>
    $layout === "list"
      ? "clamp(60px, 15vw, 120px)"
      : "clamp(120px, 15vw, 220px)"};

  height: ${({ $layout }) =>
    $layout === "list"
      ? "clamp(60px, 15vw, 120px)"
      : "clamp(120px, 15vw, 220px)"};

  border-radius: 50%;
  object-fit: cover;
`;
export const AvatarOverlayImageLarge = styled(AvatarOverlayImage)`
  width: clamp(320px, 15vw, 460px);
  height: clamp(320px, 15vw, 460px);

  @media (max-width: 768px) {
    width: clamp(60px, 15vw, 120px);
    height: clamp(60px, 15vw, 120px);
  }
`;
