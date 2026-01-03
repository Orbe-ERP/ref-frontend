import styled from "styled-components/native";
export const StyledButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary" | "danger";
  hasFlex1?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ hasFlex1 }) => hasFlex1 && "flex: 1;"}
  background-color: ${({ theme, variant }) =>
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
      ? theme.colors.secondary
      : theme.colors.feedback.error};

  border-radius: 12px;
  padding-vertical: 16px;
  padding-horizontal: 18px;
  margin-vertical: 4px;
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

export const Label = styled.Text<{ $hasIcon?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  flex-shrink: 1;
`;

export const IconContainer = styled.View`
  margin-right: 8px;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
`;
