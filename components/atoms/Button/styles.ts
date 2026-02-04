import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
type Variant = "primary" | "secondary" | "third" | "danger" | "icon";

export const StyledButton = styled.TouchableOpacity<{
  variant: Variant;
  hasFlex1?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ hasFlex1 }) => hasFlex1 && "flex: 1;"}

  border-radius: ${({ variant }) => (variant === "icon" ? "0px" : "14px")};
  overflow: hidden;

  margin-vertical: ${({ variant }) => (variant === "icon" ? "0px" : "6px")};

  shadow-color: #000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 6;
`;

export const Label = styled.Text`
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: white;
  text-align: center;
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

export const Gradient = styled(LinearGradient)<{ variant: Variant }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding-vertical: ${({ variant }) => (variant === "icon" ? "0px" : "16px")};
  padding-horizontal: ${({ variant }) => (variant === "icon" ? "0px" : "20px")};
`;
