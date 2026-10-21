import { useDevice } from "../../hooks/useDevice";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const { isMobile } = useDevice();

  return isMobile ? <MobileNav /> : <DesktopNav />;
};

export default Navbar;
