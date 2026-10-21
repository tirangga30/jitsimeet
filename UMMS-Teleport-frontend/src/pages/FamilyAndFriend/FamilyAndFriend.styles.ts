import PhoneInput from 'react-phone-number-input';
import styled from 'styled-components';
import { CommonIcon } from '../../components/Icon/Icon.styles';

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0px;
  box-sizing: border-box;
`;

export const BodySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const StepSection = styled.div`
  display: flex;
  margin: 20px 0px 10px 0px;
  gap: 10px;
`;
export const StepSpan = styled.span`
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid white;
  font-size: ${({ theme }) => theme.typography.h3};
`;
export const TableContainer = styled.div`
  width: 100%;
  height: 250px;
  padding: 0;
  border-radius: 4px;
  overflow-y: auto;
  color: white;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: rgba(255, 255, 255, 0.12);
`;
export const TableBody = styled.tbody`
  background: ${({ theme }) => theme.colors.primary};
`;
export const HeadRow = styled.tr`
  text-align: left;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.body};
`;

export const HeadCell = styled.th`
  padding: 16px 20px;
  color: ${({ theme }) => theme.colors.white};
  position: sticky;
  top: 0;
  z-index: 2;
  background: ${({ theme }) => theme.colors.secondary};
`;

export const BodyRow = styled.tr`
  transition: 0.2s;
`;
export const BodyRowWithCenter = styled.tr`
  transition: 0.2s;
  text-align: center;
`;
export const Divider = styled.div`
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const BodyCell = styled.td<{ $withDivider?: boolean }>`
  padding: 5px 18px;
  vertical-align: middle;
  font-size: ${({ theme }) => theme.typography.body};
  color: white;
  position: relative;

  ${({ $withDivider }) =>
    $withDivider &&
    `border-right: 1px solid #FFFFFF14;
    `}
`;

export const CheckBoxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

export const CheckBoxInput = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin: 0;
`;

export const CheckMark = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid #888;
  border-radius: 3px;
  display: inline-block;
  transition: all 0.2s ease;
  position: relative;

  /* When checked → green box */
  ${CheckBoxInput}:checked + & {
    background-color: #27c152;
    border-color: #27c152;
  }

  /* Tick icon */
  ${CheckBoxInput}:checked + &::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 2px;
    width: 12px;
    height: 12px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 507.506 507.506'><path fill='white' d='M163.865,436.934c-14.406,0.006-28.222-5.72-38.4-15.915L9.369,304.966c-12.492-12.496-12.492-32.752,0-45.248l0,0c12.496-12.492,32.752-12.492,45.248,0l109.248,109.248L452.889,79.942c12.496-12.492,32.752-12.492,45.248,0l0,0c12.492,12.496,12.492,32.752,0,45.248L202.265,421.019C192.087,431.214,178.271,436.94,163.865,436.934z'/></svg>");
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

export const Paragraph = styled.p`
  font-weight: ${({ theme }) => theme.weight.normal};
  color: ${({ theme }) => theme.colors.medgray};
  font-size: ${({ theme }) => theme.typography.h3};
`;

export const AddNewButton = styled.button`
  padding: 5px;
  width: 120px;
  height: 45px;
  border: none;
  margin-left: 20px;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.green};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.bold};
  &:hover {
    background-color: ${({ theme }) => theme.colors.green};
    color: ${({ theme }) => theme.colors.white};
  }
  background-color: ${({ theme }) => theme.colors.white};
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
  margin-right: 10px;
`;

export const FooterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
`;

export const ModelHeader = styled.div<{ $isprimaryBackground: boolean }>`
  display: flex;
  justify-content: space-between;
  background: ${({ $isprimaryBackground, theme }) =>
    $isprimaryBackground ? theme.colors.primary : theme.colors.secondary};
  padding: 15px;
`;

export const ModelHeaderTitle = styled.p`
  font-style: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

export const ModelBody = styled.div`
  display: grid;
  grid-template-columns: auto;
  padding: 5px;
  gap: 5px;
`;
export const ModelFooter = styled.div`
  display: flex;
  justify-content: center;
`;

export const ModelPrimaryButton = styled.button`
  padding: 15px 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: ${({ theme }) => theme.weight.normal};
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #004f43;
  }

  background-color: ${({ theme }) => theme.colors.green};
  border: 1px solid #ffffff;
  margin-top: 40px;
`;
export const Form = styled.form`
  width: 90%;
  background: ${({ theme }) => theme.colors.white};
  margin: 20px auto;
  border-radius: 6px;
`;

export const FormWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: start;
  gap: 24px 40px;
  /* margin-top: 20px; */
  background-color: ${({ theme }) => theme.colors.white} !important;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Input = styled.input`
  padding: 12px 14px;
  font-size: 16px;
  color: #2b2b2b;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: #f3f6f9;
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
  &[type='number'] {
    -moz-appearance: textfield;
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.secondary};
  }
`;
export const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0px;
`;

export const ErrorText = styled.span`
  color: red;
  font-size: 12px;
`;

export const Select = styled.select`
  padding: 12px 14px;
  font-size: 16px;
  color: #2b2b2b;
  border-radius: 2px;
  background: #eef2f5;
  border: 1px solid #cecece;
  width: 240px;
  &:focus {
    outline: none;
    border-color: #376ea6;
  }
`;

export const InvitationSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 40px 0px 20px 0px;
`;

export const TickIcon = styled(CommonIcon)`
  width: 55px;
  height: 55px;
  color: ${({ theme }) => theme.colors.white};
`;
export const InvitationHeading = styled.h1`
  font-weight: ${({ theme }) => theme.weight.bold};
  border-bottom: 1px solid white;
  color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid white;
  font-size: ${({ theme }) => theme.typography.h1};
`;
export const InvitationSubHeading = styled.p`
  font-weight: ${({ theme }) => theme.weight.normal};
  color: ${({ theme }) => theme.colors.medgray};
  font-size: 22px;
`;

export const StyledPhoneInput = styled(PhoneInput)`
  width: 100%;

  .PhoneInputInput {
    padding: 12px 14px;
    font-size: 16px;
    color: #2b2b2b;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    background: #f3f6f9;
    width: 100%;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.secondary};
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.secondary};
    }
  }
`;
