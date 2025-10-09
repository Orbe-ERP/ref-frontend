import { api } from "./api";

export interface Category {
  id: string;
  name: string;
  active?: boolean;
  products: [] | null;
  restaurantId: string;
}

export interface UpdateCategoryInput {
  name: string;
  restaurantId: string;
  categoryId: string;
}

export async function getCategories(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error("No restaurant selected");
  }

  try {
    const response = await api.get<Category[]>(
      `categories/restaurant/${restaurantId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function createCategory(category: Category) {
  if (!category) {
    throw new Error("Need's a data to create");
  }

  try {
    const response = await api.post("categories", category);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getProductsByCategoryId(categoryId: string) {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  try {
    const response = await api.get(`/products/category/${categoryId}`);

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching products for category: ${error}`);
  }
}

export async function deleteCategory(
  categoryId: string,
  restaurantId: string | null
) {
  try {
    if (!restaurantId) {
      throw new Error("No restaurant selected");
    }
    if (!categoryId) {
      throw new Error("Category ID is required");
    }
    await api.delete(`/categories/${restaurantId}/${categoryId}`);
    return;
  } catch (error) {
    throw new Error(`Error to delete category: ${error}`);
  }
}

export async function updateCategory(categoryData: UpdateCategoryInput) {
  if (!categoryData.restaurantId || !categoryData.categoryId) {
    throw new Error("Missing Data: restaurantId or id");
  }

  try {
    const response = await api.patch(
      `/categories/${categoryData.restaurantId}/${categoryData.categoryId}`,
      {
        name: categoryData.name,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar categoria:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar categoria"
    );
  }
}

