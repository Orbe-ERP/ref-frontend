import { useEffect } from "react";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { Loader } from "@/components/atoms/Loader";

export default function StripeSuccess() {
  const router = useRouter();
  const { validateToken } = useAuth();

  useEffect(() => {
    const finalize = async () => {
      await validateToken(); // atualiza user + defaultRestaurantId
      router.replace("/(tabs)");
    };

    finalize();
  }, []);

  return <Loader size="large" />;
}
