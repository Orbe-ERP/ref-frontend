import styled from "styled-components/native";

export type TextProps = {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: "normal" | "bold" | "600";
};

export const StyledText = styled.Text<{ size?: number; color?: string; weight?: string }>`
  font-size: ${(props: { size: any; }) => props.size || 16}px;
  color: ${(props: { color: any; }) => props.color || "#fff"};
  font-weight: ${(props: { weight: any; }) => props.weight || "normal"};
`;