import { createGlobalStyle } from "styled-components";
import bgNew from "../assets/img/refactor/bgnew.jpeg";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100vh;
    height: 100dvh;
    width: 100%;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  #root {
    height: 100vh;
    height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Safe-area padding helpers for mobile notches/home indicators */
  .safe-top {
    padding-top: env(safe-area-inset-top, 0px);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .safe-x {
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
  }

  /* Prevent auto-zoom on input focus on iOS Safari */
  input, select, textarea, button {
    font-size: 16px !important;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background: url(${bgNew}) no-repeat center center fixed;
    background-size: cover;
    background-color: #F4F9FD;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1 { 
    font-size: ${({ theme }) => theme.typography.h1}; 
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 700;
  }
  h2 { 
    font-size: ${({ theme }) => theme.typography.h2}; 
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 700;
  }
  h3 { 
    font-size: ${({ theme }) => theme.typography.h3}; 
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 600;
  }
  body, p { 
    font-size: ${({ theme }) => theme.typography.body}; 
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }
  small { 
    font-size: ${({ theme }) => theme.typography.small}; 
    color: ${({ theme }) => theme.colors.secondaryText};
  }

 
  .pointer{
cursor: pointer;
}
.hidden{
  display: none;
}
  
  /* PRIME REACT DROPDOWN PANEL FIX */
  .p-dropdown-panel {
    background-color: ${({ theme }) => theme.colors.white} !important;
    border-radius: 6px !important;
    border: 1px solid #ddd !important;
  }

  .p-dropdown-items-wrapper {
    background-color: ${({ theme }) => theme.colors.white} !important;
  }

  .p-dropdown-items {
    background-color: ${({ theme }) => theme.colors.white} !important;
    margin: 20px;
  }

  .p-dropdown-item {
    color: ${({ theme }) => theme.colors.black} !important;
    margin: 20px 0px;

  }

  .p-dropdown-item:hover {
    background-color: ${({ theme }) => theme.colors.lightgray} !important;
  }


  .swiper {
  width: 100%;
  height: 100%;
}

.agora-local-user div[style*="blur"] {
    filter: none !important;
    background: none;
  }


/* Chrome, Edge, Safari */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
  }

.custom-bullet {
  width: 26px;
  height: 26px;
  background: ${({ theme }) => theme.colors.white};;
  color: ${({ theme }) => theme.colors.primary};;
  font-size: 12px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.swiper-pagination-bullet-active.custom-bullet {
  background: ${({ theme }) => theme.colors.white};;
}


.emr-swiper {
  width: 100%;
  overflow: visible;
}

.emr-swiper .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.emr-swiper .swiper-button-prev {
  left: -6px;
}

.emr-swiper .swiper-button-next {
  right: -6px;
}

.emr-swiper .swiper-button-prev,
.emr-swiper .swiper-button-next {
  width: 32px;
  height: 32px;
  color: #0074bf;
}

.emr-swiper .swiper-button-prev::after,
.emr-swiper .swiper-button-next::after {
  font-size: 24px;
}
`;
