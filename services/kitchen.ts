import { api } from "./api";

export interface Kitchen {
  id: string;
  name: string;
  products?: [];
}

export interface CreateKitchen {
  name: string;
  restaurantId: string | undefined;
}

export interface PatchKitchen {
  name: string;
  id: string | undefined;
}

export async function getKitchens(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error("Nenhum restaurante selecionado");
  }

  try {
    const response = await api.get<Kitchen[]>(
      `kitchen/restaurant/${restaurantId}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getByKitchenId(kitchenId: string) {
  try {
    const response = await api.get(`/kitchen/${kitchenId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter cozinha: ${error}`);
  }
}

export async function createKitchen({ name, restaurantId }: CreateKitchen) {
  try {
    const response = await api.post<CreateKitchen>(`/kitchen`, {
      name,
      restaurantId,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar cozinha: ${error}`);
  }
}

export async function deleteKitchen(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error(`ID do restaurante não definido`);
  }

  try {
    const response = await api.delete(`/kitchen/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao deletar cozinha: ${error}`);
  }
}

export async function patchKitchen(i: PatchKitchen) {
  if (!i) {
    throw new Error("Erro ao editar cozinha");
  }

  try {
    const response = await api.patch<PatchKitchen>(`/kitchen`, i);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Erro ao editar cozinha: ${error}`);
  }
}
