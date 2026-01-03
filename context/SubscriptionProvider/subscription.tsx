import { getMySubscription } from "@/services/subscription";
import { useEffect, useState } from "react";

export interface SubscriptionStatus {
  plan: string | null;
  expiresInDays: number;
  isExpiringSoon: boolean;
  isExpired: boolean;
  isPendingFirstInvoice: boolean;
}

export default function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMySubscription()
        setStatus(data);
      } catch {
        setStatus(null);
      } finally {
        setLoadingStatus(false);
      }
    };

    load();
  }, []);

  return { status, loadingStatus };
}
