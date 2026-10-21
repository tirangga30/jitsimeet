import { useNavigate } from "react-router-dom";
import {
  PageWrapper,
  Card,
  LogoWrapper,
  Title,
  Description,
  ActionsWrapper,
  HomeActionButton,
  IllustrationWrapper,
} from "./Home.styles";
import logoImg from "../../assets/img/newlogo.png";
import devicesIllustration from "../../assets/img/Group 625866.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Card>
        {/* Logo */}
        <LogoWrapper>
          <img src={logoImg} alt="UMMS Teleport" />
        </LogoWrapper>

        {/* Title */}
        <Title>Teleport Video Visit</Title>

        {/* Description */}
        <Description>
          Connect securely with your healthcare team, family, and specialists through high-definition telehealth visits.
        </Description>

        {/* Actions */}
        <ActionsWrapper>
          <HomeActionButton onClick={() => navigate("/band-scan")}>
            Start Patient Visit
          </HomeActionButton>
          <HomeActionButton $variant="secondary" onClick={() => navigate("/band-scan")}>
            Scan Patient Band
          </HomeActionButton>
        </ActionsWrapper>

        {/* Devices Illustration */}
        <IllustrationWrapper>
          <img src={devicesIllustration} alt="Supported devices layout" />
        </IllustrationWrapper>
      </Card>
    </PageWrapper>
  );
}
