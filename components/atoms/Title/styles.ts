import styled from "styled-components/native";
import type { TitleVariant } from "./index";

type StyledTitleProps = {
  variant: TitleVariant;
  align: "left" | "center" | "right";
  color?: string;
};

export const StyledTitle = styled.Text<StyledTitleProps>`
  ${({ variant }) => {
    switch (variant) {
      case "page":
        return `font-size: 22px; font-weight: 700;`;
      case "section":
        return `font-size: 18px; font-weight: 700;`;
      case "card":
        return `font-size: 16px; font-weight: 600;`;
      default:
        return `font-size: 18px; font-weight: 700;`;
    }
  }}

  color: ${({ color, theme }) => color ?? theme.colors.text.primary};
  text-align: ${({ align }) => align};
`;
