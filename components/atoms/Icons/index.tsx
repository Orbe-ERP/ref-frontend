import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, size = 20, color = "#038082" }) => (
  <Icon name={name} size={size} color={color} />
);
