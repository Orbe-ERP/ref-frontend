import styled from "styled-components/native";

export const StyledButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary" | "danger";
}>`
  background-color: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
      ? theme.colors.secondary
      : variant === "danger"
      ? theme.colors.feedback.error
      : theme.colors.primary};
  border-radius: 5px;
  padding: 15px;
  align-items: center;
  margin-bottom: 15px;
`;


export const Label = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
