import { api } from "./api";

export interface Observation {
  id: string;
  description: string;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
  kitchens: string[];
  observations: Observation;
  categoryId: string;
  restaurantId: string | undefined;
}
export interface ProductInput {
  name: string;
  price: number;
  active: boolean;
  kitchenIds: string[];
  categoryId: string;
  restaurantId: string | undefined;
}

export interface AddObservationInput {
  productId: string;
  description: string;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  price?: number;
  active?: boolean;
  kitchenIds?: string[];
  observation?: any;
  restaurantId: string | undefined;
}
export interface UpdateObservationInput {
  id: string;
  observation?: any;
  restaurantId: string | undefined;
}

export async function createProduct(product: ProductInput) {
  if (!product) {
    throw new Error("Need's a data to create");
  }

  try {
    const response = await api.post("products", product);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function addObservation(i: AddObservationInput) {
  if (!i) {
    throw new Error("Need's a data to create");
  }

  try {
    const response = await api.post("products/addObservation", i);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function updateProduct(productData: UpdateProductInput) {
  if (!productData.restaurantId) {
    throw new Error("Need's a restaurant ID to edit");
  }

  try {
    const response = await api.patch(`/products/${productData.id}`, {
      name: productData.name,
      price: productData.price,
      active: productData.active,
      restaurantId: productData.restaurantId,
      kitchenIds: productData.kitchenIds, 
    });

    return response.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar produto: ${error}`);
  }
}


export async function updateObservations(productData: UpdateObservationInput) {
  try {
    const response = await api.patch(`/products/${productData.id}`, {
      observation: productData.observation,
      restaurantId: productData.restaurantId,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar produto: ${error}`);
  }
}

export async function deleteProduct(
  restaurantId: string | null,
  productId: string | null
) {
  try {
    await api.delete(`/products/${restaurantId}/${productId}`);
    return;
  } catch (error) {
    throw new Error(`Error to delete category: ${error}`);
  }
}

export async function deleteObservation(observationId: string) {
  try {
    await api.delete(`/products/observations/${observationId}`);
    return;
  } catch (error) {
    throw new Error(`Error to delete observation: ${error}`);
  }
}

export async function getById(
  restaurantId: string,
  productId: string | undefined
) {
  if (!restaurantId) {
    throw new Error("No products selected");
  }

  try {
    const response = await api.get<Product[]>(
      `/products/${restaurantId}/${productId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getAllByRestaurant(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error("Restaurant ID is required");
  }

  try {
    const response = await api.get<Product[]>(`/products/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getObservationsByProduct(productId: string | undefined) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const response = await api.get<Product[]>(
      `products/observations/${productId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getAllByCategory(categoryId: string) {
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
