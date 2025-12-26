import { api } from "@/services/api";

export async function startSubscription(priceId: string) {
  const { data } = await api.post("/subscription/start", {
    priceId,
  });

  return data as { url: string };
}

export async function cancelSubscription() {
  const { data } = await api.post("/subscription/cancel");
  return data;
}

export async function getMySubscription() {
  const { data } = await api.get("/subscription/me");
  return data;
}
