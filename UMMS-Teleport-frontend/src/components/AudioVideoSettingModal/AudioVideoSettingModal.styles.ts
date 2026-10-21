import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(-8px); }
  to   { opacity: 1; transform: scale(1)   translateY(0);     }
`;

const overlayFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #000000b2;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${overlayFade} 0.2s ease;
`;

export const ModalBox = styled.div`
  width: 520px;
  max-width: 95vw;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.22s ease;
  z-index: 9999;
  position: relative;
  background: #ffffff;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #1a3a52;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderTitle = styled.span`
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s;
`;

export const ModalBody = styled.div`
  background: #ffffff;
  padding: 8px 0 16px 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const DeviceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 10px 20px;
  /* border-bottom: 1px solid #f0f2f5; */

  &:last-child {
    border-bottom: none;
  }
`;

export const IconCell = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 8px;
  /* background: #1a3a52; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 14px;
`;

export const CustomSelectContainer = styled.div`
  flex: 1;
  position: relative;
  font-family: inherit;
`;

export const CustomSelectHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border: 1px solid #ccd4da;
  border-radius: 4px;
  font-size: 13px;
  color: #1a2e3a;
  background: #ffffff;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
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
      ? `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a2e3a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='18 15 12 9 6 15'%3e%3c/polyline%3e%3c/svg%3e")`
      : `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a2e3a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`};
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
