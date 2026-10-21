import React from 'react';
import { StyledPage } from './Page.styles';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return <StyledPage>{children}</StyledPage>;
};

export default Page;
