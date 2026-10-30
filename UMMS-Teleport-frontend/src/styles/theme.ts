export const theme = {
  colors: {
    // New design tokens matching reference UI
    primaryTeal: "#009F95",
    darkTeal: "#007F78",
    navy: "#101B4B",
    lightCyan: "#E7F8F8",
    softCyan: "#EBF6F8",
    mainBackground: "#F4F9FD",
    cardBackground: "#FFFFFF",
    secondaryText: "#667A9B",
    border: "#DCE6F0",
    borderLight: "#E8EEF5",
    destructive: "#E53945",
    destructiveHover: "#CE2C38",
    destructiveLight: "#FDE8EA",

    // Backward-compatible tokens mapped to the new palette
    background: "#F4F9FD",
    text: "#101B4B",
    primary: "#009F95",
    secondary: "#101B4B",
    white: "#FFFFFF",
    gray: "#F8FAFC",
    lightgray: "#E7F8F8",
    medgray: "#667A9B",
    darkgray: "#4B5A76",
    lightgreen: "#10B981",

    green: "#009F95",
    darkgreen: "#007F78",
    lightred: "#FDE8EA",
    red: "#E53945",
    darkred: "#CE2C38",
    black: "#101B4B",
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
