import React from "react";
import { View, ActivityIndicator } from "react-native";
import { usePathname, useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
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
