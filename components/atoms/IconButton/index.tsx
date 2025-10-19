import React from "react";
import { TouchableOpacityProps } from "react-native";
import { StyledButton } from "./styles";
import { Ionicons } from "@expo/vector-icons";

interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 20,
  color = "white",
  backgroundColor = "#2BAE66",
  ...rest
}) => (
  <StyledButton backgroundColor={backgroundColor} {...rest}>
    <Ionicons name={icon} size={size} color={color} />
  </StyledButton>
);

export default IconButton;
