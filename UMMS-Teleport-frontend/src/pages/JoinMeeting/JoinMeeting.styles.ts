import styled from "styled-components";
import { CommonIcon } from "../../components/Icon/Icon.styles";
import bgNew from "../../assets/img/refactor/bgnew.jpeg";

export const JoinContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(${bgNew}) no-repeat center center fixed;
  background-size: cover;
`;

export const Card = styled.div`
  padding: 40px;
  width: 100%;
  max-width: 1000px;
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
`;

export const RightControls = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Heading = styled.h2`
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${({ theme }) => theme.typography.large};
  margin-bottom: 12px;
`;

export const ControlRow = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 20px;
  align-items: center;
`;

export const CustomSelectContainer = styled.div`
  min-width: 0;
  position: relative;
  font-family: inherit;
`;

export const CustomSelectHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border-radius: 4px;
  /* background: #ffffff; */
  border-bottom: 1px solid #e6e6e6;
  color: ${({ theme }) => theme.colors.white};
  background: #eef1f333;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #a0b0bc;
  }
`;

export const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  background-image: ${(props) =>
    props.$isOpen
      ? `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='18 15 12 9 6 15'%3e%3c/polyline%3e%3c/svg%3e")`
      : `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`};

  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export const CustomSelectOptions = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #ccd4da;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 999;
`;

export const CustomSelectOption = styled.div<{ $isSelected: boolean }>`
  padding: 9px 12px;
  font-size: 13px;
  color: #1a2e3a;

  background: ${(props) => (props.$isSelected ? "#eef3f8" : "#ffffff")};
  cursor: pointer;
  font-weight: ${(props) => (props.$isSelected ? "600" : "400")};
  transition: background 0.1s ease;

  &:hover {
    background: #f0f4f7;
  }
`;

export const StartButton = styled.button`
  margin: 20px auto 0 auto;
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.green};
  border: 1px solid #ffffff;
  box-shadow: 0px 0px 16px 0px #ffffff29;
  color: white;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

export const Small = styled.div`
  font-size: ${({ theme }) => theme.typography.body};
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
`;

export const Logo = styled.img`
  width: 260px;
  margin-bottom: 20px;
`;

export const Icon = styled(CommonIcon).attrs<{
  width: string;
  height: string;
  marginRight: string;
}>((props) => ({
  width: props.width || "0",
  height: props.height || "0",
  marginRight: props.marginRight || "0",
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin-right: ${(props) => props.marginRight};
`;

export const ControlContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ControlLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body};
  width: 90px;
  color: ${({ theme }) => theme.colors.white};
`;
