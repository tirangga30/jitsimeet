import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import toast from "react-hot-toast";

import {
  PageWrapper,
  TitleSection,
  PageHeading,
  PageSubheading,
  CardContainer,
  Column,
  ColumnHeader,
  HeaderIconCircle,
  HeaderTextGroup,
  ColumnTitle,
  ColumnSubtitle,
  StyledInput,
  WristbandBox,
  SparkleAccents,
  DividerContainer,
  OrBadge,
  ViewfinderContainer,
  CornerBracket,
  CameraPlaceholder,
  AssociateButton,
  CornerScanGuide,
  CornerDeviceBarcode,
  FooterContent,
  FooterUpperContent,
  FooterLowerContent,
} from "./BandScan.styles";
import scanLogo from "../../assets/img/refactor/Scannew.png";
import tabScan from "../../assets/img/refactor/tabscan.png";
import testCode from "../../assets/img/testcode.png";
import PageDecorations from "../../components/PageDecorations/PageDecorations";
import { errorMessage } from "../../utils/toasters";
import type { IDetectedBarcode } from "../../types/scanner";

const BandScan = () => {
  const navigate = useNavigate();
  const [idBandNumber, setIdBandNumber] = useState<string>("");
  const [hasCameraActive, setHasCameraActive] = useState<boolean>(true);

  const handleAssociateDevice = (customId?: string) => {
    const valueToCheck = customId || idBandNumber;
    const trimmed = valueToCheck?.trim();

    if (trimmed && trimmed.length === 10) {
      navigate(`/patient-identifier-information/${trimmed}`);
    } else {
      toast.dismiss();
      errorMessage("Please enter a valid 10-digit ID Band Number or scan the band!");
    }
  };

  const handleBarcodeScan = (result: IDetectedBarcode[]) => {
    if (result && result.length > 0) {
      const scannedValue = result[0]?.rawValue;
      if (scannedValue) {
        setIdBandNumber(scannedValue);
        toast.success("Barcode recognized!");
        handleAssociateDevice(scannedValue);
      }
    }
  };

  const handleTestCodeClick = () => {
    setIdBandNumber("5080483241");
    toast.success("Test code selected: 5080483241", {
      icon: "📋",
      duration: 3000,
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
      <PageDecorations />

      <PageWrapper>
        <TitleSection>
          <PageHeading>Enter or Scan Your ID Band Number</PageHeading>
          <PageSubheading>
            Please enter your ID band number or scan it to connect with your device.
          </PageSubheading>
        </TitleSection>

        <CardContainer>
          {/* Left Column: Manual CSN Entry */}
          <Column>
            <ColumnHeader>
              <HeaderIconCircle>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
                </svg>
              </HeaderIconCircle>
              <HeaderTextGroup>
                <ColumnTitle>Enter ID Band Number</ColumnTitle>
                <ColumnSubtitle>Type your ID band number in the field below.</ColumnSubtitle>
              </HeaderTextGroup>
            </ColumnHeader>

            <StyledInput
              type="text"
              maxLength={10}
              placeholder="Type CSN Number (eg. 5080483241)"
              value={idBandNumber}
              onChange={(e) => setIdBandNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAssociateDevice();
                }
              }}
            />

            <WristbandBox>
              <SparkleAccents>
                <span />
                <span />
                <span />
              </SparkleAccents>
              <img src={scanLogo} alt="Hospital Wristband Barcode" />
            </WristbandBox>

            <AssociateButton type="button" onClick={() => handleAssociateDevice()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Associate Device
            </AssociateButton>
          </Column>

          {/* Middle: OR Badge */}
          <DividerContainer>
            <OrBadge>OR</OrBadge>
          </DividerContainer>

          {/* Right Column: Camera Barcode Scan */}
          <Column>
            <ColumnHeader>
              <HeaderIconCircle>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </HeaderIconCircle>
              <HeaderTextGroup>
                <ColumnTitle>Scan the Band Here</ColumnTitle>
                <ColumnSubtitle>Scan your band's barcode using the camera.</ColumnSubtitle>
              </HeaderTextGroup>
            </ColumnHeader>

            <ViewfinderContainer>
              <CornerBracket $position="tl" />
              <CornerBracket $position="tr" />
              <CornerBracket $position="bl" />
              <CornerBracket $position="br" />

              {hasCameraActive && typeof window !== "undefined" ? (
                <div style={{ width: "100%", height: "100%", position: "relative" }}>
                  <Scanner
                    constraints={{ facingMode: "environment" }}
                    sound={false}
                    onScan={handleBarcodeScan}
                    onError={() => setHasCameraActive(false)}
                    styles={{
                      container: { width: "100%", height: "100%", borderRadius: "14px" },
                      video: {
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        borderRadius: "14px",
                      },
                    }}
                  />
                </div>
              ) : (
                <CameraPlaceholder>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                  <span>Camera Preview</span>
                </CameraPlaceholder>
              )}
            </ViewfinderContainer>
          </Column>
        </CardContainer>
      </PageWrapper>

      {/* Pojok kiri bawah layar: Ilustrasi iPad Scan (tabscan.png) */}
      <CornerScanGuide>
        <img src={tabScan} alt="iPad Scan Guide" />
      </CornerScanGuide>

      {/* Pojok kanan bawah layar: Device Name test barcode (testcode.png) */}
      <CornerDeviceBarcode>
        <FooterContent
          onClick={handleTestCodeClick}
          title="Click to use test code (5080483241)"
        >
          <FooterUpperContent>Device Name</FooterUpperContent>
          <FooterLowerContent src={testCode} alt="Device test barcode" />
        </FooterContent>
      </CornerDeviceBarcode>
    </div>
  );
};

export default BandScan;
