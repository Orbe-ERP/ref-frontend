import { api } from "./api";

export interface Kitchen {
  color: string;
  id: string;
  name: string;
  showOnKitchen: boolean;
  products?: [];
}

export interface CreateKitchen {
  name: string;
  restaurantId: string | undefined;
  showOnKitchen: boolean;
  color: string;
}

export interface PatchKitchen {
  id: string | undefined;
  name?: string;
  showOnKitchen?: boolean;
  color?: string;
}

export async function getKitchens(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error("Nenhum restaurante selecionado");
  }

  try {
    const response = await api.get<Kitchen[]>(
      `kitchen/restaurant/${restaurantId}`
    );

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

export async function createKitchen({
  name,
  restaurantId,
  showOnKitchen,
  color,
}: CreateKitchen) {
  if (!restaurantId) {
    throw new Error(`ID do restaurante não definido`);
  }
  try {
    const response = await api.post<CreateKitchen>(`/kitchen`, {
      name,
      restaurantId,
      showOnKitchen,
      color,
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
    throw new Error(`Erro ao editar cozinha: ${error}`);
  }
}
