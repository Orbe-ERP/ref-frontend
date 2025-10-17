import { COLORS, AppColors, FeedbackColors, ColorMode } from "./colors";
import { TYPOGRAPHY, AppThemeFonts } from "./typography";

export type AppTheme = {
  colors: AppColors;
  custom: {
    feedback: FeedbackColors;
    typography: AppThemeFonts;
  };
  fonts: AppThemeFonts;
}

// Helper para criar temas
const createAppTheme = (colorMode: ColorMode): AppTheme => ({
  colors: COLORS[colorMode],
  custom: {
    feedback: COLORS.feedback,
    typography: TYPOGRAPHY,
  },
  fonts: TYPOGRAPHY,
});

export const DarkAppTheme: AppTheme = createAppTheme('dark');
export const LightAppTheme: AppTheme = createAppTheme('light');