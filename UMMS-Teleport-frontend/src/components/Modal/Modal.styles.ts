import styled from "styled-components";

export const ModelHeader = styled.div<{ $isprimaryBackground?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.navy};
  padding: 16px 22px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

export const ModelHeaderTitle = styled.p`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  margin: 0;
`;

export const ModelBody = styled.div`
  padding: 24px;
  background: #ffffff;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

export const DeleteContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
`;

export const DeleteTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  color: #484644;
`;

export const DeleteDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
`;

export const DeleteButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const LeaveContainer = styled.div`
  padding: 40px 15px;
  text-align: center;
`;
export const LeaveTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  color: #484644;
  /* width: 320px; */
`;

export const LeaveOR = styled.div`
  text-align: center;
  margin: 10px;
  color: ${({ theme }) => theme.colors.lightgray};
  font-weight: ${({ theme }) => theme.weight.medium};
  font-size: ${({ theme }) => theme.typography.body};
`;

export const LeaveButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;
