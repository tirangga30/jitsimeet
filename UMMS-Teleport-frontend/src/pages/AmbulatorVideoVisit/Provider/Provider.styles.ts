import styled from "styled-components";

export const ProviderContainer = styled.div`
  /* max-width: 1440px; */
  width: 100%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  background: white;
`;

export const ProviderHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.navy};
  padding: 10px 20px;
  text-align: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(16, 27, 75, 0.04);

  h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }
`;

export const PatientSection = styled.div`
  background: transparent;
  padding: 0;
  border-radius: 0;
  margin-bottom: 12px;
`;

export const PatientCard = styled.div`
  display: flex;
  gap: calc(15px + 1vw);
  align-items: flex-start;
  background: white;
  padding: calc(15px + 1vw) calc(20px + 2vw);
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PatientPhoto = styled.div`
  flex-shrink: 0;
  position: relative;

  img {
    width: 170px;
    height: 160px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const EditIconButton = styled.button`
  position: absolute;
  bottom: -10px;
  right: -15px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: 16px;
  padding: 0;

  img {
    width: 14px;
    height: 22px;
    object-fit: contain;
  }

  &:hover {
    background: #1565c0;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const PatientDetails = styled.div`
  flex: 1;

  h2 {
    margin: 0 0 18px 0;
    color: #003366;
    font-size: 22px;
    font-weight: 600;
  }
`;

export const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(120px + 1.5vw), 1fr));
  /* gap: calc(12px + 1vw); */
  margin-bottom: 24px;
  margin-top: 20px;
  font-size: 14px;

  div {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    display: flex;
    flex-direction: column;
    font-weight: ${({ theme }) => theme.weight.bold};
    gap: 10px;
    strong {
      color: #333;
      text-decoration: none !important;
      font-weight: ${({ theme }) => theme.weight.normal};
      font-size: 13px;
    }
  }

  div::after {
    content: attr(data-value);
    text-decoration: underline;
  }
`;

export const DetailValue = styled.span`
  /* text-decoration: underline; */
  color: ${({ theme }) => theme.colors.primary};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Title = styled.h3`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 14px 20px;
  margin: 0;
  font-size: 14px;
  border-radius: 4px 4px 0 0;
  font-weight: ${(props) => props.theme.weight.bold};
  letter-spacing: 0.5px;
  width: fit-content;
`;

export const PatientInfoSection = styled.div`
  background: #eef2f5;
  padding: 0;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
  h3 {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 10px 15px;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: fit-content;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(180px + 2vw), 1fr));
  gap: calc(10px + 0.5vw);
  padding: 12px;
  align-items: center;
  height: auto;
`;

export const InfoItem = styled.div`
  display: flex;
  /* flex-direction: column; */
  gap: 12px;
  padding: 0;
  justify-content: center;
  label {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.weight.semibold};
    letter-spacing: 0.3px;
  }

  span {
    font-size: 16px;
    color: #2b2b2b;
    font-weight: ${({ theme }) => theme.weight.bold};
  }
`;

export const StatusBadge = styled.span`
  color: #d32f2f;
  font-weight: 600;
  font-size: 16px;
`;

export const StatusYes = styled.span`
  color: #388e3c;
  font-weight: 600;
  font-size: 16px;
