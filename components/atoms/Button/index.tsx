import React from "react";
import { StyledButton, Label, IconContainer } from "./styles";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
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
  return (
    <StyledButton onPress={onPress} variant={variant} disabled={disabled} hasFlex1={hasFlex1}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <Label numberOfLines={1} ellipsizeMode="tail" minimumFontScale={0.85} adjustsFontSizeToFit>{label}</Label>
    </StyledButton>
  );
}
