import React from "react";
import { View } from "react-native";
import { Slot, Stack } from "expo-router";
import { PurchaseImportProvider } from "@/context/PurchaseImportProvider";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function Layout() {
  const { theme } = useAppTheme();

  return (
    <PurchaseImportProvider>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Estoque",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <Slot />
      </View>
    </PurchaseImportProvider>
  );
}
