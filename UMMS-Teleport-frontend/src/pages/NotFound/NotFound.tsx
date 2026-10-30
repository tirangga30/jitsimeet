import { useNavigate } from "react-router-dom";
import {
  PageWrapper,
  Card,
  LogoWrapper,
  IllustrationContainer,
  ErrorCode,
  Title,
  Description,
  BackButton,
} from "./NotFound.styles";
import logoImg from "../../assets/img/logo.png";
import PageDecorations from "../../components/PageDecorations/PageDecorations";
import {
  Doc404Illustration,
  PatientNotFoundIllustration,
} from "../../components/Illustrations/StatusIllustrations";

interface NotFoundProps {
  errorCode?: string;
  title?: string;
  description?: string;
}

export default function NotFound({
  errorCode = "404 — PAGE NOT FOUND",
  title = "We couldn't find that page",
  description = "The page you're looking for doesn't exist or may have been moved. Please check the link and try again.",
}: NotFoundProps) {
  const navigate = useNavigate();

  const isPatientNotFound =
    errorCode?.toLowerCase().includes("patient") ||
    title?.toLowerCase().includes("patient");

  return (
    <PageWrapper>
      <PageDecorations />

      <Card>
        {/* UMMS Teleport Logo */}
        <LogoWrapper>
          <img src={logoImg} alt="UMMS Teleport" />
        </LogoWrapper>

        {/* Dedicated Illustration matching reference designs */}
        <IllustrationContainer>
          {isPatientNotFound ? (
            <PatientNotFoundIllustration size={170} />
          ) : (
            <Doc404Illustration size={170} />
          )}
        </IllustrationContainer>

        {/* Error Code Tagline */}
        <ErrorCode>{errorCode}</ErrorCode>

        {/* Heading */}
        <Title>{title}</Title>

        {/* Description */}
        <Description>{description}</Description>

        {/* Return Button */}
        <BackButton id="not-found-go-home" onClick={() => navigate("/")}>
          ← Go Home
        </BackButton>
      </Card>
    </PageWrapper>
  );
}
