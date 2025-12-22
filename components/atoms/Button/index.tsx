import React from "react";
import { StyledButton, Label, IconContainer } from "./styles";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled = false,
}: ButtonProps) {
  return (
    <StyledButton onPress={onPress} variant={variant} disabled={disabled}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <Label $hasIcon={!!icon}>{label}</Label>
    </StyledButton>
  );
}
