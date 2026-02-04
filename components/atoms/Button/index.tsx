import React from "react";
import { StyledButton, Label, IconContainer, Gradient } from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { AppColors } from "@/context/ThemeProvider/colors";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "third" | "danger" | "icon";
  icon?: React.ReactNode;
  disabled?: boolean;
  hasFlex1?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  hasFlex1 = false,
  disabled = false,
}: ButtonProps) {
  const { theme } = useAppTheme();

  const getGradientColors = (variant: any, theme: AppColors): any => {
    switch (variant) {
      case "primary":
        return [theme.primary, theme.secondary];

      case "secondary":
        return ["#64748b", "#334155"];

      case "third":
        return [theme.accent, theme.primary];

      case "danger":
        return ["#ef4444", "#991b1b"];

      default:
        return ["transparent", "transparent"];
    }
  };

  return (
    <StyledButton
      onPress={onPress}
      variant={variant}
      disabled={disabled}
      hasFlex1={hasFlex1}
      activeOpacity={0.85}
    >
      <Gradient
        variant={variant}
        colors={getGradientColors(variant, theme.colors)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon && <IconContainer>{icon}</IconContainer>}
        {variant !== "icon" && <Label numberOfLines={1}>{label}</Label>}
      </Gradient>
    </StyledButton>
  );
}
