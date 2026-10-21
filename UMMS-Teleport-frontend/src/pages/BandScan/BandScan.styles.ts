import styled from 'styled-components';

export const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  min-height: 81vh;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  box-sizing: border-box;
  gap: 15;
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 2vh;
  margin-bottom: 3vh;
  width: 100%;
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;
export const HeaderMid = styled.div`
  flex: 2;
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
  text-align: center;

  p {
  }
`;

export const HeaderMainHeading = styled.h1`
  font-weight: ${({ theme }) => theme.weight.bold};
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.white};
`;
export const HeaderMainPara = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  opacity: 0.8;
  font-weight: ${({ theme }) => theme.weight.normal};
  color: ${({ theme }) => theme.colors.lightgray};
`;

export const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
`;

export const FormSection = styled.div`
  width: clamp(60%, 65%, 70%);
  margin: 0 auto clamp(30px, 4vh, 50px) auto;
`;
export const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.h3};
  font-weight: ${({ theme }) => theme.weight.semibold};
`;
export const FormInput = styled.input.attrs({
  type: 'number',
})`
  width: 100%;
  padding: clamp(12px, 1.6vh, 16px);
  border-radius: 4px;
  border: 1px solid #e4dad7;
  outline: none;
  color: ${({ theme }) => theme.colors.black} !important;
  font-size: ${({ theme }) => theme.typography.body};

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
    border-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.white};
  }
`;

export const FormOR = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.lightgray};
  font-weight: ${({ theme }) => theme.weight.medium};
  font-size: ${({ theme }) => theme.typography.body};
`;

export const ScanSection = styled.div`
  display: flex;
  /* justify-content: start; */
  align-items: center;
  gap: clamp(24px, 3vw, 48px);
  /* margin-bottom: clamp(30px, 4vh, 50px); */
`;

export const ScanLogo = styled.img`
  width: 18vw;
  border-radius: 4px;
  object-fit: contain;
  box-shadow: 0 0 5px ${({ theme }) => theme.colors.gray};
`;

export const ScanRight = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.white};
`;
export const ScanHeading = styled.h3`
  margin-bottom: 0.5vh;
  font-weight: ${({ theme }) => theme.weight.semibold};
`;

export const ScanPara = styled.h3`
  color: ${({ theme }) => theme.colors.lightgray};
  font-size: ${({ theme }) => theme.typography.small};
  font-weight: ${({ theme }) => theme.weight.normal};
  opacity: 0.8;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ScannerBox = styled.div`
  width: 100%;
  height: 16vh;
  background: repeating-conic-gradient(#444 0% 25%, #777 0% 50%) 50% / clamp(24px, 3vw, 36px)
    clamp(24px, 3vw, 36px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.red};
  border-radius: 4px;
`;

export const BottomSection = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
`;

export const FooterSection = styled.div`
  width: 100%;

  display: flex;
  align-items: flex-end;
`;
export const FooterLeft = styled.div`
  flex: 1;
  margin-bottom: -5.5vh;
`;
export const FooterLeftImg = styled.img`
  height: auto;
  width: 20vw;
  object-fit: contain;
`;

export const FooterRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
`;
export const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FooterUpperContent = styled.span`
  color: ${({ theme }) => theme.colors.lightgray};
  opacity: 0.8;
  font-size: ${({ theme }) => theme.typography.body};
  margin: ${({ theme }) => theme.spacing.sm} 0px;
`;
export const FooterLowerContent = styled.img`
  height: 8.5vh;
  object-fit: contain;
`;
