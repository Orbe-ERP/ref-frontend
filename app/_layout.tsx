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
import PlanOverlay from "@/components/molecules/PlanOverlay";
import RestaurantOverlay from "@/components/molecules/RestaurantOverlay";
import useRestaurant from "@/hooks/useRestaurant";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();
  const pathname = usePathname();
  const hasPlan = Boolean(user?.plan);

  const isLogged = Boolean(user?.hasAuthenticatedUser);

  const hasRestaurant = selectedRestaurant;

  const restaurantAllowedRoutes = [
    "/select-restaurant",
    "/create-restaurant",
    "/edit-restaurant",
  ];

  const isRestaurantFlow = restaurantAllowedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isTabsRoute =
    pathname !== "/" &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup") &&
    !pathname.startsWith("/plans") &&
    !pathname.startsWith("/stripe") &&
    !isRestaurantFlow;

  type BlockReason = "PLAN" | "RESTAURANT" | null;
  let blockReason: BlockReason = null;

  if (isLogged && isTabsRoute) {
    if (!hasRestaurant) {
      blockReason = "RESTAURANT";
    } else if (!hasPlan) {
      blockReason = "PLAN";
    }
  }

  React.useEffect(() => {
    if (loading) return;

    const isPrivateRoute =
      pathname.startsWith("/(private)") || pathname.startsWith("/(tabs)");

    if (isPrivateRoute && !user?.hasAuthenticatedUser) {
      router.replace("/login");
      return;
    }

    if (pathname === "/login" && user?.hasAuthenticatedUser) {
      router.replace("/(tabs)");
      return;
    }
    if (pathname === "/plans" && !user?.hasAuthenticatedUser) {
      router.replace("/signup");
      return;
    }
  }, [loading, pathname, user, router, hasPlan]);

  const isStripeRoute = pathname.startsWith("/stripe");
  if (isStripeRoute) {
    return <>{children}</>;
  }
  if (loading) {
    return <Loader size="large" />;
  }

  return (
    <>
      {blockReason === "PLAN" && <PlanOverlay />}

      {blockReason === "RESTAURANT" && <RestaurantOverlay />}

      {children}
    </>
  );
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
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="auth/confirm" />

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
