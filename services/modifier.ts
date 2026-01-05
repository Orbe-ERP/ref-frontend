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
  stockEffect?: "ADD" | "REMOVE" | null;
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
  opts?: AddModifierToProductOpts
) {
  const response = await api.post(
    `/modifiers/${restaurantId}/${modifierId}/add-to-product/${productId}`,
    opts
  );
  return response.data;
}


export async function createModifier(data: CreateModifierInput) {



  const response = await api.post("/modifiers", data);


  return response.data;
}

export async function getModifierById(id: string) {
  if (!id) throw new Error("Modifier id é obrigatório");

  const response = await api.get(`/modifiers/${id}`);
  return response.data;
}


export async function getModifiersProduct(productId: string) {
  if (!productId) throw new Error("Product id é obrigatório");

  const response = await api.get(`/modifiers/product/${productId}`);

  return response.data;
}

export async function updateModifier(
  id: string,
  data: Partial<CreateModifierInput>
) {
  if (!id) throw new Error("Modifier id é obrigatório");

  const response = await api.patch(`/modifiers/${id}`, data);
  return response.data;
}

export async function deleteModifier(
  id: string,
) {
  if (!id) {
    throw new Error("id é obrigatórios");
  }

  await api.delete(`/modifiers/${id}`);
}



export async function getModifiersByProductIds(productIds: string[]) {
  if (!productIds?.length) return [];

  const response = await api.post(
    "/modifiers/product-modifiers",
    { productIds }
  );

  return response.data;
}
