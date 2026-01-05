import { api } from "./api";
import { Modifier } from "./modifier";

export interface ModifierCategory {
  id: string;
  name: string;
  restaurantId: string;
  modifiers?: Modifier[];
}

export interface CreateModifierCategoryInput {
  name: string;
  restaurantId: string;
}

export interface UpdateModifierCategoryInput {
  id: string;
  restaurantId: string;
  name?: string;
}

export async function createModifierCategory(
  data: CreateModifierCategoryInput
) {
  if (!data) throw new Error("Need data to create category");

  const response = await api.post("/modifier-categories", data);
  return response.data;
}

export async function getModifierCategories(restaurantId: string) {
  if (!restaurantId) {
    throw new Error("restaurantId é obrigatório");
  }

  const response = await api.get<ModifierCategory[]>(
    `/modifier-categories/restaurant/${restaurantId}`
  );


  return response.data;
}

export async function getProductModifierCategories(productId: string) {
  if (!productId) {
    throw new Error("productId é obrigatório");
  }

  const response = await api.get<ModifierCategory[]>(
    `/products/${productId}/modifier-categories`
  );

  return response.data;
}


export async function getModifiersByCategory(
  restaurantId: string,
  categoryId: string
) {
  const categories = await getModifierCategories(restaurantId);
  const category = categories.find((c) => c.id === categoryId);

  return category?.modifiers ?? [];
}

export async function getModifierCategoryById(
  id: string,
  restaurantId: string
) {
  if (!id || !restaurantId) {
    throw new Error("ID e restaurantId são obrigatórios");
  }

  const response = await api.get(
    `/modifier-categories/${id}/${restaurantId}`
  );

  return response.data;
}

export async function updateModifierCategory(
  data: UpdateModifierCategoryInput
) {
  if (!data.id || !data.restaurantId) {
    throw new Error("Missing id or restaurantId");
  }

  const response = await api.patch(
    `/modifier-categories/${data.id}`,
    {
      name: data.name,
      restaurantId: data.restaurantId,
    }
  );

  return response.data;
}

export async function deleteModifierCategory(
  id: string,
  restaurantId: string
) {
  if (!id || !restaurantId) {
    throw new Error("id e restaurantId são obrigatórios");
  }

  await api.delete(`/modifier-categories/${id}/${restaurantId}`);
}
