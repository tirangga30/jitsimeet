import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import {
  Content,
  IpadContainer,
  ChatAndParticipantsPanel,
  PanelBackdrop,
  WebContainer,
} from "./MainLayout.styles";
import { ChatAndParticipants } from "../components/ChatAndParticipants/ChatAndParticipants";
import { AudioVideoSettingModal } from "../components/AudioVideoSettingModal/AudioVideoSettingModal";
import { selectpanel } from "../store/features/global/globalSlice";
import { useAppSelector } from "../store/hooks";
import { useLocation, matchPath } from "react-router-dom";

/** All valid route patterns in the app. Any path that matches none of these is a 404. */
const KNOWN_ROUTES = [
  "/",
  "/band-scan",
  "/patient-identifier-information/:id",
  "/:id/family-and-friend",
  "/:id/video-call",
  "/:id/connecting",
  "/join/:id",
  "/invite/accept",
  "/provider/:id",
];

const isKnownRoute = (pathname: string) =>
  KNOWN_ROUTES.some((pattern) => matchPath(pattern, pathname) !== null);

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const panel = useAppSelector(selectpanel);
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname.endsWith("/") ||
    location.pathname.startsWith("/invite/accept") ||
    location.pathname.startsWith("/join/") ||
    !isKnownRoute(location.pathname);
  const showWebContainer =
    location.pathname.startsWith("/invite/accept") ||
    location.pathname.includes("/provider/") ||
    location.pathname.includes("/join/");
  const useWebContainer = showWebContainer;
  const isPanelOpen =
    panel === "chat" || panel === "participants" || panel === "more";

  if (useWebContainer) {
    return (
      <WebContainer>
        <Content>
          {children}
          {isPanelOpen ? (
            <>
              <PanelBackdrop aria-hidden="true" />
              <ChatAndParticipantsPanel>
                <ChatAndParticipants />
              </ChatAndParticipantsPanel>
            </>
          ) : null}
        </Content>
        {/* Global modals — render outside layout flow so they overlay everything */}
        <AudioVideoSettingModal />
      </WebContainer>
    );
  }

  return (
    <IpadContainer $isHome={location.pathname === "/"}>
      {!hideHeaderFooter && <Navbar />}
      <Content>
        {children}
        {isPanelOpen ? (
          <>
            <PanelBackdrop aria-hidden="true" />
            <ChatAndParticipantsPanel>
              <ChatAndParticipants />
            </ChatAndParticipantsPanel>
          </>
        ) : null}
      </Content>
      {!hideHeaderFooter && <Footer />}
      {/* Global modals */}
      <AudioVideoSettingModal />
    </IpadContainer>
  );
};

export default MainLayout;
