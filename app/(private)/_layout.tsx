import React, { useEffect } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import useRestaurant from "@/hooks/useRestaurant";
import useAuth from "@/hooks/useAuth";
import Toast from "react-native-toast-message";

export default function ProtectedRestaurantLayout() {
  const { selectedRestaurant } = useRestaurant();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const allowedWithoutRestaurant = ["/select-restaurant", "/create-restaurant"];

  const needsRestaurantRedirect =
    !selectedRestaurant &&
    !allowedWithoutRestaurant.some((route) => pathname.startsWith(route));

  const needsAuthRedirect =
    !authLoading &&
    !user?.hasAuthenticatedUser &&
    pathname !== "/login";

  useEffect(() => {
    if (needsAuthRedirect) {
      router.replace("/login");
    } else if (needsRestaurantRedirect) {
      Toast.show({
        type: "info",
        text1: "Selecione um restaurante para continuar",
      });
      router.replace("/select-restaurant");
    }
  }, [needsAuthRedirect, needsRestaurantRedirect, pathname]);

  if (authLoading || needsRestaurantRedirect || needsAuthRedirect) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>
          {needsAuthRedirect
            ? "Redirecionando para login..."
            : "Redirecionando..."}
        </Text>
      </View>
    );
  }

  return <Stack />;
}
