import styled from "styled-components/native";
import { AppThemeFonts } from "@/theme/typography";

export const StyledButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary" | "danger";
}>`
  background-color: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
      ? theme.colors.secondary
      : variant === "danger"
      ? theme.custom.feedback.error
      : theme.colors.primary};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 15px;
  align-items: center;
  margin-bottom: 15px;
`;

import { DefaultTheme } from "styled-components/native";

export const Label = styled.Text<{ weight?: keyof AppThemeFonts }>`
  font-size: 18px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme, weight = "medium" }: { theme: DefaultTheme; weight?: keyof AppThemeFonts }) => theme.fonts[weight]};
`;
