import { api } from "./api";

export interface PurchaseItem {
  stockItemId: string;
  quantity: number;
  unitCost: number;
}

export interface Purchase {
  id: string;
  purchaseId: string;
  restaurantId: string;
  items: PurchaseItem[];
  createdAt: string;
}

export interface CreatePurchaseInput {
  restaurantId: string;
  purchaseId: string;
  items: PurchaseItem[];
}

// Função para gerar ID de compra
export function generatePurchaseId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PUR-${timestamp}-${random}`;
}

/**
 * Registra uma nova compra e atualiza o estoque
 * Endpoint: POST /stock/purchase/:purchaseId
 */
export async function createPurchase(items: PurchaseItem[]): Promise<{ success: boolean }> {
  if (!items || items.length === 0) throw new Error("Items list cannot be empty");

  try {
    const purchaseId = generatePurchaseId();
    const response = await api.post(`/stock/purchase/${purchaseId}`, { items });
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao registrar compra: ${error.message || "Erro desconhecido"}`);
  }
}

/**
 * Busca todas as compras de um restaurante
 * ATENÇÃO: Este endpoint NÃO EXISTE no backend atual
 * Vamos simular retornando array vazio
 */
export async function getPurchases(restaurantId: string): Promise<Purchase[]> {
  console.log(`[INFO] Endpoint GET /purchases não implementado no backend para restaurante ${restaurantId}`);
  return [];
}

/**
 * Calcula o total de uma compra (apenas no frontend)
 */
export function calculatePurchaseTotal(items: PurchaseItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.quantity * item.unitCost);
  }, 0);
}

/**
 * Valida os itens da compra antes de enviar
 */
export function validatePurchaseItems(items: PurchaseItem[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push("A compra deve conter pelo menos um item");
  }

  items.forEach((item, index) => {
    if (!item.stockItemId) {
      errors.push(`Item ${index + 1}: Informe o nome do produto`);
    }
    if (!item.quantity || item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
    }
    if (item.unitCost === undefined || item.unitCost < 0) {
      errors.push(`Item ${index + 1}: Custo unitário deve ser maior ou igual a zero`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}