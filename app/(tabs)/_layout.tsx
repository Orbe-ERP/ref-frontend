import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import useAuth from "@/hooks/useAuth";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useAppTheme();

  const isAdmin = user?.role === "ADMIN";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
          color: theme.colors.text.primary,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
tabBarStyle: {
  backgroundColor: theme.colors.background,
  borderTopWidth: 0,
  elevation: 0,

  paddingBottom: Platform.OS === "ios" ? insets.bottom : 6,
  paddingTop: 6,
  height: Platform.OS === "ios" ? 60 + insets.bottom : 58,
},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="table"
        options={{
          title: "Mesas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      {isAdmin && (
        <>
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Dashboard",
              href: isAdmin ? undefined : null,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="config"
            options={{
              title: "Opções",
              href: isAdmin ? undefined : null,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tabs>
  );
}
