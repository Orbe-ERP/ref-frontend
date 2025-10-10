import { COLORS, AppColors, FeedbackColors } from "./colors";
import { TYPOGRAPHY, AppThemeFonts } from "./typography";

export type AppTheme = {
  colors: AppColors;
  custom: AppColors & { feedback: FeedbackColors; typography: AppThemeFonts };
}

export const DarkAppTheme: AppTheme = {
  colors: {
    ...COLORS.dark,
    background: COLORS.dark.background,
    surface: COLORS.dark.surface,
    primary: COLORS.dark.primary,
    secondary: COLORS.dark.secondary,
    text: COLORS.dark.text,
    border: COLORS.dark.border,
  },
  custom: {
    ...COLORS.dark,
    feedback: COLORS.feedback,
    typography: TYPOGRAPHY,
  },
};

export const LightAppTheme: AppTheme = {
  colors: {
    ...COLORS.light,
    background: COLORS.light.background,
    surface: COLORS.light.surface,
    primary: COLORS.light.primary,
    secondary: COLORS.light.secondary,
    text: COLORS.light.text,
    border: COLORS.light.border,
  },
  custom: {
    ...COLORS.light,
    feedback: COLORS.feedback,
    typography: TYPOGRAPHY,
  },
};
