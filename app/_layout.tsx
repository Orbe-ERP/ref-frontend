import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthProvider/auth";
import useAuth from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";
import { RestaurantProvider } from "@/context/RestaurantProvider/restaurant";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPrivateRoute = pathname.includes("(private)");

  // Enquanto estiver carregando ou usuário não autenticado em rota privada → não renderiza
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isPrivateRoute && !user?.hasAuthenticatedUser) {
    // Redireciona antes de renderizar qualquer conteúdo
    router.replace("/login");
    return null; // nada é renderizado enquanto redireciona
  }

  if (pathname === "/login" && user?.hasAuthenticatedUser) {
    router.replace("/(private)/select-restaurant");
    return null; // impede renderização da tela de login
  }

  return <>{children}</>;
}

// Layout raiz do app
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />

        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RestaurantProvider>
            <AuthProvider>
              <AuthGuard>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                      name="+not-found"
                      options={{ title: "Página não encontrada" }}
                    />
                  </Stack>
                  <StatusBar style="auto" />
                  <Toast />
                </SafeAreaView>
              </AuthGuard>
            </AuthProvider>
          </RestaurantProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
