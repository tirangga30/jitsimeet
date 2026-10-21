import styled from "styled-components";

/** Shared base for image-based UI icons. Extend this component for local sizing. */
export const CommonIcon = styled.img`
  display: block;
  object-fit: contain;
  flex-shrink: 0;
`;
