import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './utils/utils';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme.ts';

declare global {
  interface Window {
    _activeMediaTracks?: MediaStreamTrack[];
  }
}

// Intercept all created MediaStreamTracks globally to guarantee we can stop them on end call
if (typeof window !== "undefined" && navigator.mediaDevices) {
  window._activeMediaTracks = window._activeMediaTracks || [];
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async function (constraints) {
    const stream = await originalGetUserMedia(constraints);
    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach((track) => {
        window._activeMediaTracks?.push(track);
        const originalStop = track.stop.bind(track);
        track.stop = function () {
          try {
            originalStop();
          } catch (e) {
            console.warn("track.stop error", e);
          }
          window._activeMediaTracks = (window._activeMediaTracks || []).filter((t) => t !== track);
        };
      });
    }
    return stream;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
