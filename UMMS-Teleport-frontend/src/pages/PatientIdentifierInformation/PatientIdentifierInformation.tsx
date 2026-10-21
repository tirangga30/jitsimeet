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
export const PatientIdentifierInformation = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] =
    useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
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
            <img src={profile} alt="patient" />
          </PatientImageWrapper>

          <BasicInfoSection>
            <SectionTitle>Basic Patient Info</SectionTitle>

            <InfoRow>
              <span className="label">Patient Name</span>
              <span className="value">Ashley Testpatient</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Gender</span>
              <span className="value">Female</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Age</span>
              <span className="value">33 Y.O.</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Date Of Brith</span>
              <span className="value">Aug 2, 1989</span>
            </InfoRow>
          </BasicInfoSection>

          <Divider />

          <AdditionalInfoSection>
            <SectionTitle>Additional Info</SectionTitle>

            <InfoRow>
              <span className="label">MRN</span>
              <span className="value">3001330978</span>
            </InfoRow>

            <InfoRow>
              <span className="label">CSN</span>
              <span className="value">5088152596</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Unit</span>
              <span className="value">Room 302</span>
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
