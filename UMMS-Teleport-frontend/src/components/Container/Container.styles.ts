import styled from "styled-components";

export const StyledContainer = styled.div<{
  $hasPadding: boolean;
  $hasPaddingTop?: boolean;
  padding?: string;
}>`
  width: 100%;
  margin: 0 auto;

  padding: ${({ $hasPadding, padding }) =>
    $hasPadding ? padding || "25px" : "0px"};
  padding-top: ${({ $hasPaddingTop }) => ($hasPaddingTop ? "25px" : "0px")};
`;
