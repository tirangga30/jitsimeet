import styled from 'styled-components';

export const ErrorContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 20px;
`;

export const ErrorTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 10px;
  color: #ff4d4f;
`;

export const ErrorMessage = styled.p`
  font-size: 18px;
  max-width: 380px;
  opacity: 0.8;
  margin-bottom: 20px;
`;

export const RetryButton = styled.button`
  padding: 12px 22px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #ff6666;
  }
`;
