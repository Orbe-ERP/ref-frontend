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

export async function createModifierCategory(data: CreateModifierCategoryInput) {
  if (!data) throw new Error("Need data to create category");

  try {
    const response = await api.post("/modifier-categories", data);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating modifier category: ${error}`);
  }
}

export async function getModifierCategories(restaurantId: string | undefined) {
  if (!restaurantId) throw new Error("No restaurant selected");
  try {
    const response = await api.get<ModifierCategory[]>(
      `/modifier-categories/restaurant/${restaurantId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching modifier categories: ${error}`);
  }
}

export async function getModifierCategoryById(
  id: string,
  restaurantId: string
) {
  if (!id || !restaurantId) throw new Error("ID and restaurantId are required");
  try {
    const response = await api.get(
      `/modifier-categories/${id}/${restaurantId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching modifier category: ${error}`);
  }
}

export async function updateModifierCategory(
  data: UpdateModifierCategoryInput
) {
  if (!data.id || !data.restaurantId)
    throw new Error("Missing id or restaurantId");

  try {
    const response = await api.patch(
      `/modifier-categories/${data.id}`,
      { name: data.name, restaurantId: data.restaurantId }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error updating modifier category: ${error}`);
  }
}

export async function deleteModifierCategory(id: string, restaurantId: string) {
  if (!id || !restaurantId) throw new Error("id and restaurantId are required");
  
  try {
    await api.delete(`/modifier-categories/${id}/${restaurantId}`);
    return;
  } catch (error) {
    throw new Error(`Error deleting modifier category: ${error}`);
  }
}
