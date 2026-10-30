import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";

import {
  PageWrapper,
  TitleSection,
  BadgeIconContainer,
  SparkleRay,
  PageHeading,
  PageSubheading,
  MainCard,
  PhotoWrapper,
  InfoSection,
  SectionHeader,
  SectionIconCircle,
  SectionTitle,
  InfoRow,
  VerticalDivider,
  AdditionalSection,
  ActionButtonBar,
  LeftActionGroup,
  ConnectButton,
  InterpreterButton,
  DeassociateButton,
  LanguageDropdownGroup,
  ActionMiniButton,
} from "./PatientIdentifierInformation.styles";
import profile from "../../assets/img/profile.jpg";
import PageDecorations from "../../components/PageDecorations/PageDecorations";
import { languages } from "../../utils/utils";

export const PatientIdentifierInformation = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleAddInterpreter = () => {
    if (selectedLanguage) {
      toast.success("Interpreter requested successfully");
      setShowLanguageDropdown(false);
    } else {
      toast.error("Please select a language first");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100%" }}>
      <PageDecorations />

      <PageWrapper>
        {/* Title Section with Teal Badge and Sparkles */}
        <TitleSection>
          <BadgeIconContainer>
            <SparkleRay>
              <span />
              <span />
              <span />
            </SparkleRay>
            <svg
              className="badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </BadgeIconContainer>
          <PageHeading>Patient Identifier Information</PageHeading>
          <PageSubheading>Review the patient's information below.</PageSubheading>
        </TitleSection>

        {/* Main Card with Patient Info */}
        <MainCard>
          {/* Column 1: Patient Photo */}
          <PhotoWrapper>
            <img src={profile} alt="Patient Portrait" />
          </PhotoWrapper>

          {/* Column 2: Basic Patient Info */}
          <InfoSection>
            <SectionHeader>
              <SectionIconCircle>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </SectionIconCircle>
              <SectionTitle>Basic Patient Info</SectionTitle>
            </SectionHeader>

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
              <span className="label">Date Of Birth</span>
              <span className="value">Aug 2, 1989</span>
            </InfoRow>
          </InfoSection>

          {/* Vertical Divider */}
          <VerticalDivider />

          {/* Column 3: Additional Info */}
          <AdditionalSection>
            <SectionHeader>
              <SectionIconCircle>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </SectionIconCircle>
              <SectionTitle>Additional Info</SectionTitle>
            </SectionHeader>

            <InfoRow>
              <span className="label">MRN</span>
              <span className="value">3001330978</span>
            </InfoRow>

            <InfoRow>
              <span className="label">CSN</span>
              <span className="value">{id || "5088152596"}</span>
            </InfoRow>

            <InfoRow>
              <span className="label">Unit</span>
              <span className="value">Room 302</span>
            </InfoRow>
          </AdditionalSection>
        </MainCard>

        {/* Action Button Bar */}
        <ActionButtonBar>
          <LeftActionGroup>
            <ConnectButton
              type="button"
              onClick={() => navigate(`/${id || "5080483241"}/family-and-friend`)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Connect with Family or Friends
            </ConnectButton>

            {showLanguageDropdown ? (
              <LanguageDropdownGroup>
                <Dropdown
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.value)}
                  options={languages}
                  optionLabel="name"
                  placeholder="Select a Language"
                />
                <ActionMiniButton $variant="confirm" type="button" onClick={handleAddInterpreter}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Add
                </ActionMiniButton>
                <ActionMiniButton $variant="cancel" type="button" onClick={() => setShowLanguageDropdown(false)}>
                  Close
                </ActionMiniButton>
              </LanguageDropdownGroup>
            ) : (
              <InterpreterButton
                type="button"
                onClick={() => setShowLanguageDropdown(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                Add Interpreter
              </InterpreterButton>
            )}
          </LeftActionGroup>

          <DeassociateButton
            type="button"
            onClick={() => {
              toast.success("Device de-associated successfully");
              navigate("/");
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            De-associate Device With this Patient
          </DeassociateButton>
        </ActionButtonBar>
      </PageWrapper>
    </div>
  );
};

export default PatientIdentifierInformation;
