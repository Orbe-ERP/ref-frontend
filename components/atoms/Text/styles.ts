import styled from "styled-components/native";

export type TextProps = {
  children: React.ReactNode;
  size?: number;
  weight?: "normal" | "bold" | "600";
  color?: string;
};

export const StyledText = styled.Text<{
  size?: number;
  weight?: "normal" | "bold" | "600";
  color?: string;
}>`
  font-size: ${({ size }) => size || 16}px;
  font-weight: ${({ weight }) => weight || "normal"};
  color: ${({ color, theme }) => color || theme.colors.text.primary};
`;
