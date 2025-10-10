import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthProvider/auth";
import useAuth from "@/hooks/useAuth";
import Toast from "react-native-toast-message";
import { RestaurantProvider } from "@/context/RestaurantProvider/restaurant";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppThemeProvider, useAppTheme } from "@/theme/ThemeProvider";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPrivateRoute = pathname.includes("(private)");

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isPrivateRoute && !user?.hasAuthenticatedUser) {
    router.replace("/login");
    return null;
  }

  if (pathname === "/login" && user?.hasAuthenticatedUser) {
    router.replace("/(private)/select-restaurant");
    return null;
  }

  return <>{children}</>;
}

function LayoutContent() {
  const { theme, isDark } = useAppTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(private)" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="+not-found"
          options={{ title: "Página não encontrada" }}
        />
      </Stack>

      <Toast />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RestaurantProvider>
          <AuthProvider>
            <AppThemeProvider>
              <AuthGuard>
                <LayoutContent />
              </AuthGuard>
            </AppThemeProvider>
          </AuthProvider>
        </RestaurantProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
