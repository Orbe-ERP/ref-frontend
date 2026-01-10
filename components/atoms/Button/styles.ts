import styled from "styled-components/native";

export const StyledButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary" | "danger" | "icon";
  hasFlex1?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ hasFlex1 }) => hasFlex1 && "flex: 1;"}

  background-color: ${({ theme, variant }) =>
    variant === "icon"
      ? "transparent"
      : variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
      ? theme.colors.secondary
      : theme.colors.feedback.error};

  border-radius: ${({ variant }) => (variant === "icon" ? "0px" : "12px")};

  padding-vertical: ${({ variant }) => (variant === "icon" ? "0px" : "16px")};
  padding-horizontal: ${({ variant }) => (variant === "icon" ? "0px" : "18px")};

  margin-vertical: ${({ variant }) => (variant === "icon" ? "0px" : "4px")};

  shadow-color: ${({ variant }) => (variant === "icon" ? "transparent" : "#000")};
  shadow-offset: 0px 3px;
  shadow-opacity: ${({ variant }) => (variant === "icon" ? 0 : 0.2)};
  shadow-radius: 4px;
  elevation: ${({ variant }) => (variant === "icon" ? 0 : 4)};
`;

export const Label = styled.Text<{ $hasIcon?: boolean; $isIcon?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  flex-shrink: 1;

  ${({ $isIcon }) => $isIcon && "display: none;"}
`;

export const IconContainer = styled.View<{ $isIcon?: boolean }>`
  ${({ $isIcon }) =>
    $isIcon
      ? `
    margin: 0px;
  `
      : `
    margin-right: 8px;
  `}

  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
