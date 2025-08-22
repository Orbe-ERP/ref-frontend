import React from "react";
import { StyledButton, Label } from "./styles";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ label, onPress, variant = "primary" }: ButtonProps) {
  return (
    <StyledButton onPress={onPress} variant={variant}>
      <Label>{label}</Label>
    </StyledButton>
  );
}
