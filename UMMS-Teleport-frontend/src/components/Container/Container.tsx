import React from 'react';
import { StyledContainer } from './Container.styles';

interface Props {
  children: React.ReactNode;
  hasPadding: boolean;
  padding?: string;
  hasPaddingTop?: boolean;
}

const Container = ({ children, hasPadding, padding, hasPaddingTop }: Props) => {
  return (
    <StyledContainer $hasPadding={hasPadding} padding={padding} $hasPaddingTop={hasPaddingTop}>
      {children}
    </StyledContainer>
  );
};

export default Container;
