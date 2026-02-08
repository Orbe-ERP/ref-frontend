import { api } from "./api";

export interface Modifier {
  id: string;
  name: string;
  priceChange: number;
  stockItemId: string;
  trackStock: boolean;
  allowFreeText: boolean;
  createdAt: string;
  updatedAt: string;
  stockItem?: {
    id: string;
    name: string;
  } | null;
  restaurantId: string;
}

export interface CreateModifierInput {
  name: string;
  priceChange: number;
  restaurantId: string;
  allowFreeText: boolean;
  trackStock: boolean;

  stockItemId?: string | null;
  stockEffect?: "ADD" | "REMOVE" | "NONE" | null;
  stockMultiplier?: number | null;
}

export interface AddModifierToProductOpts {
  required?: boolean;
  limit?: number | null;
  default?: boolean;
}

export async function addModifierToProduct(
  restaurantId: string,
  productId: string,
  modifierId: string,
  opts?: AddModifierToProductOpts,
) {
  try {
    const response = await api.post(
      `/modifiers/${restaurantId}/${modifierId}/add-to-product/${productId}`,
      opts,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Erro ao adicionar modificador ao produto: ${error?.response?.data || error.message}`,
    );
  }
}

export async function createModifier(data: CreateModifierInput) {
  if (data.stockEffect == null) {
    data.stockEffect = "NONE";
  }

  try {
    const response = await api.post("/modifiers", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Erro ao criar modificador: ${error?.response?.data || error.message}`,
    );
  }
}

export async function getModifierById(id: string) {
  if (!id) throw new Error("Modifier id é obrigatório");

  const response = await api.get(`/modifiers/${id}`);
  return response.data;
}

export async function getModifiersProduct(productId: string) {
  if (!productId) throw new Error("Product id é obrigatório");

  try {
    const response = await api.get(`/modifiers/product/${productId}`);

    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao buscar modificadores do produto: ${error}`);
  }
}

export async function updateModifier(
  id: string,
  data: Partial<CreateModifierInput>,
) {
  if (!id) throw new Error("Modifier id é obrigatório");

  try {
    const response = await api.patch(`/modifiers/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Erro ao atualizar modificador: ${error?.response?.data || error.message}`,
    );
  }
}

export async function deleteModifier(id: string) {
  if (!id) {
    throw new Error("id é obrigatórios");
  }

  try {
    await api.delete(`/modifiers/${id}`);
  } catch (error: any) {
    throw new Error(
      `Erro ao deletar modificador: ${error?.response?.data || error.message}`,
    );
  }
}

export async function getModifiersByProductIds(productIds: string[]) {
  if (!productIds?.length) return [];

  try {
    const response = await api.post("/modifiers/product-modifiers", {
      productIds,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      `Erro ao buscar modificadores por ids de produtos: ${error}`,
    );
  }
}
