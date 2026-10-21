import styled from "styled-components";
import { CommonIcon } from "../../components/Icon/Icon.styles";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0px;
  box-sizing: border-box;
`;

export const PatientIdentifierInformationSection = styled.div`
  display: flex;
  margin: 50px;
`;
export const PatientImageWrapper = styled.div`
  width: 220px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  img {
    width: 100%;
    height: 200px;
    border-radius: 6px;
    object-fit: cover;
  }
`;

export const BasicInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  text-decoration: underline;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.white};
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  span.label {
    width: 160px;
    font-size: ${({ theme }) => theme.typography.body};
    opacity: 0.8;
    font-weight: ${({ theme }) => theme.weight.normal};
    color: ${({ theme }) => theme.colors.white};
  }

  span.value {
    font-size: ${({ theme }) => theme.typography.body};
    font-weight: ${({ theme }) => theme.weight.bold};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const Divider = styled.div`
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 40px;
`;

export const AdditionalInfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BottomRow = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const StyledDropdown = styled.div`
  .p-dropdown {
    width: 190px;
    height: 45px;
    padding: 15px;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${({ theme }) => theme.typography.body};
    font-weight: ${({ theme }) => theme.weight.bold};
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid #ffffff;
    border-radius: 4px;

    &:hover {
      opacity: 0.85;
    }
  }
`;

export const Icon = styled(CommonIcon).attrs<{
  width: number;
  height: number;
}>((props) => ({
  width: props.width || 0,
  height: props.height || 0,
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const FooterSection = styled.div`
  display: flex;
  justify-content: end;
  position: absolute;
  bottom: 90px;
  right: 20px;
`;

export const AddButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 4px;
  height: 45px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  display: flex;
  align-items: center;
  gap: 10px;
  /* margin-left: 20px; */
  &:hover {
    background-color: #0e4b71;
  }

  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid #ffffff;
  /* margin-right: 20px; */
  &:hover {
    background-color: #0e4b71;
  }
`;

export const CloseButton = styled.button`
  padding: 15px 15px;
  border: none;
  border-radius: 4px;
  height: 45px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #ad1111;
  }

  background-color: ${({ theme }) => theme.colors.red};
  border: 1px solid #ffffff;
`;
export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  margin-left: 310px;
`;
