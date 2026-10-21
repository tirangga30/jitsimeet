import {
  PageWrapper,
  HeaderSection,
  FormSection,
  ScanSection,
  ScanRight,
  BottomSection,
  ScanLogo,
  HeaderMid,
  HeaderRight,
  HeaderLeft,
  FooterSection,
  FooterLeft,
  FooterRight,
  FooterUpperContent,
  FooterLowerContent,
  FooterContent,
  HeaderMainHeading,
  HeaderMainPara,
  FormLabel,
  FormInput,
  FormOR,
  ScanHeading,
  ScanPara,
  ScannerBox,
  FooterLeftImg,
} from './BandScan.styles';
import { Button, Container } from '../../components';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IDetectedBarcode } from '../../types/scanner';
import scanLogo from '../../assets/img/scan.png';
import ipadScan from '../../assets/img/home-vector2.png';
import testCode from '../../assets/img/testcode.png';
import { errorMessage } from '../../utils/toasters';
import toast from 'react-hot-toast';

const BandScan = () => {
  const navigate = useNavigate();
  const [idBandNumber, setIdBandNumber] = useState<string>();
  const handleAssociateDevice = () => {
    const idLength = idBandNumber?.length;

    if (idBandNumber && idLength === 10) {
      navigate(`/patient-identifier-information/5080483241`);
    } else {
      toast.dismiss();
      errorMessage('Please enter ID Band Number or Scan the band!');
    }
  };

  return (
    <Container hasPadding={false}>
      <PageWrapper>
        <HeaderSection>
          <HeaderLeft />
          <HeaderMid>
            <HeaderMainHeading>Enter or Scan Your ID Band Number</HeaderMainHeading>
            <HeaderMainPara>
              Please enter your ID band number or scan it to connect with your device.
            </HeaderMainPara>
          </HeaderMid>
          <HeaderRight>
            .
            <Button bgcolor='#027564' color='#FFFFFF'>
              Need Help?
            </Button>
          </HeaderRight>
        </HeaderSection>

        <FormSection>
          <FormLabel>Enter ID Band Number</FormLabel>
          <FormInput
            type='text'
            min={10}
            max={10}
            placeholder='Type CSN Number (eg. 5080483241)'
            value={idBandNumber}
            onChange={(e) => setIdBandNumber(e.target.value)}
          />
          <FormOR className='or'>Or</FormOR>
          <ScanSection>
            <ScanLogo src={scanLogo} alt='scanlogo' />

            <ScanRight>
              <ScanHeading>Scan the Band Here</ScanHeading>
              <ScanPara>Scan your band's barcode using the camera.</ScanPara>
              <ScannerBox>
                {typeof window !== 'undefined' && (
                  <Scanner
                    constraints={{ facingMode: 'environment' }}
                    sound={false}
                    onScan={(result: IDetectedBarcode[]) => {
                      if (result?.length > 0) {
                        // console.log('Scanned:', result[0]?.rawValue);
                      }
                    }}
                    // onError={(error) => console.log('Scanner Error:', error)}
                    styles={{
                      container: { width: '100%', height: '100%' },
                      video: {
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      },
                    }}
                  />
                )}
              </ScannerBox>
            </ScanRight>
          </ScanSection>
        </FormSection>

        <BottomSection>
          <Button
            bgcolor='#027564'
            color='#FFFFFF'
            iconWidth={24}
            iconHeight={16}
            border='1px solid #ffffff'
            onClick={() => handleAssociateDevice()}
            width='15vw'

          // disabled={idBandNumber?.toString().length === 10 ? false : true}
          >
            Associate Device
          </Button>
        </BottomSection>

        <FooterSection>
          <FooterLeft>
            <FooterLeftImg src={ipadScan} alt='ipadscaner' />
          </FooterLeft>
          <FooterRight>
            <FooterContent>
              <FooterUpperContent>Device Name</FooterUpperContent>
              <FooterLowerContent src={testCode} alt='testcode' />
            </FooterContent>
          </FooterRight>
        </FooterSection>
      </PageWrapper>
    </Container>
  );
};

export default BandScan;
