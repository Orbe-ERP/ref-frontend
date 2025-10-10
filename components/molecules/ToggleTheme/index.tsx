import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useAppTheme } from "@/theme/ThemeProvider";

export const ThemeToggle = () => {
  const { isDark, toggleTheme, theme, fonts } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.primary,
        alignSelf: "flex-end",
        margin: 12,
      }}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontFamily: fonts.medium,
          fontSize: 14,
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </Text>
    </TouchableOpacity>
  );
};
