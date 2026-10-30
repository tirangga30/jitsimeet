import {
  PageWrapper,
  Card,
  LogoWrapper,
  Title,
  Description,
  IllustrationWrapper,
} from "./Home.styles";
import logoImg from "../../assets/img/logo.png";
import devicesIllustration from "../../assets/img/Group 625866.png";
import PageDecorations from "../../components/PageDecorations/PageDecorations";

export default function Home() {
  return (
    <PageWrapper>
      <PageDecorations />
      <Card>
        {/* Logo */}
        <LogoWrapper>
          <img src={logoImg} alt="UMMS Teleport" />
        </LogoWrapper>

        {/* Title */}
        <Title>Teleport Video Visit</Title>

        {/* Description */}
        <Description>
          Your Teleport session has concluded. Thank you for trusting us with
          your care. If you have any questions, please reach out to your care
          team.
        </Description>

        {/* Devices Illustration */}
        <IllustrationWrapper>
          <img src={devicesIllustration} alt="Teleport Video Visit supported devices" />
        </IllustrationWrapper>
      </Card>
    </PageWrapper>
  );
}
