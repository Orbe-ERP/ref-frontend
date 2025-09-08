import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ActionIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  variant?: "default" | "danger";
}

export default function ActionIconButton({
  icon,
  onPress,
  size = 24,
  color = "#fff",
  variant = "default",
}: ActionIconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={icon} size={size} color={variant === "danger" ? "#E74C3C" : color} />
    </TouchableOpacity>
  );
}
