import styled from 'styled-components';

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0px;
  box-sizing: border-box;
`;

export const Heading = styled.h1`
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 30px;
  font-size: 30px;
`;
export const TopHeading = styled.h1`
  font-weight: ${({ theme }) => theme.weight.normal};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 30px;
  font-size: ${({ theme }) => theme.typography.h3};
`;
export const CounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
`;

export const CounterCircle = styled.div.attrs<{
  width?: string;
  height?: string;
}>((props) => ({
  width: props.width || '259px',
  height: props.height || '259px',
}))`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border-radius: 140px;
  border: 4px solid white;
  background-color: ${({ theme }) => theme.colors.green};
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Count = styled.h1.attrs<{
  size?: string;
}>((props) => ({
  size: props.size || '140px',
}))`
  font-size: ${({ size }) => size};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weight.normal};
`;
