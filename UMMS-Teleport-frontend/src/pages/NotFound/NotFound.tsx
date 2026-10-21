import { useNavigate } from "react-router-dom";
import {
  PageWrapper,
  Card,
  LogoWrapper,
  ErrorCode,
  Title,
  Description,
  BackButton,
} from "./NotFound.styles";
import logoImg from "../../assets/img/newlogo.png";

interface NotFoundProps {
  errorCode?: string;
  title?: string;
  description?: string;
}

export default function NotFound({
  errorCode = "404 — Page Not Found",
  title = "We couldn't find that page",
  description =
    "The page you're looking for doesn't exist or may have been moved. Please check the link and try again.",
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Card>
        {/* Logo */}
        <LogoWrapper>
          <img src={logoImg} alt="UMMS Teleport" />
        </LogoWrapper>

        {/* Error indicator */}
        <ErrorCode>{errorCode}</ErrorCode>

        {/* Title */}
        <Title>{title}</Title>

        {/* Description */}
        <Description>{description}</Description>

        {/* Back button */}
        <BackButton id="not-found-go-home" onClick={() => navigate("/")}>
          ← Go Home
        </BackButton>
      </Card>
    </PageWrapper>
  );
}
