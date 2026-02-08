import { api } from "./api";

export interface Restaurant {
  id: string;
  name: string;
  tradeName?: string;
  cnpj?: string;
  stateRegistration?: string;
  address?: {
    street: string;
    houseNumber: string;
    city: string;
    neighborhood: string;
  };
}

export async function getRestaurants() {
  try {
    const response = await api.get<Restaurant[]>("restaurants");
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getRestaurantById(
  restaurantId: string,
): Promise<Restaurant> {
  if (!restaurantId) throw new Error("restaurantId is required");
  try {
    const response = await api.get<Restaurant>(`/restaurants/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter detalhes do restaurantee: ${error}`);
  }
}

export async function createRestaurant(
  restaurantData: Partial<Restaurant>,
): Promise<Restaurant> {
  try {
    const response = await api.post<Restaurant>("/restaurants", restaurantData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar restaurante: ${error}`);
  }
}

export async function updateRestaurant(
  restaurantId: string,
  updatedData: Partial<Restaurant>,
): Promise<Restaurant> {
  try {
    const response = await api.patch<Restaurant>(
      `/restaurants/${restaurantId}`,
      updatedData,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar restaurante: ${error}`);
  }
}

export async function deleteRestaurant(restaurantId: string): Promise<void> {
  try {
    await api.delete(`/restaurants/${restaurantId}`);
  } catch (error) {
    throw new Error(`Erro ao deletar restaurante: ${error}`);
  }
}
