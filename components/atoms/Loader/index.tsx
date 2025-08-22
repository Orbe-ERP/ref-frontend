import React from "react";
import { ActivityIndicator, View } from "react-native";

interface LoaderProps {
  size?: "small" | "large";
  color?: string;
}

export default function Loader({ size = "large", color = "#029269" }: LoaderProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
