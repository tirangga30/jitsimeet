import { createPortal } from "react-dom";
import logo from "../../assets/img/TeleportLogo.png";
import {
  Wrapper,
  LoaderContainer,
  LogoWrapper,
  Ring,
  Logo,
  LoadingText,
} from "./Loader.styles";

export default function Loader() {
  return createPortal(
    <Wrapper>
      <LoaderContainer>
        <LogoWrapper>
          <Ring />
          <Logo src={logo} alt="UMMS TELEPORT" />
        </LogoWrapper>

        <LoadingText>Loading...</LoadingText>
      </LoaderContainer>
    </Wrapper>,
    document.body,
  );
}
