import { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import useAuth from "@/hooks/useAuth";

export default function useRoleRedirect() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    if (user.role === "USER" && pathname === "/config") {
      router.replace("/");
    }
  }, [user, pathname]);
}
