import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import { PatientIdentifierInformation } from "../pages/PatientIdentifierInformation/PatientIdentifierInformation";
import { FamilyAndFriend } from "../pages/FamilyAndFriend/FamilyAndFriend";
import VideoCall from "../pages/VideoCall/VideoCall";
import Connecting from "../pages/Connecting/Connecting";
import { PageTransition } from "./PageTransition";
import InviteAccept from "../pages/InviteAccept/InviteAccept";
import BandScan from "../pages/BandScan/BandScan";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Provider from "../pages/AmbulatorVideoVisit/Provider/Provider";
import JoinMeeting from "../pages/JoinMeeting/JoinMeeting";
import { getDeviceType } from "../utils/utils";
import { useEffect } from "react";

const AnimatedRoutes = () => {
  const location = useLocation();
  const isPadApp = getDeviceType() === "ipad-app";
  const navigate = useNavigate();

  useEffect(() => {
    if (isPadApp && location.pathname === "/") {
      navigate("/band-scan", { replace: true });
    }
  }, [isPadApp, location.pathname, navigate]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition animation="scale">
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/band-scan"
          element={
            <PageTransition animation="scale">
              <BandScan />
            </PageTransition>
          }
        />

        <Route
          path="/patient-identifier-information/:id"
          element={
            <PageTransition animation="scale">
              <PatientIdentifierInformation />
            </PageTransition>
          }
        />

        <Route
          path="/:id/family-and-friend"
          element={
            <PageTransition animation="scale">
              <FamilyAndFriend />
            </PageTransition>
          }
        />

        <Route
          path="/:id/video-call"
          element={
            <PageTransition disablePaths={["video-call"]}>
              <VideoCall />
            </PageTransition>
          }
        />

        <Route
          path="/:id/connecting"
          element={
            <PageTransition animation="scale">
              <Connecting />
            </PageTransition>
          }
        />

        <Route
          path="/join/:id"
          element={
            <PageTransition animation="scale">
              <JoinMeeting />
            </PageTransition>
          }
        />
        <Route
          path="/invite/accept"
          element={
            <PageTransition animation="scale">
              <InviteAccept />
            </PageTransition>
          }
        />
        <Route
          path="/provider/:id"
          element={
            <PageTransition animation="scale">
              <Provider />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition animation="scale">
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRouter;
