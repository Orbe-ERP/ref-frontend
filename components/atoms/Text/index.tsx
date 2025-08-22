import React from "react";
import { StyledText, TextProps } from "./styles";

export const Text: React.FC<TextProps> = ({ children, size, color, weight }) => (
  <StyledText size={size} color={color} weight={weight}>
    {children}
  </StyledText>
);
