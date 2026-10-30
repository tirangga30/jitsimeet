import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 24px 20px 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 16px 12px 36px 12px;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;
`;

export const BadgeIconContainer = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: #E0F5F3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primaryTeal};
  margin-bottom: 14px;

  svg {
    width: 26px;
    height: 26px;
  }
`;

export const PageHeading = styled.h1`
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.navy};
  margin-bottom: 8px;
  letter-spacing: -0.3px;
`;

export const PageSubheading = styled.p`
  font-size: clamp(13px, 1.6vw, 15px);
  color: ${({ theme }) => theme.colors.secondaryText};
  margin: 0;
`;

export const MainCard = styled.div`
  width: 100%;
  max-width: 1080px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(16, 27, 75, 0.05);
  padding: 32px 36px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 24px 18px;
  }
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
`;

export const StepBadge = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #D4F2EE;
  color: #007F78;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StepTextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StepTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 4px 0;
`;

export const StepSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin: 0;
  line-height: 1.4;
`;

export const TableContainer = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 320px;
  background: #ffffff;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const TableHead = styled.thead`
  background: #E6F4F6;
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const HeadRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeadCell = styled.th`
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
  white-space: nowrap;
`;

export const TableBody = styled.tbody``;

export const BodyRow = styled.tr`
  border-bottom: 1px solid #F0F4F8;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #F8FAFC;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const BodyCell = styled.td`
  padding: 12px 18px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.navy};
  vertical-align: middle;
  white-space: nowrap;
`;

export const CheckBoxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

export const CheckBoxInput = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #CBD5E1;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  background: #ffffff;
  transition: all 0.2s ease;
  position: relative;

  &:checked {
    background-color: ${({ theme }) => theme.colors.primaryTeal};
    border-color: ${({ theme }) => theme.colors.primaryTeal};
  }

  &:checked::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
  }
`;

export const DeleteIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.destructive};
  transition: transform 0.15s ease;

  svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }

  &:hover {
    transform: scale(1.15);
  }
`;

export const AddNewButton = styled.button`
  align-self: flex-start;
  margin-top: 14px;
  padding: 8px 20px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.primaryTeal};
  border: 1.5px solid ${({ theme }) => theme.colors.primaryTeal};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #E7F8F8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
`;

export const SendButton = styled.button`
  height: 48px;
  padding: 0 32px;
  background: ${({ theme }) => theme.colors.primaryTeal};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 159, 149, 0.25);

  &:hover {
    background: ${({ theme }) => theme.colors.darkTeal};
    box-shadow: 0 6px 18px rgba(0, 159, 149, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  height: 48px;
  padding: 0 32px;
  background: ${({ theme }) => theme.colors.destructive};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(229, 57, 69, 0.25);

  &:hover {
    background: ${({ theme }) => theme.colors.destructiveHover};
    box-shadow: 0 6px 18px rgba(229, 57, 69, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SuccessView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0 16px 0;
  text-align: center;
`;

export const SuccessCheckCircle = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #E0F5F3;
  color: ${({ theme }) => theme.colors.primaryTeal};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const SuccessHeading = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.navy};
  margin: 0 0 6px 0;
`;

export const SuccessSubheading = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin: 0;
`;

/* ── Modal Form Styles ── */

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
  padding: 24px 28px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.navy};
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg.input-icon {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    color: #94A3B8;
    pointer-events: none;
  }
`;

export const StyledModalInput = styled.input`
  width: 100%;
  height: 46px;
  padding: 10px 14px 10px 42px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primaryTeal};
    box-shadow: 0 0 0 3px rgba(0, 159, 149, 0.15);
  }
`;

export const StyledModalSelect = styled.select`
  width: 100%;
  height: 46px;
  padding: 10px 14px 10px 42px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primaryTeal};
    box-shadow: 0 0 0 3px rgba(0, 159, 149, 0.15);
  }
`;

export const PhoneInputWrapper = styled.div`
  width: 100%;

  .PhoneInput {
    display: flex;
    align-items: center;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    padding: 0 10px;
    height: 46px;
    background: #ffffff;
    transition: all 0.2s ease;

    &:focus-within {
      border-color: ${({ theme }) => theme.colors.primaryTeal};
      box-shadow: 0 0 0 3px rgba(0, 159, 149, 0.15);
    }
  }

  .PhoneInputCountry {
    margin-right: 8px;
  }

  .PhoneInputInput {
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.navy};
    height: 100%;
    width: 100%;

    &::placeholder {
      color: #94A3B8;
    }
  }
`;

export const ErrorText = styled.span`
  color: #EF4444;
  font-size: 12px;
  margin-top: 2px;
`;

export const ModalSubmitBar = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 24px;
`;

export const AddParticipantButton = styled.button`
  height: 46px;
  padding: 0 36px;
  background: ${({ theme }) => theme.colors.primaryTeal};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 159, 149, 0.25);

  &:hover {
    background: ${({ theme }) => theme.colors.darkTeal};
    box-shadow: 0 6px 18px rgba(0, 159, 149, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export { ModelHeader, ModelHeaderTitle } from "../../components/Modal/Modal.styles";