`;

export const Section = styled.div`
  background: white;
  padding: 0;
  border-radius: 4px;
  margin-bottom: 12px;
  overflow: hidden;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0;
  font-size: 14px;
  box-shadow: 0px 0px 8px 4px #00000005;
  thead {
    background: #eef2f5;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #eef2f5;
    background-clip: padding-box;
    text-align: left;
    padding: 12px 30px;
    font-weight: ${({ theme }) => theme.weight.bold};
    font-size: 12px;
    color: #2b2b2b;
    letter-spacing: 0.3px;
  }

  td {
    padding: 12px 30px;
    color: #333;
  }

  tbody tr {
    /* &:hover {
      background: #f9f9f9;
    } */

    &:last-child td {
      border-bottom: none;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;

    th,
    td {
      padding: 10px 12px;
    }
  }
`;

export const TableContainer = styled.div`
  max-height: 220px;
  overflow-y: auto;
  overscroll-behavior: contain;
  isolation: isolate;
  border: 1px solid #e4e4e4;
  border-radius: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`;

export const EmptyTableCell = styled.td`
  box-sizing: border-box;
  height: 180px;
  text-align: center;
  vertical-align: middle;
  padding: 12px 30px;
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
`;

export const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonSuccess = styled(Button).attrs<{
  type?: string;
}>((props) => ({
  type: props.type || "send",
}))`
  padding: 10px;
  background: ${(props) =>
    props.type === "resend"
      ? props.theme.colors.white
      : props.theme.colors.green};
  color: ${(props) =>
    props.type !== "resend"
      ? props.theme.colors.white
      : props.theme.colors.green};
  border: ${(props) =>
    props.type !== "resend"
      ? `1px solid ${props.theme.colors.white}`
      : `1px solid ${props.theme.colors.green}`};
  padding: 8px 14px;
  font-size: 12px;

  &:hover {
    background: ${(props) =>
      props.type !== "resend"
        ? `${props.theme.colors.darkgreen}`
        : ` ${props.theme.colors.darkgreen}`};
  }
`;

export const PatientInfo = styled.div`
  padding: 0px calc(20px + 1.5vw);
`;
export const UserSection = styled.div`
  display: flex;
  gap: calc(20px + 1vw);
  align-items: flex-start;
  padding: 12px calc(20px + 1.5vw);

  > div {
    flex: 1;
    min-width: 320px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 4px;
  padding: 40px;
  max-width: 560px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

export const ModalIcon = styled.div`
  margin-bottom: 24px;
  font-size: 48px;

  img {
    width: 64px;
    height: 64px;
  }
`;

export const ModalQuestion = styled.h2`
  margin: 0 0 32px 0;
  font-size: 30px;
  font-weight: 600;
  color: #484644;
  line-height: 1.4;
`;

export const ModalButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  /* flex-wrap: wrap; */
`;

export const ParticipantModalBody = styled.div`
  padding: 16px;
  overflow: auto;
`;

export const ParticipantSearch = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #707070;
  background: #f4f4f4;

  border-radius: 2px;
  padding: 10px 12px 10px 38px;
  font-size: 13px;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -1px;
  }
`;

export const ParticipantSearchField = styled.div`
  position: relative;
  margin-bottom: 16px;

  img {
    position: absolute;
    top: 50%;
    left: 12px;
    width: 16px;
    height: 16px;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const ParticipantTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #d9d9d9;
  font-size: 12px;

  th {
    padding: 12px 10px;
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    text-align: left;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 2;
    background-clip: padding-box;
  }

  td {
    padding: 12px 10px;
  }

  tbody tr {
    cursor: pointer;
    /* background: #f1f5f7; */
    background: #eef2f5;

    &:nth-child(even) {
      background: #ffffff;
    }

    &:hover {
      background: #d8eee9;
    }
  }

  tbody td[colspan] {
    text-align: center;
    cursor: default;
  }
`;

export const ParticipantTableContainer = styled.div`
  max-height: 250px;
  overflow: auto;
  overscroll-behavior: contain;
  isolation: isolate;
  border: 1px solid #d9d9d9;
  ${ParticipantTable} {
    border: 0;
  }
`;

export const ParticipantTableRow = styled.tr<{ $isSelected: boolean }>`
  ${({ $isSelected, theme }) =>
    $isSelected &&
    `
      background: ${theme.colors.green} !important;
      color: ${theme.colors.white};
    `}
`;

export const ParticipantModalActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const FamilyParticipantForm = styled.form`
  padding: 32px 28px;
`;

export const FamilyParticipantField = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;

  label {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    font-weight: ${({ theme }) => theme.weight.bold};
  }

  input,
  select {
    box-sizing: border-box;
    width: 100%;
    min-height: 47px;
    padding: 10px 20px;
    border: 1px solid #c8ced1;
    border-radius: 2px;
    background: #f1f4f5;
    color: #333;
    font-size: 16px;
    font-weight: ${({ theme }) => theme.weight.semibold};
  }

  input:focus,
  select:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -1px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

export const FamilyParticipantActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 38px;
`;

export const EditFamilyButton = styled.button`
  display: inline-grid;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  place-items: center;
  vertical-align: middle;
  border: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  img {
    width: 11px;
    height: 14px;
    object-fit: contain;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const DeviceConfirmationBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 32px 38px;
  text-align: center;
`;

export const DeviceConfirmationQuestion = styled.h2`
  margin: 24px 0 22px;
  color: #4b4b4b;
  font-size: 20px;
  font-weight: ${({ theme }) => theme.weight.bold};
`;

export const DeviceConfirmationActions = styled.div`
  display: flex;
  gap: 8px;

  button {
    min-width: 124px;
  }
`;
