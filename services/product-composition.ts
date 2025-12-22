import { api } from "./api";
import { StockItem, Unit } from "./stock";

export interface ProductComposition {
  id: string;
  productId: string;
  stockItemId: string;
  quantity: number;
  unit?: Unit;
  createdAt?: string;
  stockItem?: StockItem;
}

export async function getCompositionsByProduct(productId: string) {
  if (!productId) throw new Error("productId is required");

  const response = await api.get<ProductComposition[]>(
    `/products/${productId}/composition`
  );

  return response.data;
}

export async function addComposition(payload: {
  productId: string;
  stockItemId: string;
  quantity: number;
  unit?: Unit;
  restaurantId: string;
}) {
  try {
    const response = await api.post("/products/composition", payload);
    return response.data;
  } catch (err) {
    throw new Error(`Error adding composition: ${err}`);
  }
}

export async function updateComposition(id: string, data: { quantity?: number; unit?: Unit }) {
  if (!id) throw new Error("id required");
  try {
    const response = await api.patch(`/product/composition/${id}`, data);
    return response.data;
  } catch (err) {
    throw new Error(`Error updating composition: ${err}`);
  }
}

export async function deleteComposition(id: string) {
  if (!id) throw new Error("id required");
  try {
    await api.delete(`/products/composition/${id}`);
    return;
  } catch (err) {
    throw new Error(`Error deleting composition: ${err}`);
  }
}

export async function updateProductCost(productId: string) {
  try {
    const response = await api.patch(`/products/${productId}/update-cost`);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating product cost: ${error}`);
  }
}
