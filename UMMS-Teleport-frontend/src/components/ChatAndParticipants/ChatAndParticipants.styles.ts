import styled from "styled-components";
import { CommonIcon } from "../Icon/Icon.styles";

export const Container = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  height: calc(100% - 40px);
  min-height: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin: 18px;
    height: calc(100% - 36px);
    max-height: 100%;
    gap: 10px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
export const HeaderLeft = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderLeftHeading = styled.h3`
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
`;
export const Icon = styled(CommonIcon).attrs<{
  width: number;
  height: number;
}>((props) => ({
  width: props.width || 24,
  height: props.height || 20,
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
export const CloseButton = styled.button.attrs<{
  width?: string;
  height?: string;
  $compact?: boolean;
}>((props) => ({
  width: props.width || "32px",
  height: props.height || "32px",
}))`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: 0;
  background: ${({ theme }) => theme.colors.lightred};
  border-radius: 50%;
  border: none;
  color: white;
  font-family: Arial, sans-serif;
  font-size: ${({ $compact }) => ($compact ? "15px" : "22px")};
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.darkred};
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  overflow-y: auto;
`;
export const ParticipantInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.body};
  color: #4e4e4e;
  font-weight: ${({ theme }) => theme.weight.bold};

  @media (max-width: 768px) {
    min-height: 32px;
    align-items: flex-start;
  }
`;

export const ParticipantInfoLeft = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const ParticipantName = styled.span`
  color: #4e4e4e;
  font-size: 12px;
  line-height: 15px;
  font-weight: ${({ theme }) => theme.weight.bold};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ParticipantInfoSubTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.normal};
`;

export const ParticipantRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding-top: 2px;
`;

export const ChatBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
  padding: 12px 8px;
  background: #f0f2f5;
  border-radius: 8px;
`;
export const MoreOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
  padding: 12px 8px;
  border-radius: 8px;
`;

export const OptionItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OptionItem = styled.div`
  cursor: pointer;
  display: flex;
  padding-left: 10px;
  padding-bottom: 10px;
  height: 54px;
  align-items: center;
  border-radius: 6px;
  border-bottom: 1px solid #c8c6c6;
`;
export const Option = styled.div`
  margin-left: 10px;
`;
export const ChatBubble = styled.div<{ isSelf: boolean }>`
  position: relative;
  max-width: 82%;
  min-width: 80px;
  padding: 10px 12px 20px 12px;
  border-radius: ${({ isSelf }) =>
    isSelf ? "12px 12px 4px 12px" : "12px 12px 12px 4px"};
  background: ${({ isSelf }) => (isSelf ? "#ffffff" : "#dde3ea")};
  align-self: ${({ isSelf }) => (isSelf ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  word-break: break-word;
`;

export const BubbleSender = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #0e4b71;
  margin-bottom: 4px;
`;

export const BubbleText = styled.div`
  font-size: 13px;
  color: #111;
  line-height: 1.45;
`;

export const BubbleTime = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 10px;
  color: #888;
  white-space: nowrap;
`;

export const SystemMessage = styled.div`
  text-align: center;
  margin: 6px 0;

  .title {
    font-size: 13px;
    font-weight: 700;
    color: #0e4b71;
  }

  .subtitle {
    font-size: 11px;
    color: #888;
    margin-top: 1px;
  }
`;

export const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 8px;
  background: #f2f6fa;
  border-radius: 12px;
  padding: 24px 20px;
  margin: 16px 8px;
`;
export const ChatInfoHeading = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #0e4b71;
`;
export const ChatInfoPara = styled.span`
  color: #64748b;
  font-size: 12px;
  line-height: 1.4;
  font-weight: 400;
`;

export const MessageContanier = styled.div`
  display: flex;
  border-radius: 8px;
  gap: 10px;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 10px;
`;

export const SendMessageTextArea = styled.textarea`
  flex-grow: 1;
  min-height: 72px;
  height: 72px;
  padding: 12px 14px;
  border: 1px solid #d0d5dd;
  border-radius: 10px;
  resize: none;
  font-size: 13px;
  color: #1d2939;
  box-sizing: border-box;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #98a2b3;
    font-weight: 400;
  }

  &:focus {
    border-color: #0e4b71;
  }
`;

export const SendButton = styled.button<{ $enabled: boolean }>`
  padding: 0;
  border: 0;
  background: ${({ $enabled, theme }) =>
    $enabled ? theme.colors.primary : "#98a2b3"};
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: ${({ $enabled }) => ($enabled ? "pointer" : "not-allowed")};
  align-self: flex-end;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const SendImage = styled.img`
  width: 15px;
  height: 14px;
`;

export const MicroPhoneIcon = styled(CommonIcon)`
  width: 12px;
  height: 18px;
  object-fit: contain;
`;
export const VideoIcon = styled(CommonIcon)`
  width: 17px;
  height: 12px;
  object-fit: contain;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const SelectParticipantsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const StyledDropdown = styled.div`
  flex: 1;
  min-width: 0;

  .p-dropdown {
    width: 100%;
    height: 45px;
    padding: 15px;
    border: 1px solid #05324e;
    border-radius: 4px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.darkgray};
    font-size: ${({ theme }) => theme.typography.body};
    font-weight: ${({ theme }) => theme.weight.bold};
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.white};

    &:hover {
      opacity: 0.85;
    }
  }
`;
// export const AddNewParticipantsContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   background: #f5f9fc;
//   border-top: 1px solid #094f7b57;

//   /* justify-content: space-between; */
//   gap: 10px;
// `;

export const NumberInput = styled.input`
  padding: 12px 14px;
  font-size: 12px;
  height: 45px;
  color: #2b2b2b;
  border-radius: 6px;
  color: #ffffff;
  border: 1px solid #b8b8b8;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #376ea6;
  }
  /* Hide spinner arrows in Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide spinner arrows in Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
export const Input = styled.input`
  padding: 12px 14px;
  font-size: 12px;
  height: 45px;
  border-radius: 6px;
  color: #ffffff;
  border: 1px solid #b8b8b8;
  width: 100%;
  ÷ &:focus {
    outline: none;
    border-color: #376ea6;
  }
  /* Hide spinner arrows in Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide spinner arrows in Firefox */
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

export const AddNewParticipantsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 15px;
  background: #f5f9fc;
  border: 1px solid #c8d9e6;
  border-radius: 6px;
  border-top: 4px solid #0e4b71;
`;

export const AddParticipantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AddParticipantTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.small};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const MobileRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const CallButton = styled.button`
  width: 240px;
  height: 56px;
  border: none;
  border-radius: 8px;
  background: #05324e;
  color: white;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;
