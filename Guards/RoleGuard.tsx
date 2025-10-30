import React, { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { canAccessRoute } from "@/utils/permissions";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user?.role) {
      const allowed = canAccessRoute(user.role, pathname);

      if (!allowed) {
        if (user.role === "USER") router.replace("/(tabs)");
        else if (user.role === "ADMIN") router.replace("/");
      }
    }
  }, [loading, user, pathname]);

  if (loading) return null;

  return <>{children}</>;
}
