import { api } from "./api";
import { StockItem, Unit } from "./stock";

export interface ProductComposition {
  id: string;
  productId: string;
  stockItemId: string;
  quantity: number;
  unit?: Unit
  createdAt?: string;
  kitchenId: string
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
  unit: Unit
  kitchenId: string
  restaurantId: string;
}) {
  const response = await api.post("/products/composition", payload);
  return response.data;
}

export async function updateComposition(
  id: string,
  data: { quantity?: number; unit?: Unit }
) {
  if (!id) throw new Error("id required");

  const response = await api.patch(`/product/composition/${id}`, data);

  console.log(response.data)
  return response.data;
}

export async function deleteComposition(id: string) {
  if (!id) throw new Error("id required");
  const request = await api.delete(`/products/composition/${id}`);
  const response = request.data;
  return response;
}

export async function updateProductCost(productId: string) {
  const response = await api.patch(`/products/${productId}/update-cost`);
  return response.data;
}
