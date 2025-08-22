import styled from "styled-components/native";
import type { TitleVariant } from "./index";

export const StyledTitle = styled.Text<{
  variant: TitleVariant;
  align: "left" | "center" | "right";
  color?: string;
}>`
  ${({ variant }: { variant: TitleVariant }) => {
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
  color: ${({ color }: { color?: string }) => color ?? "#ffffff"};
  text-align: ${({ align }: { align: "left" | "center" | "right" }) => align};
`;
