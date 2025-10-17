export const COLORS = {
  light: {
    primary: "#E8F1FF",
    secondary: "#C5F5F6", 
    accent: "#A8F1FA",
    background: "#FFFFFF",
    surface: "#F5F7FA",
    text: {
      primary: "#0A1A2F",
      secondary: "#39465E",
      accent: "#038082",
      muted: "#7A8CA3",
    },
    border: "#D9E0EB",
    overlay: "rgba(0,0,0,0.05)",
    disabled: {
      background: "#E5E9F0",
      text: "#9DA9B8",
    },
  },

  dark: {
    primary: "#041224",
    secondary: "#038082",
    accent: "#04C4D9",
    background: "#0A1A2F",
    surface: "#13263F",
    text: {
      primary: "#FFFFFF",
      secondary: "#C6D4E1",
      accent: "#04C4D9",
      muted: "#8A9BB3",
    },
    border: "#1C2F4A",
    overlay: "rgba(0,0,0,0.6)",
    disabled: {
      background: "#1B2A41",
      text: "#637187",
    },
  },

  feedback: {
    success: "#00C896",
    warning: "#F6B73C", 
    error: "#E63946",
    info: "#2196F3",
  },
} as const;

export type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
  border: string;
  overlay: string;
  disabled: {
    background: string;
    text: string;
  };
};

export type ColorMode = 'light' | 'dark';
export type AppColors = ColorPalette;
export type FeedbackColors = typeof COLORS.feedback;