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
  try {
    const response = await api.get(`/categories/${categoryId}/products`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching products for category: ${error}`);
  }
}

export async function deleteCategory(categoryId: string, restaurantId: string) {
  try {
    await api.delete(`/categories/${restaurantId}/${categoryId}`);
    return;
  } catch (error) {
    throw new Error(`Error to delete category: ${error}`);
  }
}

export async function updateCategory(productData: UpdateCategoryInput) {
  if (!productData.restaurantId || !productData.categoryId) {
    throw new Error("Missing Data");
  }

  try {
    const response = await api.patch(`/category/${productData.categoryId}`, {
      name: productData.name,
      restaurantId: productData.restaurantId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Erro ao atualizar produto: ${error}`);
  }
}
