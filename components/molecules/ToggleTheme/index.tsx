import { useAppTheme } from "@/context/ThemeProvider/theme";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ButtonContainer } from "./styles";

export const ThemeToggle = () => {
  const { isDark, toggleTheme, theme } = useAppTheme();

  return (
    <ButtonContainer
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
      >
        {isDark ? "☀️" : "🌙"}
      </Text>
    </ButtonContainer>
  );
};
