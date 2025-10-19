import styled from "styled-components/native";

export const StyledButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary" | "danger";
}>`
  background-color: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
      ? theme.colors.secondary
      : theme.colors.feedback.error};

  border-radius: 12px;
  padding-vertical: 14px;
  padding-horizontal: 18px;
  align-items: center;
  justify-content: center;
  margin-vertical: 8px;
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
