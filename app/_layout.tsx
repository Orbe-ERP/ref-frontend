import { AuthProvider } from "@/context/AuthProvider/auth";
import { RestaurantProvider } from "@/context/RestaurantProvider/restaurant";
import { AppThemeProvider, useAppTheme } from "@/context/ThemeProvider/theme";
import useAuth from "@/hooks/useAuth";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Loader } from "@/components/atoms/Loader";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (loading) return;

    const isPrivateRoute =
      pathname.startsWith("/(private)") || pathname.startsWith("/(tabs)");

    // 🔒 Tentando acessar rota privada sem login
    if (isPrivateRoute && !user?.hasAuthenticatedUser) {
      router.replace("/login");
      return;
    }

    // 🔑 Usuário logado na tela de login
    if (pathname === "/login" && user?.hasAuthenticatedUser) {
      if (!user?.defaultRestaurantId) {
        router.replace("/plans");
      } else {
        router.replace("/(tabs)");
      }
      return;
    }

    // 🧾 Tentando acessar plans sem estar logado
    if (pathname === "/plans" && !user?.hasAuthenticatedUser) {
      router.replace("/signup");
      return;
    }
  }, [loading, pathname, user, router]);

  const isStripeRoute = pathname.startsWith("/stripe");
  if (isStripeRoute) return;

  if (loading) {
    return <Loader size="large" />;
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
