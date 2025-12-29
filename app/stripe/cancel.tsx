import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function StripeCancel() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/plans");
  }, []);

  return null;
}
