import { api } from "./api";

export interface Modifier {
  id: string;
  name: string;
  type: 'ADD' | 'REMOVE';
  quantity: number;
  priceChange: number;
  stockItemId: string;
  categoryId?: string;
  restaurantId: string;
}

export interface CreateModifierInput {
  name: string;
  type: 'ADD' | 'REMOVE';
  quantity: number;
  priceChange?: number;
  stockItemId: string;
  categoryId?: string | null;
  restaurantId: string;
}

export async function createModifier(data: CreateModifierInput) {
  try {
    const response = await api.post("/modifiers", data);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating modifier: ${error}`);
  }
}

export async function getModifierById(id: string) {
  try {
    const response = await api.get(`/modifiers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching modifier: ${error}`);
  }
}

export async function updateModifier(id: string, data: Partial<CreateModifierInput>) {
  try {
    const response = await api.patch(`/modifiers/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating modifier: ${error}`);
  }
}

export async function deleteModifier(id: string, restaurantId: string) {
  try {
    await api.delete(`/modifiers/${id}`, { 
      data: { restaurantId }
    });
    return;
  } catch (error) {
    throw new Error(`Error deleting modifier: ${error}`);
  }
}

export async function getModifiersByProductIds(productIds: string[]) {
  try {
    const response = await api.post("/modifiers/product-modifiers", {
      productIds,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching modifiers for products: ${error}`);
  }
}

export async function addModifierToProduct(
  modifierId: string, 
  productId: string,
  restaurantId: string,
  opts?: { required?: boolean; limit?: number; default?: boolean }
) {
  try {
    const response = await api.post(
      `/modifiers/${restaurantId}/${modifierId}/add-to-product/${productId}`,
      opts
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error adding modifier to product: ${error}`);
  }
}
