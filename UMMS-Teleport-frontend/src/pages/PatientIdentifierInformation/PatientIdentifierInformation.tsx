import { useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../../components";
import {
  AddButton,
  AdditionalInfoSection,
  BasicInfoSection,
  ButtonsContainer,
  CloseButton,
  Divider,
  FooterSection,
  Icon,
  InfoRow,
  PageWrapper,
  PatientIdentifierInformationSection,
  PatientImageWrapper,
  SectionTitle,
  StyledDropdown,
} from "./PatientIdentifierInformation.styles";
import profile from "../../assets/img/profile.jpg";
import peopleIcon from "../../assets/icons/people.png";
import telephoneIcon from "../../assets/icons/telephone.png";

import interIcon from "../../assets/icons/interpreter-.png";
import { useState } from "react";
import { languages } from "../../utils/utils";
import { Dropdown } from "primereact/dropdown";
import {
  HeaderLeft,
  HeaderMainHeading,
  HeaderMid,
  HeaderRight,
  HeaderSection,
} from "../BandScan/BandScan.styles";
import { useGetPatientQuery } from "../../store/services/patientApi";
import { formatDOB } from "../../utils/utils";

export const PatientIdentifierInformation = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] =
    useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const { data: patient, isLoading } = useGetPatientQuery(id || "5080483241");

  const displayName = patient
    ? `${patient.firstName} ${patient.lastName}`.trim()
    : "Ashley Testpatient";
  const displayGender = patient?.gender || "Female";
  const displayAge = patient?.age ? `${patient.age} Y.O.` : "33 Y.O.";
  const displayDob = patient?.dob ? formatDOB(patient.dob) : "Aug 2, 1989";
  const displayMrn = patient?.MRN || "3001330978";
  const displayCsn = patient?.CBEN || id || "5080483241";
  const displayUnit = patient?.deviceAssociated || "Room 302";
  const displayImage = patient?.imageUrl || profile;

  return (
    <Container hasPadding={true} hasPaddingTop={false}>
      <PageWrapper>
        <HeaderSection>
          <HeaderLeft />
          <HeaderMid>
            <HeaderMainHeading>
              Patient Identifier Information
            </HeaderMainHeading>
          </HeaderMid>
          <HeaderRight></HeaderRight>
        </HeaderSection>
        <PatientIdentifierInformationSection>
          <PatientImageWrapper>
            <img src={displayImage} alt="patient" />
          </PatientImageWrapper>

          <BasicInfoSection>
            <SectionTitle>Basic Patient Info</SectionTitle>

            <InfoRow>
              <span className="label">Patient Name</span>
              <span className="value">{isLoading ? "Loading..." : displayName}</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Gender</span>
              <span className="value">{displayGender}</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Age</span>
              <span className="value">{displayAge}</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Date Of Birth</span>
              <span className="value">{displayDob}</span>
            </InfoRow>
          </BasicInfoSection>

          <Divider />

          <AdditionalInfoSection>
            <SectionTitle>Additional Info</SectionTitle>

            <InfoRow>
              <span className="label">MRN</span>
              <span className="value">{displayMrn}</span>
            </InfoRow>

            <InfoRow>
              <span className="label">CSN</span>
              <span className="value">{displayCsn}</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Unit</span>
              <span className="value">{displayUnit}</span>
            </InfoRow>
          </AdditionalInfoSection>
        </PatientIdentifierInformationSection>
        <ButtonsContainer>
          {/* <Button
            bgcolor='#0E4B71'
            color='#FFFFFF'
            hasIcon
            iconWidth={20}
            iconHeight={20}
            src={peopleIcon}
            border='1px solid #ffffff'
            onClick={() => navigate(`/provider-meeting/${id}`)}
          >
            Provider Meeting Console
          </Button> */}

          <Button
            bgcolor="#027564"
            color="#FFFFFF"
            hasIcon
            iconWidth={24}
            iconHeight={16}
            src={peopleIcon}
            border="1px solid #ffffff"
            onClick={() => navigate(`/${id}/family-and-friend`)}
          >
            Connect with Family or Friends
          </Button>

          {showLanguageDropdown ? (
            <>
              <StyledDropdown>
                <Dropdown
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.value)}
                  options={languages}
                  optionLabel="name"
                  placeholder="Select a Language"
                />
              </StyledDropdown>

              <AddButton>
                <Icon src={telephoneIcon} alt="people" width={20} height={18} />
                Add
              </AddButton>

              <CloseButton onClick={() => setShowLanguageDropdown(false)}>
                Close
              </CloseButton>
            </>
          ) : (
            <Button
              bgcolor="#05324E"
              hoverBg="#0E4B71"
              color="#FFFFFF"
              hasIcon
              iconWidth={24}
              iconHeight={20}
              src={interIcon}
              border="1px solid #ffffff"
              onClick={() => setShowLanguageDropdown(true)}
            >
              Add Interpreter
            </Button>
          )}
        </ButtonsContainer>

        <FooterSection>
          <Button
            bgcolor="#D42A2A"
            hoverBg="#AD1111"
            color="#FFFFFF"
            border="1px solid #ffffff"
            onClick={() => navigate("/")}
          >
            De-associate Device With this Patient
          </Button>
        </FooterSection>
      </PageWrapper>
    </Container>
  );
};
