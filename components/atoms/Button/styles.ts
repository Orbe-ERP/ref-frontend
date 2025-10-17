import { TYPOGRAPHY } from "@/theme/typography";
import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";

export const StyledButton = styled.TouchableOpacity.attrs({ activeOpacity: 0.7, })<{ variant: "primary" | "secondary" | "danger";}>`
  background-color: ${(props: { theme: DefaultTheme; variant: "primary" | "secondary" | "danger" }) =>
    props.variant === "primary"
      ? props.theme.colors.primary
      : props.variant === "secondary"
      ? props.theme.colors.secondary
      : props.theme.custom.feedback.error};
  border-radius: 5px;
  padding: 15px;
  align-items: center;
  margin-bottom: 15px;
`;

export const Label = styled.Text<{ weight?: keyof typeof TYPOGRAPHY.family }>`
  font-size: 18px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text.primary};
  font-family: ${(props: { theme: DefaultTheme; weight?: keyof typeof TYPOGRAPHY.family }) => 
    props.theme.fonts.family[props.weight || "regular"]};
`;