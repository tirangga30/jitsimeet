export const theme = {
  colors: {
    background: "#0E4B71",
    text: "#1a1a1a",
    primary: "#0E4B71",
    secondary: "#05324E",
    white: "#FFFFFF",
    gray: "#FCFCFC",
    lightgray: "#E4DAD7",
    medgray: "#D9D9D9",
    darkgray: "#898989",
    border: "#E5E7EB",
    lightgreen: "#078A42",

    green: "#027564",
    darkgreen: "#004F43",
    lightred: "#E73535",
    red: "#D42A2A",
    darkred: "#AD1111",
    black: "#000000",
  },

  spacing: {
    xs: "clamp(4px, 0.6vw, 8px)",
    sm: "clamp(8px, 1.2vw, 12px)",
    md: "clamp(12px, 1.8vw, 18px)",
    lg: "clamp(18px, 2.4vw, 28px)",
    xl: "clamp(28px, 3vw, 40px)",
  },

  typography: {
    large: "clamp(28px, 4vw, 32px)",
    h1: "clamp(1.25rem, 1.1397rem + 0.5882vw, 1.875rem)",
    h2: "clamp(20px, 2.5vw, 24px)",
    h3: "clamp(16px, 2vw, 18px)",
    body: "clamp(10px, 1.7vw, 15px)",
    small: "clamp(8px, 1.3vw, 12px)",
  },

  radius: {
    sm: "8px",
    md: "14px",
    lg: "20px",
  },

  weight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export type ThemeType = typeof theme;
