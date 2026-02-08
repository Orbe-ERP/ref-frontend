import { api } from "./api";
import { StockItem, Unit } from "./stock";

export interface ProductComposition {
  id: string;
  name: string;
  productId: string;
  stockItemId: string;
  quantity: number;
  unit?: Unit;
  createdAt?: string;
  kitchenId: string;
  stockItem?: StockItem;
}

export async function getCompositionsByProduct(productId: string) {
  if (!productId) throw new Error("productId is required");

  try {
    const response = await api.get<ProductComposition[]>(
      `/products/${productId}/composition`,
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error ao buscar composições do produto: ${error}`);
  }
}

export async function addComposition(payload: {
  name: string;
  productId: string;
  stockItemId: string;
  quantity: number;
  unit: Unit;
  kitchenId: string;
  restaurantId: string;
}) {
  try {
    const response = await api.post("/products/composition", payload);
    return response.data;
  } catch (error) {
    throw new Error(`Error ao adicionar composição: ${error}`);
  }
}

export async function updateComposition(
  id: string,
  data: {
    quantity?: number;
    name?: string;
  },
) {
  if (!id) throw new Error("id required");

  try {
    const response = await api.patch(`/products/composition/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error ao atualizar composição: ${error}`);
  }
}

export async function deleteComposition(id: string) {
  if (!id) throw new Error("id required");

  try {
    const request = await api.delete(`/products/composition/${id}`);
    return request.data;
  } catch (error) {}
}

export async function updateProductCost(productId: string) {
  try {
    const response = await api.patch(`/products/${productId}/update-cost`);
    return response.data;
  } catch (error) {
    throw new Error(`Error ao atualizar custo do produto: ${error}`);
  }
}
