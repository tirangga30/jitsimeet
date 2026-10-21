import { useDevice } from "../../hooks/useDevice";
import DesktopFooter from "./DesktopFooter";
import MobileFooter from "./MobileFooter";

const Footer = () => {
  const { isMobile } = useDevice();
  return isMobile ? <MobileFooter /> : <DesktopFooter />;
};

export default Footer;
