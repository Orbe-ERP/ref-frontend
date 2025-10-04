import { api } from "./api";

export type PaymentMethod = 
  | "CREDIT_CARD"
  | "DEBIT_CARD"

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
};

export type CardBrand =
  | "VISA"
  | "MASTERCARD"
  | "ELO"
  | "AMEX"
  | "HIPERCARD"
  | "OUTRO";

export const CardBrandLabels: Record<CardBrand, string> = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  ELO: "Elo",
  AMEX: "Amex",
  HIPERCARD: "Hipercard",
  OUTRO: "Outro",
};

export interface PaymentConfig {
  id: string;
  restaurantId: string;
  method: PaymentMethod;
  feePercent: number;
  feeFixed?: number;
  brand?: CardBrand;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrUpdatePaymentConfig {
  method: PaymentMethod;
  brand?: CardBrand;
  feePercent: number;
  feeFixed?: number;
}

export async function getPaymentConfigs(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error("Nenhum restaurante selecionado");
  }

  try {
    const response = await api.get<PaymentConfig[]>(`/payment-config/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter configurações de pagamento: ${error}`);
  }
}

export async function createOrUpdatePaymentConfig(
  restaurantId: string | undefined,
  body: CreateOrUpdatePaymentConfig
) {
  if (!restaurantId) {
    throw new Error("ID do restaurante não definido");
  }

  try {
    const response = await api.post<PaymentConfig>(`/payment-config/${restaurantId}`, body);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar/atualizar configuração de pagamento: ${error}`);
  }
}

export async function deletePaymentConfig(
  restaurantId: string | undefined,
  id: string
) {
  if (!restaurantId) {
    throw new Error("ID do restaurante não definido");
  }

  try {
    const response = await api.delete<PaymentConfig>(`/payment-config/${restaurantId}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao deletar configuração de pagamento: ${error}`);
  }
}
