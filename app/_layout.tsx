import { AuthProvider } from "@/context/AuthProvider/auth";
import { RestaurantProvider } from "@/context/RestaurantProvider/restaurant";
import { AppThemeProvider, useAppTheme } from "@/context/ThemeProvider/theme";
import useAuth from "@/hooks/useAuth";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Loader } from "@/components/atoms/Loader";
import { View } from "react-native";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPrivateRoute = pathname.includes("(private)");

  if (loading) {
    return <Loader size="large" />;
  }

  if (isPrivateRoute && !user?.hasAuthenticatedUser) {
    router.replace("/login");
    return null;
  }

  if (pathname === "/login" && user?.hasAuthenticatedUser) {
    router.replace("/(private)/select-restaurant");
    return null;
  }

   if (pathname === "/plans" && !user?.hasAuthenticatedUser) {
    const checkTempToken = async () => {
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const tempToken = await AsyncStorage.default.getItem('temp_token');
        if (!tempToken) {
          router.replace("/signup");
        }
      } catch (error) {
        router.replace("/signup");
      }
    };
    checkTempToken();
  }

  return <>{children}</>;
}

function LayoutContent() {
  const { theme, isDark } = useAppTheme();

  return (
    <View
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
        <Stack.Screen name="signup" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="auth/confirm" />

        <Stack.Screen name="login" />
        
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(private)" />
        <Stack.Screen
          name="+not-found"
          options={{ title: "Página não encontrada" }}
        />
      </Stack>

      <Toast />
    </View>
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
