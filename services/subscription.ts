// import { api } from "@/services/api";

// export async function startSubscription(priceId: string, p0: any, p1: any) {
//   const { data } = await api.post("/subscription/start", {
//     priceId,
//   });

//   return data as { url: string };
// }

// export async function cancelSubscription() {
//   const { data } = await api.post("/subscription/cancel");
//   return data;
// }

// export async function getMySubscription() {
//   const { data } = await api.get("/subscription/me");
//   return data;
// }

import { api } from "@/services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  plan: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface StartSubscriptionParams {
  priceId: string;
  email: string;
}

/**
 * Inicia uma nova assinatura
 * @param params { priceId, email, password }
 */
export async function startSubscription(
  params: StartSubscriptionParams
): Promise<CheckoutSessionResponse> {
  try {
    console.log('Starting subscription with:', { priceId: params.priceId, email: params.email });
    
    const { data } = await api.post<{ url: string }>("/subscription/start", {
      email: params.email,
      priceId: params.priceId
    });
    
    // Extrai sessionId da URL do Stripe se necessário
    const sessionId = extractSessionIdFromUrl(data.url);
    
    return {
      url: data.url,
      sessionId: sessionId
    };
  } catch (error: any) {
    console.error('Error starting subscription:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Email ou senha inválidos');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Dados inválidos');
    }
    
    throw new Error(error.response?.data?.message || 'Erro ao iniciar assinatura');
  }
}

/**
 * Confirma o pagamento após retorno do Stripe
 */
export async function confirmPayment(token: string): Promise<PaymentConfirmationResponse> {
  try {
    console.log('Confirming payment with token:', token);
    
    // TENTATIVA 1: GET com query param (mais comum para redirecionamento)
    try {
      const { data } = await api.get(`/subscription/confirm?token=${token}`);
      return data;
    } catch (getError: any) {
      // Se GET falhar, tenta POST
      console.log('GET failed, trying POST...');
      const { data } = await api.post("/subscription/confirm", { token });
      return data;
    }
  } catch (error: any) {
    console.error('Error confirming payment:', error.response?.data || error.message);
    
    // Tratamento de erros específicos
    if (error.response?.status === 404) {
      throw new Error('Sessão de pagamento não encontrada ou expirada');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Token inválido');
    }
    
    if (error.response?.status === 402) {
      throw new Error('Pagamento não realizado ou recusado');
    }
    
    throw new Error(error.response?.data?.message || 'Erro ao confirmar pagamento');
  }
}

export async function cancelSubscription(): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await api.post("/subscription/cancel");
    return data;
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    throw new Error(error.response?.data?.message || 'Erro ao cancelar assinatura');
  }
}

export async function getMySubscription(): Promise<SubscriptionData> {
  try {
    const { data } = await api.get("/subscription/me");
    return data;
  } catch (error: any) {
    console.error('Error getting subscription:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar assinatura');
  }
}

// Funções auxiliares
function extractSessionIdFromUrl(url: string): string | undefined {
  try {
    // Tenta extrair session_id da URL do Stripe
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch {
    return undefined;
  }
}

/**
 * Verifica se há credenciais salvas para assinatura
 */
export async function getSubscriptionCredentials(): Promise<{ email: string; password: string } | null> {
  try {
    const email = await AsyncStorage.getItem('user_email');
    const password = await AsyncStorage.getItem('subscription_password'); // Você precisa salvar isso durante o cadastro
    
    if (email && password) {
      return { email, password };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Salva credenciais para uso na assinatura
 */
export async function saveSubscriptionCredentials(email: string, password: string): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      ['user_email', email],
      ['subscription_password', password]
    ]);
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
}