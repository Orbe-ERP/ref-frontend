import { COLORS, AppColors, FeedbackColors } from "./colors";

export type AppTheme = {
  colors: AppColors & { feedback: FeedbackColors };
};

export const DarkAppTheme: AppTheme = {
  colors: {
    ...COLORS.dark,
    background: COLORS.dark.background,
    surface: COLORS.dark.surface,
    primary: COLORS.dark.primary,
    secondary: COLORS.dark.secondary,
    text: COLORS.dark.text,
    border: COLORS.dark.border,
    overlay: COLORS.dark.overlay,
    disabled: COLORS.dark.disabled,
    accent: COLORS.dark.accent,
    feedback: COLORS.feedback,
  },
}

export const LightAppTheme: AppTheme = {
  colors: {
    ...COLORS.light,
    background: COLORS.light.background,
    surface: COLORS.light.surface,
    primary: COLORS.light.primary,
    secondary: COLORS.light.secondary,
    text: COLORS.light.text,
    border: COLORS.light.border,
    overlay: COLORS.light.overlay,
    disabled: COLORS.light.disabled,
    accent: COLORS.light.accent,
    feedback: COLORS.feedback,
  },
};
