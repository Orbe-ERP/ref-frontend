import React from "react";
import { TextProps } from "react-native";
import { StyledTitle } from "./styles";

export type TitleVariant = "page" | "section" | "card" | "restaurant";

export interface TitleProps extends TextProps {
  variant?: TitleVariant;
  align?: "left" | "center" | "right";
  color?: string;
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({
  variant = "page",
  align = "center",
  color,
  children,
  ...rest
}) => {
  return (
    <StyledTitle variant={variant} align={align} color={color} {...rest}>
      {children}
    </StyledTitle>
  );
};

export default Title;
