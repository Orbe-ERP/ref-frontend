import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CheckoutSessionResponse {
  url: string;
  sessionId?: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    isActive: boolean;
  };
}

export interface SubscriptionData {
  id: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  plan: string;
  priceId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface StartSubscriptionParams {
  priceId: string;
  email: string;
}

export async function startSubscription(
  params: StartSubscriptionParams
): Promise<CheckoutSessionResponse> {
  try {
    const { data } = await api.post<{ url: string }>("/subscription/start", {
      email: params.email,
      priceId: params.priceId,
    });

    const sessionId = extractSessionIdFromUrl(data.url);

    return {
      url: data.url,
      sessionId: sessionId,
    };
  } catch (error: any) {

    if (error.response?.status === 401) {
      throw new Error("Email ou senha inválidos");
    }

    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || "Dados inválidos");
    }

    throw new Error(
      error.response?.data?.message || "Erro ao iniciar assinatura"
    );
  }
}

export async function confirmPayment(
  token: string
): Promise<PaymentConfirmationResponse> {
  try {

    try {
      const { data } = await api.get(`/subscription/confirm?token=${token}`);
      return data;
    } catch (getError: any) {
      const { data } = await api.post("/subscription/confirm", { token });
      return data;
    }
  } catch (error: any) {

    if (error.response?.status === 404) {
      throw new Error("Sessão de pagamento não encontrada ou expirada");
    }

    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || "Token inválido");
    }

    if (error.response?.status === 402) {
      throw new Error("Pagamento não realizado ou recusado");
    }

    throw new Error(
      error.response?.data?.message || "Erro ao confirmar pagamento"
    );
  }
}

export async function cancelSubscription(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { data } = await api.post("/subscription/cancel");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao cancelar assinatura"
    );
  }
}

export async function getMySubscription(): Promise<any> {
  try {
    const { data } = await api.get("/subscription/me");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar assinatura"
    );
  }
}

export async function createPixPayment() {
  const { data } = await api.post("/subscription/pix");
  return data;
}

export async function getBillingPortal(): Promise<{ url: string }> {
  try {
    const { data } = await api.get("/subscription/portal");
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Erro ao buscar portal"
    );
  }
}

function extractSessionIdFromUrl(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    return pathParts[pathParts.length - 1];
  } catch {
    return undefined;
  }
}

export async function getSubscriptionCredentials(): Promise<{
  email: string;
  password: string;
} | null> {
  try {
    const email = await AsyncStorage.getItem("user_email");
    const password = await AsyncStorage.getItem("subscription_password"); 

    if (email && password) {
      return { email, password };
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveSubscriptionCredentials(
  email: string,
  password: string
): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      ["user_email", email],
      ["subscription_password", password],
    ]);
  } catch (error: any) {
        throw new Error(
      error.response?.data?.message || "Erro ao salvar credenciais"
    );
  }
}
